/**
 * Utility functions for formatting data
 */

export const formatProbability = (probability: number): string => {
  return `${(probability * 100).toFixed(1)}%`;
};

export const formatContribution = (contribution: number): string => {
  const sign = contribution >= 0 ? '+' : '';
  return `${sign}${contribution.toFixed(3)}`;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

export const getPredictionColor = (label: 'benign' | 'malignant'): string => {
  return label === 'malignant' ? 'text-red-600' : 'text-green-600';
};

export const getPredictionBgColor = (label: 'benign' | 'malignant'): string => {
  return label === 'malignant' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200';
};

export const getContributionColor = (contribution: number): string => {
  if (contribution > 0) return 'text-red-600';
  if (contribution < 0) return 'text-green-600';
  return 'text-gray-600';
};

