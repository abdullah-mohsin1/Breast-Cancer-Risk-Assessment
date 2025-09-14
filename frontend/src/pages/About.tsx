import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Disclaimer } from '@/components/Disclaimer';
import { 
  Microscope, 
  Shield, 
  Database, 
  Lock, 
  AlertTriangle,
  Users,
  FileText
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          About & Ethics
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Learn about the methodology, limitations, and ethical considerations of this research prototype.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Microscope className="h-5 w-5" />
              <span>Methodology</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              This prototype uses machine learning algorithms trained on breast cancer datasets 
              to analyze tumor characteristics and predict malignancy risk.
            </p>
            <div className="space-y-2">
              <h4 className="font-medium">Key Features:</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Analysis of tumor radius, texture, perimeter, and other characteristics</li>
                <li>Feature importance visualization</li>
                <li>Probability-based risk assessment</li>
                <li>Research-grade data collection</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Data & Privacy</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              All data is processed locally and stored securely for research purposes only.
            </p>
            <div className="space-y-2">
              <h4 className="font-medium">Privacy Measures:</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>No personal identifiers are collected</li>
                <li>Data is anonymized and aggregated</li>
                <li>Local processing ensures data control</li>
                <li>Research protocols protect participant privacy</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Research Purpose</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              This tool is designed to advance medical AI research and improve understanding 
              of breast cancer risk factors.
            </p>
            <div className="space-y-2">
              <h4 className="font-medium">Research Goals:</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Improve early detection methods</li>
                <li>Reduce false positives and negatives</li>
                <li>Understand feature importance in diagnosis</li>
                <li>Develop more accessible screening tools</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Limitations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              This prototype has significant limitations and should not be used for medical decisions.
            </p>
            <div className="space-y-2">
              <h4 className="font-medium">Known Limitations:</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Limited training data scope</li>
                <li>Potential algorithmic biases</li>
                <li>No clinical validation</li>
                <li>May not generalize to all populations</li>
                <li>Requires professional medical interpretation</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Disclaimer />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Contact & Support</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              For questions about this research prototype or to report issues, please contact abdullah.m@queensu.ca
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Medical Emergency:</strong> If you believe you have a medical emergency, 
                call your local emergency number immediately. Do not rely on this tool for urgent medical decisions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

