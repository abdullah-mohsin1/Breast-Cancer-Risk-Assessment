import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { getSchema, predict, type Feature, type PredictionResponse } from '@/lib/api';
import { Loader2, Info } from 'lucide-react';
import { FEATURE_HELP } from '@/lib/featureHelp';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MeasurementFormProps {
  onPrediction: (prediction: PredictionResponse) => void;
}

export const MeasurementForm: React.FC<MeasurementFormProps> = ({ onPrediction }) => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create dynamic validation schema based on features
  const createValidationSchema = (features: Feature[]) => {
    const schemaFields: Record<string, z.ZodTypeAny> = {};
    
    features.forEach(feature => {
      if (feature.required) {
        let fieldSchema = z.number({
          required_error: `${feature.label} is required`,
          invalid_type_error: `${feature.label} must be a number`,
        });
        
        if (feature.min !== undefined) {
          fieldSchema = fieldSchema.min(
            feature.min,
            `${feature.label} must be at least ${feature.min}`
          );
        }
        
        if (feature.max !== undefined) {
          fieldSchema = fieldSchema.max(
            feature.max,
            `${feature.label} must be at most ${feature.max}`
          );
        }
        
        schemaFields[feature.name] = fieldSchema;
      } else {
        schemaFields[feature.name] = z.number().optional().default(0);
      }
    });
    
    return z.object(schemaFields);
  };

  const validationSchema = createValidationSchema(features);
  type FormData = z.infer<typeof validationSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(validationSchema),
  });

  // Load schema on component mount
  useEffect(() => {
    const loadSchema = async () => {
      try {
        const schema = await getSchema();
        setFeatures(schema.features);
      } catch (err) {
        setError('Failed to load measurement form. Please refresh the page.');
        console.error('Error loading schema:', err);
      }
    };

    loadSchema();
  }, []);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    try {
      // Convert form data to the format expected by the API
      const predictionData: Record<string, number> = {};
      features.forEach(feature => {
        const value = data[feature.name as keyof FormData];
        if (value !== undefined && value !== null) {
          predictionData[feature.name] = value;
        }
      });

      const prediction = await predict(predictionData);
      onPrediction(prediction);
      reset();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to make prediction. Please try again.');
      console.error('Error making prediction:', err);
    } finally {
      setLoading(false);
    }
  };

  if (features.length === 0 && !error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading measurement form...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Breast Cancer Risk Assessment</CardTitle>
        <CardDescription>
          Please enter the tumor/cyst measurements below. All fields are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="mb-4 text-sm text-muted-foreground">
            Don't measure these yourself. Enter values from your radiology/pathology report or imaging software.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature) => (
              <div key={feature.name} className="space-y-2">
                <Label htmlFor={feature.name} className="flex items-center gap-2">
                  <span>{feature.label}</span>
                  {feature.required && <span className="text-red-500 ml-0.5">*</span>}

                  {/* Help tooltip */}
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex items-center text-muted-foreground hover:text-foreground"
                          aria-label={`Help for ${feature.label}`}
                        >
                          <Info className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs text-sm leading-snug">
                        <div className="space-y-1.5">
                          <div><strong>What:</strong> {FEATURE_HELP[feature.name]?.what ?? "Numeric measurement from report."}</div>
                          {FEATURE_HELP[feature.name]?.unit && (
                            <div><strong>Units:</strong> {FEATURE_HELP[feature.name]?.unit}</div>
                          )}
                          <div><strong>How measured:</strong> {FEATURE_HELP[feature.name]?.how ?? "Taken from imaging/software output."}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>

                <Input
                  id={feature.name}
                  type="number"
                  step="any"                 // allow any decimal; prevents browser "valid value" errors
                  inputMode="decimal"        // nicer mobile keyboard
                  min={feature.min ?? undefined}
                  max={feature.max ?? undefined}
                  placeholder={
                    FEATURE_HELP[feature.name]?.unit
                      ? `${feature.placeholder ?? ""} ${FEATURE_HELP[feature.name]!.unit}`
                      : feature.placeholder ?? ""
                  }
                  {...register(feature.name as any, {
                    valueAsNumber: true,
                    required: feature.required ? `${feature.label} is required` : false,
                  })}
                  className={errors[feature.name as keyof typeof errors] ? "border-red-500" : ""}
                />
                {errors[feature.name as keyof typeof errors] && (
                  <p className="text-sm text-red-600">
                    {String(errors[feature.name as keyof typeof errors]?.message || '')}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                'Analyze Risk'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

