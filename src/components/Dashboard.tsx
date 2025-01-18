import React, { useState, useEffect } from 'react';
import { LifeSimulation } from '@/types/simulation';
import { SimulationCard } from './SimulationCard';
import { Plus, Loader2, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { NewSimulationModal } from './NewSimulationModal';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [simulations, setSimulations] = useState<LifeSimulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewSimulationModalOpen, setIsNewSimulationModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadSimulations();
    } else {
      setSimulations([]);
      setLoading(false);
    }
  }, [user]);

  const loadSimulations = async () => {
    try {
      const { data: sims, error } = await supabase
        .from('simulations')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSimulations(sims || []);
    } catch (error) {
      console.error('Error loading simulations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExplore = (simulation: LifeSimulation) => {
    // Handle exploration logic
    console.log('Exploring simulation:', simulation);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-indigo-50 to-white">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-lg text-gray-600 animate-pulse">Loading your parallel universes...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[80vh] px-4"
      >
        <Sparkles className="w-16 h-16 text-indigo-600 mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Discover Your Parallel Lives
        </h2>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
          Sign in to explore alternate versions of your life and see how different choices could shape your future.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-indigo-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Parallel Lives</h1>
            <p className="text-lg text-gray-600">Explore the infinite possibilities of your life journey</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              onClick={() => setIsNewSimulationModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-semibold h-14 px-8"
            >
              <Plus className="w-6 h-6 mr-2" />
              New Simulation
            </Button>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {simulations.map((simulation, index) => (
            <motion.div
              key={simulation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SimulationCard
                simulation={simulation}
                onExplore={handleExplore}
              />
            </motion.div>
          ))}
        </div>

        {simulations.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white rounded-2xl shadow-xl border border-gray-100"
          >
            <Sparkles className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Begin Your Journey of Possibilities
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create your first simulation to explore how different choices could shape your life's path
            </p>
            <Button
              onClick={() => setIsNewSimulationModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Start Your First Simulation
            </Button>
          </motion.div>
        )}
      </div>

      <NewSimulationModal
        isOpen={isNewSimulationModalOpen}
        onClose={() => setIsNewSimulationModalOpen(false)}
        onSuccess={loadSimulations}
      />
    </motion.div>
  );
};