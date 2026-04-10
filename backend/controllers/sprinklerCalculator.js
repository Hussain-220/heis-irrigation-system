// Sprinkler Irrigation Calculation Engine

export const calculateSprinklerSystem = (inputs) => {
  // Global calculations
  const areaM2 = inputs.acres * 4047.11;

  // System Flow (LPS)
  // Flow = (Sprinklers per zone * Sprinkler Flow LPH) / 3600
  const systemFlowLPS = (inputs.sprinklersPerZone * inputs.sprinklerFlowLPH) / 3600;

  // Hydraulic calculations
  const C = inputs.hazenWilliamsC || 150; // PVC pipe coefficient
  const flowM3s = systemFlowLPS / 1000;

  // Head Loss using Hazen-Williams (no F-factor for sprinkler main lines)
  const mainHeadLoss = calculateHazenWilliamsHeadLoss(
    flowM3s,
    C,
    inputs.mainPipeLength,
    inputs.mainPipeDiameter
  );

  // Total Dynamic Head (TDH)
  // TDH = Operating Pressure + Elevation Change + Friction Loss
  const totalDynamicHead =
    inputs.sprinklerOperatingPressure +
    inputs.elevationChange +
    mainHeadLoss;

  // Pump Power Calculation (HP)
  // Power (HP) = (Flow LPS * Total Head m) / (612 * Efficiency)
  const pumpEfficiency = inputs.pumpEfficiency || 0.75;
  const pumpPowerHP = (systemFlowLPS * totalDynamicHead) / (612 * pumpEfficiency);

  // Operating time
  const operatingTimeHrs = inputs.operatingHours;

  // BOQ Calculations
  const boq = generateSprinklerBOQ(
    inputs,
    areaM2,
    systemFlowLPS,
    pumpPowerHP,
    totalDynamicHead
  );

  return {
    inputs,
    calculations: {
      areaM2,
      systemFlowLPS,
      totalDynamicHead,
      pumpPowerHP,
      operatingTimeHrs,
      mainHeadLoss
    },
    boq,
    summary: {
      systemFlow: systemFlowLPS.toFixed(2),
      pumpPower: pumpPowerHP.toFixed(2),
      totalHead: totalDynamicHead.toFixed(2),
      operatingTime: operatingTimeHrs.toFixed(2),
      totalCost: boq.reduce((sum, item) => sum + (item.totalCost || 0), 0)
    }
  };
};

const calculateHazenWilliamsHeadLoss = (flowM3s, C, length, diameterMm) => {
  const diameterM = diameterMm / 1000;
  const headLoss = 10.67 *
    Math.pow(flowM3s / C, 1.852) *
    (length / Math.pow(diameterM, 4.87));
  return headLoss;
};

const generateSprinklerBOQ = (
  inputs,
  areaM2,
  systemFlowLPS,
  pumpPowerHP,
  totalHead
) => {
  const boq = [];

  // PUMP & MOTOR
  boq.push({
    category: 'PUMP & MOTOR',
    item: 'Motor',
    specs: `${pumpPowerHP.toFixed(1)} HP`,
    quantity: 1,
    unitPrice: 25000 * pumpPowerHP,
    totalCost: 25000 * pumpPowerHP,
    unit: 'No'
  });

  boq.push({
    category: 'PUMP & MOTOR',
    item: 'Pump',
    specs: `${systemFlowLPS.toFixed(1)} LPS @ ${totalHead.toFixed(1)}m`,
    quantity: 1,
    unitPrice: 50000,
    totalCost: 50000,
    unit: 'No'
  });

  // MAIN LINE & DISTRIBUTION
  const mainPipeLength = inputs.mainPipeLength || areaM2 / 800;
  const mainPipeDiameter = inputs.mainPipeDiameter || 107.5;

  boq.push({
    category: 'MAIN LINE & DISTRIBUTION',
    item: `PVC Main Pipe ${mainPipeDiameter}mm`,
    specs: 'Class A',
    quantity: mainPipeLength,
    unitPrice: 200,
    totalCost: mainPipeLength * 200,
    unit: 'm'
  });

  // SPRINKLER HEADS
  const numberOfSprinklers = inputs.sprinklersPerZone * inputs.numberOfZones || areaM2 / 100;

  boq.push({
    category: 'SPRINKLER HEADS',
    item: 'Impact Sprinklers',
    specs: inputs.sprinklerFlow || '2.5 m³/h',
    quantity: numberOfSprinklers,
    unitPrice: 3000,
    totalCost: numberOfSprinklers * 3000,
    unit: 'No'
  });

  // RISERS & HYDRANTS
  boq.push({
    category: 'RISERS & HYDRANTS',
    item: 'GI Risers',
    specs: '50mm x 1m',
    quantity: numberOfSprinklers,
    unitPrice: 500,
    totalCost: numberOfSprinklers * 500,
    unit: 'No'
  });

  boq.push({
    category: 'RISERS & HYDRANTS',
    item: 'Field Hydrants',
    specs: 'Standard',
    quantity: Math.ceil(areaM2 / 5000),
    unitPrice: 2000,
    totalCost: Math.ceil(areaM2 / 5000) * 2000,
    unit: 'No'
  });

  // FITTINGS & ACCESSORIES
  boq.push({
    category: 'FITTINGS & ACCESSORIES',
    item: 'Gate Valves',
    specs: '50mm',
    quantity: 2,
    unitPrice: 5000,
    totalCost: 10000,
    unit: 'No'
  });

  boq.push({
    category: 'FITTINGS & ACCESSORIES',
    item: 'Pressure Gauge',
    specs: '0-10 Bar',
    quantity: 2,
    unitPrice: 2000,
    totalCost: 4000,
    unit: 'No'
  });

  // INSTALLATION & LABOR
  boq.push({
    category: 'INSTALLATION & LABOR',
    item: 'Installation',
    specs: 'Labour',
    quantity: areaM2,
    unitPrice: 10,
    totalCost: areaM2 * 10,
    unit: 'm²'
  });

  return boq;
};
