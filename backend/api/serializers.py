# backend/api/serializers.py
from rest_framework import serializers
from .models import Submission

class SubmissionReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = [
            "id",
            "created_at",
            "input_data",
            "prediction_label",
            "probability_malignant",
            "model_version",
            "confirmed_label",
            "confirmed_at",
        ]

class ConfirmSerializer(serializers.Serializer):
    submission_id = serializers.IntegerField()
    # 0 = benign, 1 = malignant (match your README)
    confirmed_label = serializers.IntegerField(min_value=0, max_value=1)