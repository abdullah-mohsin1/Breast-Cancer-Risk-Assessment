import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Contribution } from '@/lib/api';
import { formatContribution, getContributionColor } from '@/lib/format';

interface ContributionChartProps {
  contributions: Contribution[];
}

export const ContributionChart: React.FC<ContributionChartProps> = ({ contributions }) => {
  if (!contributions || contributions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Feature Contributions</CardTitle>
          <CardDescription>
            No contribution data available for this prediction.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Prepare data for the chart
  const chartData = contributions.map((contrib, index) => ({
    feature: contrib.feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    contribution: contrib.contribution,
    absContribution: Math.abs(contrib.contribution),
    color: contrib.contribution >= 0 ? '#ef4444' : '#22c55e', // red for positive, green for negative
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className={`text-sm ${getContributionColor(data.contribution)}`}>
            Contribution: {formatContribution(data.contribution)}
          </p>
          <p className="text-xs text-gray-500">
            {data.contribution >= 0 ? 'Increases malignancy risk' : 'Decreases malignancy risk'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Contributions</CardTitle>
        <CardDescription>
          How each measurement contributes to the prediction. Positive values increase malignancy likelihood.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="feature" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                fontSize={12}
              />
              <YAxis 
                label={{ value: 'Contribution', angle: -90, position: 'insideLeft' }}
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="absContribution" 
                fill="#8884d8"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Positive → Higher malignancy likelihood</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Negative → Lower malignancy likelihood</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

