import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { AlertTriangle } from 'lucide-react';

interface ConsentDialogProps {
  open: boolean;
  onAccept: () => void;
}

export const ConsentDialog: React.FC<ConsentDialogProps> = ({ open, onAccept }) => {
  const [hasAccepted, setHasAccepted] = useState(false);

  // Check if user has already accepted consent
  useEffect(() => {
    const accepted = localStorage.getItem('breast-cancer-consent-accepted');
    if (accepted === 'true') {
      onAccept();
    }
  }, [onAccept]);

  const handleAccept = () => {
    localStorage.setItem('breast-cancer-consent-accepted', 'true');
    onAccept();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Research Consent</DialogTitle>
          <DialogDescription>
            Please read and accept the following terms before using this research prototype.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>This tool is for research and educational purposes only and is not a medical device or diagnostic tool.</strong> It may be inaccurate or incomplete. Do not rely on it to make medical decisions. Always consult a qualified healthcare professional.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <h4 className="font-medium">By using this tool, you understand that:</h4>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>This is a research prototype, not a medical device</li>
              <li>Results should not be used for medical decision-making</li>
              <li>You should always consult qualified healthcare professionals</li>
              <li>Your data may be used for research purposes</li>
              <li>Results may be inaccurate or incomplete</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => window.location.href = 'https://www.cancer.org/'}
            className="w-full sm:w-auto"
          >
            Learn More About Cancer
          </Button>
          <Button
            onClick={handleAccept}
            disabled={!hasAccepted}
            className="w-full sm:w-auto"
          >
            I Understand and Accept
          </Button>
        </DialogFooter>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="consent-checkbox"
            checked={hasAccepted}
            onChange={(e) => setHasAccepted(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="consent-checkbox" className="text-sm text-gray-600">
            I understand this is a research prototype and not medical advice.
          </label>
        </div>
      </DialogContent>
    </Dialog>
  );
};

