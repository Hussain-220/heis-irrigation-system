import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import SystemSelection from './pages/SystemSelection';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [currentSystem, setCurrentSystem] = useState(null);

  const handleSystemSelect = (system) => {
    setCurrentSystem(system);
  };

  const handleBack = () => {
    setCurrentSystem(null);
  };

  return (
    <div className="app">
      <Navbar />
      <AnimatePresence mode="wait">
        {!currentSystem ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <SystemSelection onSelect={handleSystemSelect} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Dashboard systemType={currentSystem} onBack={handleBack} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
