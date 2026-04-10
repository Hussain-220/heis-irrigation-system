import React from 'react';
import { motion } from 'framer-motion';
import './SystemSelection.css';

function SystemSelection({ onSelect }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const hoverVariants = {
    scale: 1.05,
    transition: { duration: 0.3 },
  };

  return (
    <div className="selection-container">
      <motion.div
        className="selection-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>HEIS</h1>
        <p>High-Efficiency Irrigation System Designer</p>
        <p className="subtitle">Select your irrigation system type to begin</p>
      </motion.div>

      <motion.div
        className="systems-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Drip System Card */}
        <motion.div
          className="system-card drip-card"
          variants={itemVariants}
          whileHover={hoverVariants}
          onClick={() => onSelect('drip')}
        >
          <div className="card-icon">💧</div>
          <h2>Micro-Drip Irrigation</h2>
          <p>High-efficiency water delivery directly to plant root zones</p>
          <ul className="benefits">
            <li>✓ 90-95% water efficiency</li>
            <li>✓ Reduced fertilizer usage</li>
            <li>✓ Lower operating pressures</li>
            <li>✓ Ideal for orchards & gardens</li>
          </ul>
          <motion.button
            className="select-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Select Drip
          </motion.button>
        </motion.div>

        {/* Sprinkler System Card */}
        <motion.div
          className="system-card sprinkler-card"
          variants={itemVariants}
          whileHover={hoverVariants}
          onClick={() => onSelect('sprinkler')}
        >
          <div className="card-icon">💦</div>
          <h2>Overhead Sprinkler Irrigation</h2>
          <p>Wide-coverage irrigation system for large agricultural areas</p>
          <ul className="benefits">
            <li>✓ Covers large areas quickly</li>
            <li>✓ Flexible layout options</li>
            <li>✓ Less labor-intensive</li>
            <li>✓ Suitable for field crops</li>
          </ul>
          <motion.button
            className="select-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Select Sprinkler
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default SystemSelection;
