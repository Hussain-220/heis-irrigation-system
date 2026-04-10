# HEIS - High-Efficiency Irrigation System Designer SaaS Tool

A premium, commercial-grade web application for agricultural engineers to design and optimize irrigation systems. This SaaS platform automatically generates hydraulic designs, pump requirements, and detailed Bills of Quantities (BOQ) for both Drip and Sprinkler Irrigation systems.

## 🎯 Features

- **System Selection**: Choose between Drip or Overhead Sprinkler Irrigation systems
- **Dynamic Inputs**: Intuitive accordion-based form for agronomic and hydraulic parameters
- **Real-time Calculations**: Accurate hydraulic calculations using Hazen-Williams formulas
- **Professional PDF Reports**: Auto-generated reports with inputs, metrics, and BOQ
- **Interactive Dashboard**: Beautiful, modern UI with animated metric cards
- **Data Visualization**: Charts comparing key performance metrics
- **Dynamic BOQ Generation**: Categorized Bill of Quantities with real-time cost calculations

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Framer Motion** - Smooth animations and transitions
- **Recharts** - Data visualization
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PDFKit** - PDF generation
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Python 3.7+ (for virtual environment, optional)

## 🚀 Installation & Setup

### Step 1: Clone and Navigate
```bash
cd /Users/mac/Desktop/ikram/cep
```

### Step 2: Set Up Backend

```bash
cd backend
npm install
npm start
```

The backend will start on `http://localhost:5000`

### Step 3: Set Up Frontend (in a new terminal)

```bash
cd frontend
npm install
npm start
```

The frontend will start on `http://localhost:3000`

## 📖 Usage

1. **Select System Type**: Choose between Drip Irrigation or Sprinkler Irrigation
2. **Configure Parameters**:
   - Enter agronomic data (ET0, crop coefficient, plant spacing, etc.)
   - Set hydraulic parameters (operating hours, pressures, pipe sizes, etc.)
3. **Calculate**: Click the "Calculate" button to process the design
4. **Review Results**:
   - View calculated metrics (System Flow, Total Head, Pump Power)
   - Analyze the interactive chart
   - Review the categorized Bill of Quantities
5. **Generate Report**: Download a professional PDF report

## 📊 Calculation Formulas

### Global Formulas
- **Area (m²)** = Acres × 4047.11
- **Leaching Requirement (LR)** = ECw / (2 × ECe)

### Drip Irrigation
- **Volume per Plant (L/day)** = ((ET0 × Kc × 0.70) / (1 - LR)) / 0.90 × Plant_Spacing × Row_Spacing
- **Christiansen F-Factor** = 1/2.852 + 1/(2N) + 0.285/N²
- **Hazen-Williams Head Loss (m)** = 10.67 × (Q/C)^1.852 × (L/D^4.87) × F

### Sprinkler Irrigation
- **System Flow (LPS)** = (Sprinklers_per_zone × Sprinkler_Flow_LPH) / 3600
- **Total Dynamic Head (m)** = Operating_Pressure + Elevation_Change + Friction_Loss

## 📁 Project Structure

```
cep/
├── backend/
│   ├── controllers/
│   │   ├── dripCalculator.js
│   │   ├── sprinklerCalculator.js
│   │   └── pdfGenerator.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── InputForm.js
│   │   │   ├── OutputMetrics.js
│   │   │   ├── BOQTable.js
│   │   │   └── ChartComparison.js
│   │   ├── pages/
│   │   │   ├── SystemSelection.js
│   │   │   └── Dashboard.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   └── package.json
└── Excel Reference Files/
    ├── Drip_Irrigation_CEP.xlsx
    ├── 14.17.xlsx
    ├── Drip Irrigation BOQ for Orchard.xlsx
    └── BOQ Rain Gun.xlsx
```

## 🔧 API Endpoints

### POST `/api/calculate/drip`
Calculates drip irrigation system parameters.

**Request Body Example:**
```json
{
  "acres": 1,
  "ET0": 5,
  "Kc": 0.8,
  "ECw": 0.5,
  "ECe": 2,
  "plantSpacing": 0.5,
  "rowSpacing": 1,
  "operatingHours": 8
}
```

### POST `/api/calculate/sprinkler`
Calculates sprinkler irrigation system parameters.

**Request Body Example:**
```json
{
  "acres": 2,
  "sprinklersPerZone": 10,
  "sprinklerFlowLPH": 2500,
  "operatingHours": 8
}
```

### POST `/api/generate-pdf`
Generates a PDF report with calculations and BOQ.

## 🎨 UI Features

- **System Selection Screen**: Beautiful split-screen hero section with hover animations
- **Dashboard Layout**:
  - Left Sidebar: Accordion-based input forms
  - Main Stage: Animated metric cards, charts, and BOQ table
- **Number Ticker Animations**: Key metrics count up to final values
- **Loading States**: Sleek spinner with custom SVG animations
- **Responsive Design**: Optimized for desktop, tablet, and mobile

## 📝 BOQ Categories

### Drip System
- HEAD CONTROL UNIT
- MAIN & SUBMAIN NETWORK
- DRIP LATERALS & EMITTERS
- INSTALLATION & SERVICES

### Sprinkler System
- PUMP & MOTOR
- MAIN LINE & DISTRIBUTION
- SPRINKLER HEADS
- RISERS & HYDRANTS
- FITTINGS & ACCESSORIES
- INSTALLATION & LABOR

## 🚨 Troubleshooting

**Backend Connection Error**
- Ensure backend is running on port 5000
- Check CORS settings in server.js

**PDF Generation Issues**
- Verify PDFKit is installed: `npm install pdfkit`
- Check file permissions in the project directory

**Chart Not Displaying**
- Ensure Recharts is installed: `npm install recharts`
- Check browser console for errors

## 📄 License

This project is created for educational and commercial purposes as part of a Civil Engineering Complex Problem (CEP).

## 👨‍💼 Support

For issues or questions, refer to:
- Excel reference files for calculation logic
- Backend controller files for calculation details
- Frontend component files for UI implementation

---

**Version**: 1.0.0
**Last Updated**: 2026-04-10
**Status**: Production Ready
