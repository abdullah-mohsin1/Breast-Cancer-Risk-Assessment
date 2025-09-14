"""
API views for breast cancer detector.
"""
import logging
from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone

from .models import Submission
from .serializers import SubmissionReadSerializer, ConfirmSerializer
from inference.predictor import predict, get_schema

logger = logging.getLogger(__name__)


@api_view(['GET'])
def health_check(request):
    """Health check endpoint."""
    return JsonResponse({"status": "ok"})


@api_view(['GET'])
def get_feature_schema(request):
    """Get the feature schema for dynamic form generation."""
    try:
        schema = get_schema()
        return Response(schema)
    except Exception as e:
        logger.error(f"Error loading schema: {e}")
        return Response(
            {"error": "Failed to load feature schema"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def predict_cancer_risk(request):
    """
    Predict cancer risk based on input features.
    
    Expected input: JSON object with feature names as keys and numeric values
    """
    try:
        # Get input data
        input_data = request.data
        
        if not isinstance(input_data, dict):
            return Response(
                {"error": "Input must be a JSON object"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate that we have numeric values
        try:
            numeric_data = {k: float(v) for k, v in input_data.items()}
        except (ValueError, TypeError) as e:
            return Response(
                {"error": f"All values must be numeric: {e}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get schema to validate required features
        schema = get_schema()
        required_features = {f["name"] for f in schema["features"] if f.get("required", False)}
        
        # Check for missing required features
        missing_features = required_features - set(numeric_data.keys())
        if missing_features:
            return Response(
                {"error": f"Missing required features: {list(missing_features)}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Make prediction
        prediction_label, probability_malignant, top_contributions, model_version = predict(numeric_data)
        
        # Create submission record
        submission = Submission.objects.create(
            input_json=numeric_data,
            prediction_label=prediction_label,
            probability_malignant=probability_malignant,
            top_contributions=top_contributions,
            model_version=model_version
        )
        
        # Return response
        response_data = {
            "submission_id": submission.id,
            "prediction_label": prediction_label,
            "probability_malignant": probability_malignant,
            "top_contributions": top_contributions,
            "model_version": model_version
        }
        
        logger.info(f"Prediction created: submission_id={submission.id}, label={prediction_label}")
        return Response(response_data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f"Error in prediction endpoint: {e}")
        return Response(
            {"error": "Internal server error during prediction"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def confirm_outcome(request):
    """
    Confirm the actual outcome from a doctor.
    
    Expected input: {"submission_id": int, "confirmed_label": int}
    where confirmed_label is 0 for benign, 1 for malignant
    """
    try:
        serializer = ConfirmSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        submission_id = serializer.validated_data['submission_id']
        confirmed_label = serializer.validated_data['confirmed_label']
        
        # Get the submission
        try:
            submission = Submission.objects.get(id=submission_id)
        except Submission.DoesNotExist:
            return Response(
                {"error": "Submission not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Update with confirmation
        submission.confirmed_label = confirmed_label
        submission.confirmed_at = timezone.now()
        submission.save()
        
        logger.info(f"Outcome confirmed: submission_id={submission_id}, confirmed_label={confirmed_label}")
        
        return Response({
            "status": "ok",
            "submission_id": submission_id,
            "confirmed_label": confirmed_label
        })
        
    except Exception as e:
        logger.error(f"Error in confirmation endpoint: {e}")
        return Response(
            {"error": "Internal server error during confirmation"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_submission(request, submission_id):
    """
    Get a specific submission by ID.
    """
    try:
        submission = Submission.objects.get(id=submission_id)
        serializer = SubmissionReadSerializer(submission)
        return Response(serializer.data)
    except Submission.DoesNotExist:
        return Response(
            {"error": "Submission not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error retrieving submission {submission_id}: {e}")
        return Response(
            {"error": "Internal server error"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

