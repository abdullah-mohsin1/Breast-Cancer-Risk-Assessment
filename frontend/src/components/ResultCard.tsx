import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { PredictionResponse } from '@/lib/api';
import { formatProbability, getPredictionColor, getPredictionBgColor } from '@/lib/format';
import { Shield, AlertTriangle } from 'lucide-react';

interface ResultCardProps {
  prediction: PredictionResponse;
}

export const ResultCard: React.FC<ResultCardProps> = ({ prediction }) => {
  const { prediction_label, probability_malignant, model_version, submission_id } = prediction;
  
  const isMalignant = prediction_label === 'malignant';
  const probabilityPercent = formatProbability(probability_malignant);
  
  const getResultIcon = () => {
    return isMalignant ? (
      <AlertTriangle className="h-8 w-8 text-red-600" />
    ) : (
      <Shield className="h-8 w-8 text-green-600" />
    );
  };

  const getResultDescription = () => {
    if (isMalignant) {
      return `The model suggests a ${probabilityPercent} probability of malignancy based on the provided measurements. This indicates higher risk features that warrant further medical evaluation.`;
    } else {
      return `The model suggests a ${probabilityPercent} probability of malignancy based on the provided measurements. This indicates lower risk features, but regular monitoring is still recommended.`;
    }
  };

  return (
    <Card className={`${getPredictionBgColor(prediction_label)} border-2`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getResultIcon()}
            <div>
              <CardTitle className="text-2xl">
                {isMalignant ? 'Likely Malignant' : 'Likely Benign'}
              </CardTitle>
              <CardDescription>
                Submission ID: {submission_id} • Model: {model_version}
              </CardDescription>
            </div>
          </div>
          <Badge 
            variant={isMalignant ? 'destructive' : 'default'}
            className="text-lg px-4 py-2"
          >
            {probabilityPercent}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-white/50 rounded-lg p-4">
          <p className="text-gray-700 leading-relaxed">
            {getResultDescription()}
          </p>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Important Medical Disclaimer:</p>
              <p>
                This result is for research purposes only and should not be used for medical decision-making. 
                Always consult with qualified healthcare professionals for proper medical evaluation and diagnosis.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

