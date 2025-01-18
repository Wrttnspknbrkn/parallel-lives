import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { Button } from './ui/Button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface NewSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewSimulationModal({ isOpen, onClose, onSuccess }: NewSimulationModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    careerPath: '',
    location: '',
    interests: [''],
    keyDecisions: [''],
  });
  const [error, setError] = useState('');

  const handleInterestChange = (index: number, value: string) => {
    const newInterests = [...formData.interests];
    newInterests[index] = value;
    setFormData({ ...formData, interests: newInterests });
  };

  const handleDecisionChange = (index: number, value: string) => {
    const newDecisions = [...formData.keyDecisions];
    newDecisions[index] = value;
    setFormData({ ...formData, keyDecisions: newDecisions });
  };

  const addInterest = () => {
    setFormData({ ...formData, interests: [...formData.interests, ''] });
  };

  const addDecision = () => {
    setFormData({ ...formData, keyDecisions: [...formData.keyDecisions, ''] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      // Filter out empty strings
      const interests = formData.interests.filter(Boolean);
      const keyDecisions = formData.keyDecisions.filter(Boolean);

      // Generate random scores for demo purposes
      // In a real app, this would be calculated by AI
      const generateScore = () => Math.floor(Math.random() * 41) + 60; // 60-100

      const { error: dbError } = await supabase.from('simulations').insert({
        user_id: user.id,
        career_path: formData.careerPath,
        location: formData.location,
        interests,
        key_decisions: keyDecisions,
        financial_score: generateScore(),
        happiness_score: generateScore(),
        career_score: generateScore(),
        relationships_score: generateScore(),
      });

      if (dbError) throw dbError;

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Create New Simulation</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="careerPath" className="block text-sm font-medium text-gray-700 mb-1">
                  Career Path
                </label>
                <input
                  type="text"
                  id="careerPath"
                  value={formData.careerPath}
                  onChange={(e) => setFormData({ ...formData, careerPath: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  placeholder="e.g., Software Engineer"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  placeholder="e.g., San Francisco, CA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interests
                </label>
                {formData.interests.map((interest, index) => (
                  <div key={index} className="mb-2">
                    <input
                      type="text"
                      value={interest}
                      onChange={(e) => handleInterestChange(index, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Technology, Travel, Art"
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={addInterest}
                  variant="outline"
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Interest
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Life Decisions
                </label>
                {formData.keyDecisions.map((decision, index) => (
                  <div key={index} className="mb-2">
                    <input
                      type="text"
                      value={decision}
                      onChange={(e) => handleDecisionChange(index, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Study abroad, Start a business"
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={addDecision}
                  variant="outline"
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Decision
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Create Simulation
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}