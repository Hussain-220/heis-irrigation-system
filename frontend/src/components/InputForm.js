import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './InputForm.css';

function InputForm({ formData, systemType, onInputChange, onCalculate, loading }) {
  const [expandedAccordion, setExpandedAccordion] = useState('agronomic');

  const accordionVariants = {
    closed: { opacity: 0, height: 0 },
    open: { opacity: 1, height: 'auto' },
  };

  const renderAgronomicFields = () => (
    <>
      <div className="form-group">
        <label>Field Area (Acres)</label>
        <input
          type="number"
          step="0.1"
          name="acres"
          value={formData.acres}
          onChange={onInputChange}
        />
      </div>
      {systemType === 'drip' && (
        <>
          <div className="form-group">
            <label>ET0 (mm/day)</label>
            <input
              type="number"
              step="0.1"
              name="ET0"
              value={formData.ET0}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group">
            <label>Crop Coefficient (Kc)</label>
            <input
              type="number"
              step="0.01"
              name="Kc"
              value={formData.Kc}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group">
            <label>EC Water (ECw)</label>
            <input
              type="number"
              step="0.1"
              name="ECw"
              value={formData.ECw}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group">
            <label>EC Soil (ECe)</label>
            <input
              type="number"
              step="0.1"
              name="ECe"
              value={formData.ECe}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group">
            <label>Plant Spacing (m)</label>
            <input
              type="number"
              step="0.1"
              name="plantSpacing"
              value={formData.plantSpacing}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group">
            <label>Row Spacing (m)</label>
            <input
              type="number"
              step="0.1"
              name="rowSpacing"
              value={formData.rowSpacing}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group">
            <label>Plants per Acre</label>
            <input
              type="number"
              step="100"
              name="plantsPerAcre"
              value={formData.plantsPerAcre}
              onChange={onInputChange}
            />
          </div>
        </>
      )}
    </>
  );

  const renderHydraulicsFields = () => (
    <>
      <div className="form-group">
        <label>Operating Hours (hrs/day)</label>
        <input
          type="number"
          step="0.5"
          name="operatingHours"
          value={formData.operatingHours}
          onChange={onInputChange}
        />
      </div>
      <div className="form-group">
        <label>Elevation Change (m)</label>
        <input
          type="number"
          step="1"
          name="elevationChange"
          value={formData.elevationChange}
          onChange={onInputChange}
        />
      </div>
      <div className="form-group">
        <label>Pump Efficiency</label>
        <input
          type="number"
          step="0.01"
          min="0.5"
          max="1"
          name="pumpEfficiency"
          value={formData.pumpEfficiency}
          onChange={onInputChange}
        />
      </div>

      {systemType === 'drip' && (
        <>
          <div className="form-group">
            <label>Dripper Operating Pressure (bar)</label>
            <input
              type="number"
              step="0.1"
              name="dripperOperatingPressure"
              value={formData.dripperOperatingPressure}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group">
            <label>Lateral Length (m)</label>
            <input
              type="number"
              step="10"
              name="lateralLength"
              value={formData.lateralLength}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group">
            <label>Lateral Diameter (mm)</label>
            <input
              type="number"
              step="1"
              name="lateralDiameter"
              value={formData.lateralDiameter}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group">
            <label>Drippers per Lateral</label>
            <input
              type="number"
              step="5"
              name="drippersPerLateral"
              value={formData.drippersPerLateral}
              onChange={onInputChange}
            />
          </div>
        </>
      )}

      {systemType === 'sprinkler' && (
        <>
          <div className="form-group">
            <label>Sprinkler Operating Pressure (bar)</label>
            <input
              type="number"
              step="0.1"
              name="sprinklerOperatingPressure"
              value={formData.sprinklerOperatingPressure}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group">
            <label>Sprinklers per Zone</label>
            <input
              type="number"
              step="1"
              name="sprinklersPerZone"
              value={formData.sprinklersPerZone}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group">
            <label>Sprinkler Flow (LPH)</label>
            <input
              type="number"
              step="100"
              name="sprinklerFlowLPH"
              value={formData.sprinklerFlowLPH}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group">
            <label>Number of Zones</label>
            <input
              type="number"
              step="1"
              name="numberOfZones"
              value={formData.numberOfZones}
              onChange={onInputChange}
            />
          </div>
        </>
      )}

      <div className="form-group">
        <label>Main Pipe Length (m)</label>
        <input
          type="number"
          step="10"
          name="mainPipeLength"
          value={formData.mainPipeLength}
          onChange={onInputChange}
        />
      </div>
      <div className="form-group">
        <label>Main Pipe Diameter (mm)</label>
        <input
          type="number"
          step="1"
          name="mainPipeDiameter"
          value={formData.mainPipeDiameter}
          onChange={onInputChange}
        />
      </div>
      <div className="form-group">
        <label>Hazen-Williams C Value</label>
        <input
          type="number"
          step="5"
          name="hazenWilliamsC"
          value={formData.hazenWilliamsC}
          onChange={onInputChange}
        />
      </div>
    </>
  );

  return (
    <motion.div
      className="input-form"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>System Parameters</h2>

      {/* Agronomic Data Accordion */}
      <div className="accordion">
        <button
          className={`accordion-header ${expandedAccordion === 'agronomic' ? 'active' : ''}`}
          onClick={() =>
            setExpandedAccordion(expandedAccordion === 'agronomic' ? null : 'agronomic')
          }
        >
          <span>🌱 Agronomic Data</span>
          <span>{expandedAccordion === 'agronomic' ? '▼' : '▶'}</span>
        </button>
        <motion.div
          className="accordion-content"
          variants={accordionVariants}
          initial="closed"
          animate={expandedAccordion === 'agronomic' ? 'open' : 'closed'}
          transition={{ duration: 0.3 }}
        >
          {renderAgronomicFields()}
        </motion.div>
      </div>

      {/* Hydraulics Accordion */}
      <div className="accordion">
        <button
          className={`accordion-header ${expandedAccordion === 'hydraulics' ? 'active' : ''}`}
          onClick={() =>
            setExpandedAccordion(expandedAccordion === 'hydraulics' ? null : 'hydraulics')
          }
        >
          <span>⚙️ Hydraulics & Pipes</span>
          <span>{expandedAccordion === 'hydraulics' ? '▼' : '▶'}</span>
        </button>
        <motion.div
          className="accordion-content"
          variants={accordionVariants}
          initial="closed"
          animate={expandedAccordion === 'hydraulics' ? 'open' : 'closed'}
          transition={{ duration: 0.3 }}
        >
          {renderHydraulicsFields()}
        </motion.div>
      </div>

      <motion.button
        className="calculate-btn"
        onClick={onCalculate}
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.05 }}
        whileTap={{ scale: loading ? 1 : 0.95 }}
      >
        {loading ? 'Calculating...' : '🧮 Calculate'}
      </motion.button>
    </motion.div>
  );
}

export default InputForm;
