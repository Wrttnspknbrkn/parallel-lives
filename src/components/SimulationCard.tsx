import React from 'react';
import { LifeSimulation } from '@/types/simulation';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MapPin, Briefcase, Heart, DollarSign, Clock } from 'lucide-react';
import { Button } from './ui/Button';
import { motion } from 'framer-motion';

interface SimulationCardProps {
  simulation: LifeSimulation;
  onExplore: (simulation: LifeSimulation) => void;
}

export const SimulationCard: React.FC<SimulationCardProps> = ({ simulation, onExplore }) => {
  const chartData = [
    { name: 'Start', value: 50 },
    { name: '5y', value: simulation.career_score },
    { name: '10y', value: simulation.financial_score },
    { name: '15y', value: simulation.happiness_score },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{simulation.career_path}</h3>
          <div className="flex items-center text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full w-fit">
            <MapPin className="w-4 h-4 mr-2 text-indigo-600" />
            <span className="text-sm font-medium">{simulation.location}</span>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center bg-blue-50 text-blue-800 px-4 py-2 rounded-lg shadow-sm"
          >
            <Briefcase className="w-4 h-4 mr-2" />
            <span className="font-semibold">{simulation.career_score}%</span>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center bg-green-50 text-green-800 px-4 py-2 rounded-lg shadow-sm"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            <span className="font-semibold">{simulation.financial_score}%</span>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center bg-red-50 text-red-800 px-4 py-2 rounded-lg shadow-sm"
          >
            <Heart className="w-4 h-4 mr-2" />
            <span className="font-semibold">{simulation.happiness_score}%</span>
          </motion.div>
        </div>
      </div>

      <div className="h-48 mb-6 bg-white rounded-lg p-4 shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis 
              dataKey="name" 
              stroke="#6366f1"
              tick={{ fill: '#4b5563' }}
            />
            <YAxis 
              stroke="#6366f1"
              tick={{ fill: '#4b5563' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#6366f1" 
              strokeWidth={3}
              dot={{ fill: '#6366f1', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#4f46e5' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {simulation.interests.map((interest, index) => (
            <motion.span
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm"
            >
              {interest}
            </motion.span>
          ))}
        </div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button
            onClick={() => onExplore(simulation)}
            variant="default"
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
          >
            <Clock className="w-5 h-5 mr-2" />
            Explore Timeline
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};