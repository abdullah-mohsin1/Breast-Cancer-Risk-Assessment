import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Feature {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
}

export interface Schema {
  features: Feature[];
}

export interface PredictionRequest {
  [key: string]: number;
}

export interface Contribution {
  feature: string;
  contribution: number;
}

export interface PredictionResponse {
  submission_id: number;
  prediction_label: 'benign' | 'malignant';
  probability_malignant: number;
  top_contributions: Contribution[];
  model_version: string;
}

export interface ConfirmRequest {
  submission_id: number;
  confirmed_label: 0 | 1;
}

export interface ConfirmResponse {
  status: string;
  submission_id: number;
  confirmed_label: number;
}

export interface Submission extends PredictionResponse {
  submitted_at: string;
  confirmed_label?: number;
  confirmed_at?: string;
}

// API functions
export const getSchema = async (): Promise<Schema> => {
  const response = await api.get('/api/schema/');
  return response.data;
};

export const predict = async (data: PredictionRequest): Promise<PredictionResponse> => {
  const response = await api.post('/api/predict/', data);
  return response.data;
};

export const confirm = async (data: ConfirmRequest): Promise<ConfirmResponse> => {
  const response = await api.post('/api/confirm/', data);
  return response.data;
};

export const getSubmission = async (id: number): Promise<Submission> => {
  const response = await api.get(`/api/submissions/${id}/`);
  return response.data;
};

export const healthCheck = async (): Promise<{ status: string }> => {
  const response = await api.get('/api/health/');
  return response.data;
};

