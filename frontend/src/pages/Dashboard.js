import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import InputForm from '../components/InputForm';
import OutputMetrics from '../components/OutputMetrics';
import BOQTable from '../components/BOQTable';
import ChartComparison from '../components/ChartComparison';
import './Dashboard.css';

function Dashboard({ systemType, onBack }) {
  const [formData, setFormData] = useState(getDefaultFormData(systemType));
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  function getDefaultFormData(system) {
    const common = {
      acres: 1,
      operatingHours: 8,
      elevationChange: 0,
      pumpEfficiency: 0.75,
    };

    if (system === 'drip') {
      return {
        ...common,
        systemType: 'drip',
        ET0: 5,
        Kc: 0.8,
        ECw: 0.5,
        ECe: 2,
        plantSpacing: 0.5,
        rowSpacing: 1,
        plantsPerAcre: 2000,
        dripperOperatingPressure: 2,
        lateralLength: 500,
        lateralDiameter: 16,
        mainPipeLength: 100,
        mainPipeDiameter: 50,
        drippersPerLateral: 50,
        dripperFlow: '4 LPH',
        hazenWilliamsC: 150,
      };
    } else {
      return {
        ...common,
        systemType: 'sprinkler',
        sprinklersPerZone: 10,
        sprinklerFlowLPH: 2500,
        sprinklerOperatingPressure: 3,
        mainPipeLength: 200,
        mainPipeDiameter: 107.5,
        numberOfZones: 2,
        sprinklerFlow: '2.5 m³/h',
        hazenWilliamsC: 150,
      };
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value) || value,
    });
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const endpoint = systemType === 'drip'
        ? `${apiUrl}/api/calculate/drip`
        : `${apiUrl}/api/calculate/sprinkler`;

      const response = await axios.post(endpoint, formData);
      setResults(response.data.data);
    } catch (err) {
      setError('Failed to calculate. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!results) return;
    setError(null);
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.post(
        `${apiUrl}/api/generate-pdf`,
        results,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `HEIS_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setSuccess('PDF downloaded successfully! ✓');
      setTimeout(() => setSuccess(null), 3000);
      setLoading(false);
    } catch (err) {
      setError('Failed to generate PDF. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <motion.header
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="header-content">
          <motion.button
            className="back-btn"
            onClick={onBack}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back
          </motion.button>
          <div>
            <h1>HEIS - {systemType === 'drip' ? 'Drip' : 'Sprinkler'} System Design</h1>
            <p>Configure your irrigation system parameters and generate design report</p>
          </div>
        </div>
      </motion.header>

      <div className="dashboard-content">
        <div className="left-section">
          <InputForm
            formData={formData}
            systemType={systemType}
            onInputChange={handleInputChange}
            onCalculate={handleCalculate}
            loading={loading}
          />
        </div>

        <div className="right-section">
          {error && (
            <motion.div
              className="error-alert"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              className="success-alert"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {success}
            </motion.div>
          )}

          {loading && (
            <motion.div
              className="loading-spinner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="spinner"></div>
              <p>Calculating system parameters...</p>
            </motion.div>
          )}

          {results && !loading && (
            <motion.div
              className="results-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            >
              <OutputMetrics summary={results.summary} />

              <motion.div className="charts-section">
                <h2>Performance Comparison</h2>
                <ChartComparison systemType={systemType} results={results} />
              </motion.div>

              <BOQTable boq={results.boq} totalCost={results.summary.totalCost} />

              <motion.button
                className="generate-pdf-btn"
                onClick={handleGeneratePDF}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📄 Generate PDF Report
              </motion.button>
            </motion.div>
          )}

          {!loading && !results && !error && (
            <motion.div
              className="welcome-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p>Fill in your parameters and click "Calculate" to see results</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
