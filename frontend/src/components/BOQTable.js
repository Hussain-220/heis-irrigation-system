import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './BOQTable.css';

function BOQTable({ boq, totalCost }) {
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Group BOQ items by category
  const groupedBOQ = boq.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  const categories = Object.keys(groupedBOQ);

  const getCategoryColor = (category) => {
    const colors = {
      'HEAD CONTROL UNIT': '#3b82f6',
      'PUMP & MOTOR': '#3b82f6',
      'MAIN & SUBMAIN NETWORK': '#10b981',
      'MAIN LINE & DISTRIBUTION': '#10b981',
      'DRIP LATERALS & EMITTERS': '#a855f7',
      'SPRINKLER HEADS': '#a855f7',
      'RISERS & HYDRANTS': '#f97316',
      'FITTINGS & ACCESSORIES': '#f97316',
      'INSTALLATION & SERVICES': '#ec4899',
      'INSTALLATION & LABOR': '#ec4899',
    };
    return colors[category] || '#64748b';
  };

  return (
    <motion.div
      className="boq-table-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Bill of Quantities (BOQ)</h2>

      <div className="boq-content">
        {categories.map((category) => (
          <div key={category} className="category-section">
            <motion.button
              className="category-header"
              style={{
                borderLeftColor: getCategoryColor(category),
              }}
              onClick={() =>
                setExpandedCategory(expandedCategory === category ? null : category)
              }
              whileHover={{ backgroundColor: '#f1f5f9' }}
            >
              <div className="category-info">
                <span className="category-name">{category}</span>
                <span className="item-count">
                  {groupedBOQ[category].length} item{groupedBOQ[category].length !== 1 ? 's' : ''}
                </span>
              </div>
              <span className="category-toggle">
                {expandedCategory === category ? '▼' : '▶'}
              </span>
            </motion.button>

            <motion.div
              className="category-items"
              initial={false}
              animate={{
                height: expandedCategory === category ? 'auto' : 0,
                opacity: expandedCategory === category ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Specs</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Unit Price (PKR)</th>
                    <th>Total (PKR)</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedBOQ[category].map((item, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <td className="item-name">{item.item}</td>
                      <td className="specs">{item.specs}</td>
                      <td className="quantity">{item.quantity.toFixed(1)}</td>
                      <td className="unit">{item.unit}</td>
                      <td className="unit-price">{item.unitPrice.toFixed(0)}</td>
                      <td className="total-cost">
                        {item.totalCost.toLocaleString('en-PK', {
                          style: 'currency',
                          currency: 'PKR',
                          minimumFractionDigits: 0,
                        })}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        ))}
      </div>

      <motion.div
        className="boq-summary"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="summary-row">
          <span className="summary-label">Subtotal</span>
          <span className="summary-value">
            {totalCost.toLocaleString('en-PK', {
              style: 'currency',
              currency: 'PKR',
              minimumFractionDigits: 0,
            })}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default BOQTable;
