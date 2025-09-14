import React from 'react';
import { ConfirmForm } from '@/components/ConfirmForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users } from 'lucide-react';

export const Confirm: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Confirm Doctor Outcome
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Help improve the model by providing doctor-confirmed outcomes for previous predictions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ConfirmForm />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>How to Find Submission ID</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <p>1. Go back to the Home page</p>
                <p>2. Submit a prediction</p>
                <p>3. Copy the Submission ID from the result</p>
                <p>4. Return here to confirm the outcome</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Why Confirm?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  Doctor-confirmed outcomes help researchers improve the accuracy 
                  and reliability of the prediction model.
                </p>
                <p>
                  Your contribution helps advance medical AI research while 
                  maintaining patient privacy.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

