import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './OutputMetrics.css';

function Counter({ from = 0, to, duration = 2, decimals = 2 }) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    let animationFrame;
    let currentValue = from;
    const startTime = Date.now();
    const difference = to - from;

    const animate = () => {
      const currentTime = Date.now();
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      currentValue = from + difference * progress;

      if (decimals === 0) {
        setCount(Math.floor(currentValue));
      } else {
        setCount(currentValue.toFixed(decimals));
      }

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [from, to, duration, decimals]);

  return <span>{count}</span>;
}

function OutputMetrics({ summary }) {
  const metrics = [
    {
      label: 'System Flow',
      value: parseFloat(summary.systemFlow),
      unit: 'LPS',
      icon: '💧',
      color: 'blue',
    },
    {
      label: 'Operating Time',
      value: parseFloat(summary.operatingTime),
      unit: 'hrs',
      icon: '⏱️',
      color: 'green',
    },
    {
      label: 'Total Dynamic Head',
      value: parseFloat(summary.totalHead),
      unit: 'm',
      icon: '📐',
      color: 'purple',
    },
    {
      label: 'Pump Power Required',
      value: parseFloat(summary.pumpPower),
      unit: 'HP',
      icon: '⚙️',
      color: 'orange',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      className="output-metrics"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          className={`metric-card metric-${metric.color}`}
          variants={itemVariants}
          whileHover={{ scale: 1.05, translateY: -4 }}
        >
          <div className="metric-icon">{metric.icon}</div>
          <div className="metric-content">
            <p className="metric-label">{metric.label}</p>
            <div className="metric-value">
              <Counter from={0} to={metric.value} duration={2} decimals={2} />
              <span className="metric-unit">{metric.unit}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default OutputMetrics;
