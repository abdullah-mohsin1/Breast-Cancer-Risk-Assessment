import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { confirm, type ConfirmResponse } from '@/lib/api';
import { Loader2, CheckCircle } from 'lucide-react';

const confirmSchema = z.object({
  submission_id: z.number({
    required_error: 'Submission ID is required',
    invalid_type_error: 'Submission ID must be a number',
  }).min(1, 'Submission ID must be positive'),
  confirmed_label: z.enum(['0', '1'], {
    required_error: 'Please select an outcome',
  }),
});

type ConfirmFormData = z.infer<typeof confirmSchema>;

export const ConfirmForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<ConfirmResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmSchema),
  });

  const onSubmit = async (data: ConfirmFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await confirm({
        submission_id: data.submission_id,
        confirmed_label: parseInt(data.confirmed_label) as 0 | 1,
      });
      
      setSuccess(result);
      reset();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to confirm outcome. Please try again.');
      console.error('Error confirming outcome:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confirm Doctor Outcome</CardTitle>
        <CardDescription>
          Enter the submission ID and the doctor-confirmed outcome to help improve the model.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>
                  Successfully confirmed outcome for submission {success.submission_id} as{' '}
                  {success.confirmed_label === 1 ? 'malignant' : 'benign'}.
                </span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="submission_id">
                Submission ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="submission_id"
                type="number"
                placeholder="e.g., 123"
                {...register('submission_id', { valueAsNumber: true })}
                className={errors.submission_id ? 'border-red-500' : ''}
              />
              {errors.submission_id && (
                <p className="text-sm text-red-600">
                  {errors.submission_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmed_label">
                Doctor-Confirmed Outcome <span className="text-red-500">*</span>
              </Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="benign"
                    value="0"
                    {...register('confirmed_label')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <Label htmlFor="benign" className="text-sm font-normal">
                    Benign (Non-cancerous)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="malignant"
                    value="1"
                    {...register('confirmed_label')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <Label htmlFor="malignant" className="text-sm font-normal">
                    Malignant (Cancerous)
                  </Label>
                </div>
              </div>
              {errors.confirmed_label && (
                <p className="text-sm text-red-600">
                  {errors.confirmed_label.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Confirming...
                </>
              ) : (
                'Confirm Outcome'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

