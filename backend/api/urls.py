"""
URL configuration for API app.
"""
from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health_check, name='health'),
    path('schema/', views.get_feature_schema, name='schema'),
    path('predict/', views.predict_cancer_risk, name='predict'),
    path('confirm/', views.confirm_outcome, name='confirm'),
    path('submissions/<int:submission_id>/', views.get_submission, name='get_submission'),
]

