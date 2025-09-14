"""
API models for breast cancer detector.
"""
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Submission(models.Model):
    """Model to store prediction submissions and confirmations."""
    
    PREDICTION_CHOICES = [
        ('benign', 'Benign'),
        ('malignant', 'Malignant'),
    ]
    
    # Auto-generated fields
    id = models.AutoField(primary_key=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    
    # Input data
    input_json = models.JSONField(help_text="Raw input features as received from client")
    
    # Prediction results
    prediction_label = models.CharField(
        max_length=20, 
        choices=PREDICTION_CHOICES,
        help_text="Predicted label (benign/malignant)"
    )
    probability_malignant = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)],
        help_text="Probability of malignancy (0.0 to 1.0)"
    )
    top_contributions = models.JSONField(
        null=True, 
        blank=True,
        help_text="Top feature contributions as list of {feature, contribution}"
    )
    model_version = models.CharField(
        max_length=50, 
        default="unknown",
        help_text="Version of the model used for prediction"
    )
    
    # Doctor confirmation (optional)
    confirmed_label = models.IntegerField(
        null=True, 
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(1)],
        help_text="Doctor-confirmed outcome: 0=benign, 1=malignant"
    )
    confirmed_at = models.DateTimeField(
        null=True, 
        blank=True,
        help_text="When the doctor confirmation was submitted"
    )
    
    class Meta:
        ordering = ['-submitted_at']
        verbose_name = "Prediction Submission"
        verbose_name_plural = "Prediction Submissions"
    
    def __str__(self):
        return f"Submission {self.id} - {self.prediction_label} ({self.probability_malignant:.3f})"
    
    @property
    def is_confirmed(self):
        """Check if this submission has been confirmed by a doctor."""
        return self.confirmed_label is not None

