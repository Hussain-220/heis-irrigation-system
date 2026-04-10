// Vercel Serverless Function: Drip Irrigation Calculation
// File: /api/drip.js

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

  // HEAD CONTROL UNIT (from Excel: Drip Irrigation BOQ for Orchard.xlsx)
  boq.push({
    category: 'HEAD CONTROL UNIT',
    item: 'Motor & Centrifugal Pump 7.5 HP',
    specs: 'With frame & Electric panel',
    quantity: 1,
    unitPrice: 145000,
    totalCost: 145000,
    unit: 'Nos'
  });

  boq.push({
    category: 'HEAD CONTROL UNIT',
    item: 'Hydrocyclone / Sand Separator',
    specs: '3" Inlet/Outlet (Metal)',
    quantity: 1,
    unitPrice: 45000,
    totalCost: 45000,
    unit: 'Nos'
  });

  boq.push({
    category: 'HEAD CONTROL UNIT',
    item: 'Screen / Disc Filter',
    specs: '3" (120 Mesh capacity)',
    quantity: 1,
    unitPrice: 25000,
    totalCost: 25000,
    unit: 'Nos'
  });

  boq.push({
    category: 'HEAD CONTROL UNIT',
    item: 'Venturi Fertilizer Injector',
    specs: '2" Assembly with suction hose',
    quantity: 1,
    unitPrice: 18500,
    totalCost: 18500,
    unit: 'Nos'
  });

  boq.push({
    category: 'HEAD CONTROL UNIT',
    item: 'Pressure Gauges',
    specs: '0-6 Bar (Glycerin filled)',
    quantity: 3,
    unitPrice: 1500,
    totalCost: 4500,
    unit: 'Nos'
  });

  boq.push({
    category: 'HEAD CONTROL UNIT',
    item: 'Air Release Valve',
    specs: '2" (Kinetic)',
    quantity: 2,
    unitPrice: 4000,
    totalCost: 8000,
    unit: 'Nos'
  });

  // MAIN & SUBMAIN NETWORK
  const mainPipeLength = inputs.mainPipeLength || 180;
  const subMainPipeLength = inputs.subMainPipeLength || 230;

  boq.push({
    category: 'MAIN & SUBMAIN NETWORK',
    item: 'PVC Pipe (Main Line)',
    specs: '4" (6 Bars) - Class D',
    quantity: mainPipeLength,
    unitPrice: 300,
    totalCost: mainPipeLength * 300,
    unit: 'm'
  });

  boq.push({
    category: 'MAIN & SUBMAIN NETWORK',
    item: 'PVC Pipe (Submain Line)',
    specs: '3" (6 Bars) - Class D',
    quantity: subMainPipeLength,
    unitPrice: 280,
    totalCost: subMainPipeLength * 280,
    unit: 'm'
  });

  boq.push({
    category: 'MAIN & SUBMAIN NETWORK',
    item: 'Gate Valve / Control Valve',
    specs: '3"',
    quantity: 4,
    unitPrice: 3650,
    totalCost: 14600,
    unit: 'Nos'
  });

  boq.push({
    category: 'MAIN & SUBMAIN NETWORK',
    item: 'PVC TEE',
    specs: '4" and 3" Assorted',
    quantity: 15,
    unitPrice: 580,
    totalCost: 8700,
    unit: 'Nos'
  });

  boq.push({
    category: 'MAIN & SUBMAIN NETWORK',
    item: 'PVC ELBOW',
    specs: '4" and 3" Assorted',
    quantity: 12,
    unitPrice: 550,
    totalCost: 6600,
    unit: 'Nos'
  });

  boq.push({
    category: 'MAIN & SUBMAIN NETWORK',
    item: 'PVC Reducer Bush',
    specs: '4" X 3"',
    quantity: 8,
    unitPrice: 200,
    totalCost: 1600,
    unit: 'Nos'
  });

  boq.push({
    category: 'MAIN & SUBMAIN NETWORK',
    item: 'PVC Solution / Solvent',
    specs: '1Kg',
    quantity: 5,
    unitPrice: 600,
    totalCost: 3000,
    unit: 'Nos'
  });

  // DRIP LATERALS & EMITTERS
  const lateralLength = inputs.lateralLength || 10500;
  const numberOfDrippers = inputs.numberOfDrippers || 10500;
  const numberOfTakeoffs = inputs.numberOfTakeoffs || 105;

  boq.push({
    category: 'DRIP LATERALS & EMITTERS',
    item: 'PE Blank Tube (Laterals)',
    specs: '16mm (Low Density Polyethylene)',
    quantity: lateralLength,
    unitPrice: 45,
    totalCost: lateralLength * 45,
    unit: 'm'
  });

  boq.push({
    category: 'DRIP LATERALS & EMITTERS',
    item: 'Online PC Drippers/Emitters',
    specs: '4 LPH (Pressure Compensating)',
    quantity: numberOfDrippers,
    unitPrice: 12,
    totalCost: numberOfDrippers * 12,
    unit: 'Nos'
  });

  boq.push({
    category: 'DRIP LATERALS & EMITTERS',
    item: 'Take-off / Grommet',
    specs: '16mm to 3" connection',
    quantity: numberOfTakeoffs,
    unitPrice: 25,
    totalCost: numberOfTakeoffs * 25,
    unit: 'Nos'
  });

  boq.push({
    category: 'DRIP LATERALS & EMITTERS',
    item: 'End Caps (Flush Valves)',
    specs: '16mm',
    quantity: numberOfTakeoffs,
    unitPrice: 15,
    totalCost: numberOfTakeoffs * 15,
    unit: 'Nos'
  });

  // INSTALLATION & SERVICES
  boq.push({
    category: 'INSTALLATION & SERVICES',
    item: 'Trenching & Backfilling',
    specs: 'Tractor / Manual Labor',
    quantity: 1,
    unitPrice: 45000,
    totalCost: 45000,
    unit: 'Lum Sum'
  });

  boq.push({
    category: 'INSTALLATION & SERVICES',
    item: 'Transportation Charges',
    specs: 'Site Delivery',
    quantity: 1,
    unitPrice: 25000,
    totalCost: 25000,
    unit: 'Lum Sum'
  });

  boq.push({
    category: 'INSTALLATION & SERVICES',
    item: 'Installation Services',
    specs: 'Expert Fitting & Testing',
    quantity: 1,
    unitPrice: 60000,
    totalCost: 60000,
    unit: 'Lum Sum'
  });

  return boq;
};

const calculateDripSystem = (inputs) => {
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
  const C = inputs.hazenWilliamsC || 150;
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
    1
  );

  // Total Dynamic Head
  const totalDynamicHead =
    inputs.dripperOperatingPressure +
    inputs.elevationChange +
    lateralHeadLoss +
    mainHeadLoss;

  // Pump Power Calculation (HP)
  const pumpWaterPowerHP = (systemFlowLPS * totalDynamicHead) / 75;
  const pumpMotorEfficiency = 0.7 * 0.7;
  const pumpPowerHP = pumpWaterPowerHP / pumpMotorEfficiency;

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

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const results = calculateDripSystem(req.body);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error('Drip calculation error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
}
