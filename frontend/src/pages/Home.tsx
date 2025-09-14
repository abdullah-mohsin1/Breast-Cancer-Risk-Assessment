import React, { useState } from 'react';
import { MeasurementForm } from '@/components/MeasurementForm';
import { ResultCard } from '@/components/ResultCard';
import { ContributionChart } from '@/components/ContributionChart';
import { PredictionResponse } from '@/lib/api';

export const Home: React.FC = () => {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);

  const handlePrediction = (pred: PredictionResponse) => {
    setPrediction(pred);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Breast Cancer Risk Assessment
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Enter tumor/cyst measurements to receive a research-based risk assessment. 
          This tool is for educational purposes only and should not be used for medical decision-making.
        </p>
      </div>

      <MeasurementForm onPrediction={handlePrediction} />

      {prediction && (
        <div className="space-y-6">
          <ResultCard prediction={prediction} />
          <ContributionChart contributions={prediction.top_contributions} />
        </div>
      )}
    </div>
  );
};

