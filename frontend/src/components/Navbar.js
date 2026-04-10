import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Navbar.css';

function Navbar() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <motion.nav
        className="navbar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="navbar-container">
          <div className="navbar-brand">
            <div className="navbar-logo">💧</div>
            <div className="navbar-title">
              <h1>HEIS</h1>
              <p>High-Efficiency Irrigation System Designer</p>
            </div>
          </div>

          <div className="navbar-buttons">
            <motion.button
              className="about-btn"
              onClick={() => setShowAbout(!showAbout)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ℹ️ About
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* About Modal */}
      {showAbout && (
        <motion.div
          className="about-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAbout(false)}
        >
          <motion.div
            className="about-modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={() => setShowAbout(false)}>
              ✕
            </button>

            <div className="about-content">
              <h2>About HEIS</h2>

              <div className="about-section">
                <h3>Project Description</h3>
                <p>
                  The High-Efficiency Irrigation System Designer (HEIS) is a premium, commercial-grade
                  SaaS tool designed for agricultural engineers and irrigation professionals. This
                  application enables users to input field parameters and automatically generate
                  hydraulic designs, pump requirements, and detailed Bills of Quantities (BOQ) for
                  both Drip Irrigation and Overhead Sprinkler Irrigation systems.
                </p>
                <p>
                  HEIS leverages advanced engineering calculations and best practices to optimize
                  irrigation system design, reducing water consumption, lowering operational costs,
                  and maximizing agricultural productivity.
                </p>
              </div>

              <div className="about-section">
                <h3>Team Members</h3>
                <div className="team-list">
                  <div className="team-member">
                    <span className="team-icon">👤</span>
                    <div>
                      <h4>Ikram Saleem Khan</h4>
                    </div>
                  </div>
                  <div className="team-member">
                    <span className="team-icon">👤</span>
                    <div>
                      <h4>Hafeez Khan</h4>
                    </div>
                  </div>
                  <div className="team-member">
                    <span className="team-icon">👤</span>
                    <div>
                      <h4>Eisa Khan</h4>
                    </div>
                  </div>
                  <div className="team-member">
                    <span className="team-icon">👤</span>
                    <div>
                      <h4>M. Nabeel</h4>
                    </div>
                  </div>
                </div>
              </div>

              <div className="about-section">
                <h3>Institution</h3>
                <div className="institution-info">
                  <p>
                    <strong>Civil Engineering Department</strong>
                  </p>
                  <p>
                    Ghulam Ishaq Khan Institute of Engineering Sciences and Technology
                  </p>
                  <p className="project-note">
                    This project is submitted as a Complex Engineering Problem (CEP) for final-year
                    Civil Engineering students.
                  </p>
                </div>
              </div>

              <div className="about-section">
                <h3>Key Features</h3>
                <ul className="features-list">
                  <li>✓ Drip Irrigation System Design</li>
                  <li>✓ Overhead Sprinkler System Design</li>
                  <li>✓ Advanced Hydraulic Calculations</li>
                  <li>✓ Automatic Pump Power Requirements</li>
                  <li>✓ Dynamic Bill of Quantities</li>
                  <li>✓ Professional PDF Report Generation</li>
                  <li>✓ Interactive Data Visualization</li>
                  <li>✓ User-Friendly Dashboard</li>
                </ul>
              </div>

              <div className="about-footer">
                <p>Version 1.0.0 © 2026 | HEIS - Premium Irrigation System Designer</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

export default Navbar;
