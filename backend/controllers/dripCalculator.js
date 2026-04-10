// Drip Irrigation Calculation Engine

export const calculateDripSystem = (inputs) => {
  // Global calculations
  const areaM2 = inputs.acres * 4047.11;

  // Leaching Requirement
  const LR = inputs.ECw / (2 * inputs.ECe);

  // ET0 - Reference Evapotranspiration (mm/day)
  // Kc - Crop Coefficient
  const volumePerPlantLday = (
    (inputs.ET0 * inputs.Kc * 0.70) / (1 - LR) / 0.90
  ) * inputs.plantSpacing * inputs.rowSpacing;

  // Daily water requirement (L/day)
  const totalDailyWater = volumePerPlantLday * inputs.plantsPerAcre;

  // System flow (LPS)
  const systemFlowLPS = (totalDailyWater * inputs.operatingHours) / 86400;

  // Hydraulic calculations
  const N = inputs.drippersPerLateral; // Number of outlets
  const F = (1 / 2.852) + (1 / (2 * N)) + (0.285 / (N * N)); // Christiansen F-Factor

  // Convert flow to m³/s for Hazen-Williams formula
  const flowM3s = systemFlowLPS / 1000;

  // Hazen-Williams Head Loss (m)
  // Hf = 10.67 * (Q^1.852 / C^1.852) * (L / D^4.87) * F
  const C = inputs.hazenWilliamsC || 150; // PVC pipe coefficient
  const lateralHeadLoss = calculateHazenWilliamsHeadLoss(
    flowM3s,
    C,
    inputs.lateralLength,
    inputs.lateralDiameter,
    F
  );

  const mainHeadLoss = calculateHazenWilliamsHeadLoss(
    flowM3s,
    C,
    inputs.mainPipeLength,
    inputs.mainPipeDiameter,
    1 // No F-factor for main pipe
  );

  // Total Dynamic Head
  const totalDynamicHead =
    inputs.dripperOperatingPressure +
    inputs.elevationChange +
    lateralHeadLoss +
    mainHeadLoss;

  // Pump Power Calculation (HP)
  // Power (HP) = (Flow LPS * Total Head m) / (612 * Efficiency)
  const pumpEfficiency = inputs.pumpEfficiency || 0.75;
  const pumpPowerHP = (systemFlowLPS * totalDynamicHead) / (612 * pumpEfficiency);

  // Operating time
  const operatingTimeHrs = inputs.operatingHours;

  // BOQ Calculations
  const boq = generateDripBOQ(inputs, areaM2, systemFlowLPS, pumpPowerHP, totalDynamicHead);

  return {
    inputs,
    calculations: {
      areaM2,
      LR,
      volumePerPlantLday,
      totalDailyWater,
      systemFlowLPS,
      totalDynamicHead,
      pumpPowerHP,
      operatingTimeHrs,
      lateralHeadLoss,
      mainHeadLoss,
      F
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

const calculateHazenWilliamsHeadLoss = (flowM3s, C, length, diameterMm, F) => {
  const diameterM = diameterMm / 1000;
  const headLoss = 10.67 *
    Math.pow(flowM3s / C, 1.852) *
    (length / Math.pow(diameterM, 4.87)) *
    F;
  return headLoss;
};

const generateDripBOQ = (inputs, areaM2, systemFlowLPS, pumpPowerHP, totalHead) => {
  const boq = [];

  // HEAD CONTROL UNIT
  boq.push({
    category: 'HEAD CONTROL UNIT',
    item: 'Motor',
    specs: `${pumpPowerHP.toFixed(1)} HP`,
    quantity: 1,
    unitPrice: 25000 * pumpPowerHP,
    totalCost: 25000 * pumpPowerHP,
    unit: 'No'
  });

  boq.push({
    category: 'HEAD CONTROL UNIT',
    item: 'Hydrocyclone/Sand Separator',
    specs: `${systemFlowLPS.toFixed(1)} LPS`,
    quantity: 1,
    unitPrice: 15000,
    totalCost: 15000,
    unit: 'No'
  });

  boq.push({
    category: 'HEAD CONTROL UNIT',
    item: 'Disc Filter',
    specs: `${systemFlowLPS.toFixed(1)} LPS`,
    quantity: 1,
    unitPrice: 20000,
    totalCost: 20000,
    unit: 'No'
  });

  boq.push({
    category: 'HEAD CONTROL UNIT',
    item: 'Venturi Injector',
    specs: 'Standard',
    quantity: 1,
    unitPrice: 5000,
    totalCost: 5000,
    unit: 'No'
  });

  boq.push({
    category: 'HEAD CONTROL UNIT',
    item: 'Pressure Gauge',
    specs: '0-10 Bar',
    quantity: 2,
    unitPrice: 2000,
    totalCost: 4000,
    unit: 'No'
  });

  // MAIN & SUBMAIN NETWORK
  const mainPipeLength = inputs.mainPipeLength || areaM2 / 1000;
  const mainPipeDiameter = inputs.mainPipeDiameter || 50;

  boq.push({
    category: 'MAIN & SUBMAIN NETWORK',
    item: 'PVC Main Pipe',
    specs: `${mainPipeDiameter}mm`,
    quantity: mainPipeLength,
    unitPrice: 100,
    totalCost: mainPipeLength * 100,
    unit: 'm'
  });

  // DRIP LATERALS & EMITTERS
  const lateralLength = inputs.lateralLength || areaM2 / 100;

  boq.push({
    category: 'DRIP LATERALS & EMITTERS',
    item: '16mm PE Blank Tube',
    specs: 'Standard',
    quantity: lateralLength,
    unitPrice: 15,
    totalCost: lateralLength * 15,
    unit: 'm'
  });

  const numberOfDrippers = inputs.plantsPerAcre * inputs.acres || areaM2 / 2;

  boq.push({
    category: 'DRIP LATERALS & EMITTERS',
    item: 'PC Drippers',
    specs: inputs.dripperFlow || '4 LPH',
    quantity: numberOfDrippers,
    unitPrice: 10,
    totalCost: numberOfDrippers * 10,
    unit: 'No'
  });

  boq.push({
    category: 'DRIP LATERALS & EMITTERS',
    item: 'Take-offs/Grommets',
    specs: 'Standard',
    quantity: numberOfDrippers,
    unitPrice: 5,
    totalCost: numberOfDrippers * 5,
    unit: 'No'
  });

  // INSTALLATION & SERVICES
  boq.push({
    category: 'INSTALLATION & SERVICES',
    item: 'Trenching',
    specs: 'Labour',
    quantity: lateralLength,
    unitPrice: 20,
    totalCost: lateralLength * 20,
    unit: 'm'
  });

  boq.push({
    category: 'INSTALLATION & SERVICES',
    item: 'Installation',
    specs: 'Labour',
    quantity: areaM2,
    unitPrice: 5,
    totalCost: areaM2 * 5,
    unit: 'm²'
  });

  return boq;
};
