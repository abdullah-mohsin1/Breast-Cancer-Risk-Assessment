import React from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { AlertTriangle, Shield, FileText } from 'lucide-react';

export const Disclaimer: React.FC = () => {
  return (
    <div className="space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>This tool is for research/education only and must not be used to make medical decisions. Always consult a qualified clinician.</strong>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold">Research Purpose</h3>
          </div>
          <p className="text-gray-600 text-sm">
            This prototype is designed for research and educational purposes to explore machine learning applications in medical imaging analysis.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
            <h3 className="text-lg font-semibold">Not Medical Advice</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Results from this tool should never be used as the sole basis for medical decisions. Always seek professional medical evaluation.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold">Data Privacy</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Your data may be used for research purposes. All submissions are stored locally and handled according to research protocols.
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">Important Limitations</h3>
        <ul className="text-yellow-700 text-sm space-y-2 list-disc list-inside">
          <li>This tool may produce inaccurate or incomplete results</li>
          <li>It should not replace professional medical evaluation</li>
          <li>Results are based on limited data and may not apply to all cases</li>
          <li>Machine learning models have inherent limitations and biases</li>
          <li>Always consult with qualified healthcare professionals for medical decisions</li>
        </ul>
      </div>
    </div>
  );
};

