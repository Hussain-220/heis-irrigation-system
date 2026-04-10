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
  // From Excel (14.17.xlsx): Pump Efficiency 65% & Motor Efficiency 70%
  // Motor Power (HP) = (Flow LPS * TDH) / (75 * Pump_Eff * Motor_Eff)
  const pumpEfficiency = 0.65;
  const motorEfficiency = 0.70;
  const combinedEfficiency = pumpEfficiency * motorEfficiency; // 0.455
  const pumpPowerHP = (systemFlowLPS * totalDynamicHead) / (75 * combinedEfficiency);

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

  // HEAD UNIT (from Excel: BOQ Rain Gun.xlsx)
  boq.push({
    category: 'HEAD UNIT',
    item: 'Motor with frame & Electric pannel',
    specs: '24 HP',
    quantity: 1,
    unitPrice: 97000,
    totalCost: 97000,
    unit: 'Nos'
  });

  // PIPE NETWORK
  const mainPipeLength = inputs.mainPipeLength || 1040; // Default from Excel
  const subPipeLength = inputs.subPipeLength || 17; // Default from Excel

  boq.push({
    category: 'PIPE NETWORK',
    item: 'PVC Pipe (ROBIN)',
    specs: '4" (6 Bars)',
    quantity: mainPipeLength,
    unitPrice: 300,
    totalCost: mainPipeLength * 300,
    unit: 'm'
  });

  boq.push({
    category: 'PIPE NETWORK',
    item: 'PVC TEE (Atlas/Maat)',
    specs: '4"',
    quantity: 21,
    unitPrice: 580,
    totalCost: 12180,
    unit: 'Nos'
  });

  boq.push({
    category: 'PIPE NETWORK',
    item: 'PVC ELBOW (Atlas/Maat)',
    specs: '4"',
    quantity: 11,
    unitPrice: 550,
    totalCost: 6050,
    unit: 'Nos'
  });

  boq.push({
    category: 'PIPE NETWORK',
    item: 'PVC Reducer Bush (Atlas/Maat)',
    specs: '4" X 3"',
    quantity: 20,
    unitPrice: 200,
    totalCost: 4000,
    unit: 'Nos'
  });

  boq.push({
    category: 'PIPE NETWORK',
    item: 'PVC Ball Valve (Atlas/Maat)',
    specs: '4"',
    quantity: 3,
    unitPrice: 3800,
    totalCost: 11400,
    unit: 'Nos'
  });

  boq.push({
    category: 'PIPE NETWORK',
    item: 'PVC Solution (OSKAR)',
    specs: '1 Kg',
    quantity: 8,
    unitPrice: 600,
    totalCost: 4800,
    unit: 'Nos'
  });

  // RAIN GUN SYSTEM
  boq.push({
    category: 'RAIN GUN SYSTEM',
    item: 'Gate Valve (Anwar Metal)',
    specs: '3"',
    quantity: 20,
    unitPrice: 3650,
    totalCost: 73000,
    unit: 'Nos'
  });

  boq.push({
    category: 'RAIN GUN SYSTEM',
    item: 'GI Pipe',
    specs: '3" (6m Length)',
    quantity: 5,
    unitPrice: 3500,
    totalCost: 17500,
    unit: 'Nos'
  });

  boq.push({
    category: 'RAIN GUN SYSTEM',
    item: 'PVC Pipe (ROBIN)',
    specs: '3" (12 Bars)',
    quantity: subPipeLength,
    unitPrice: 280,
    totalCost: subPipeLength * 280,
    unit: 'm'
  });

  return boq;
};
