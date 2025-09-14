"""
Admin configuration for API app.
"""
from django.contrib import admin
from .models import Submission


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    """Admin interface for Submission model."""
    
    list_display = [
        'id', 
        'submitted_at', 
        'prediction_label', 
        'probability_malignant', 
        'model_version',
        'is_confirmed',
        'confirmed_at'
    ]
    list_filter = [
        'prediction_label', 
        'model_version', 
        'submitted_at',
        'confirmed_label'
    ]
    search_fields = ['id', 'model_version']
    readonly_fields = ['id', 'submitted_at', 'confirmed_at']
    ordering = ['-submitted_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'submitted_at', 'model_version')
        }),
        ('Input Data', {
            'fields': ('input_json',)
        }),
        ('Prediction Results', {
            'fields': ('prediction_label', 'probability_malignant', 'top_contributions')
        }),
        ('Doctor Confirmation', {
            'fields': ('confirmed_label', 'confirmed_at'),
            'classes': ('collapse',)
        }),
    )

