import PDFDocument from 'pdfkit';

export const generatePDF = (data, res) => {
  const doc = new PDFDocument();

  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="HEIS_Report_${new Date().toISOString().split('T')[0]}.pdf"`
  );

  doc.pipe(res);

  // Header
  doc.fontSize(24).font('Helvetica-Bold').text('HEIS - Irrigation System Design Report', {
    align: 'center',
  });
  doc.fontSize(12).font('Helvetica').text(new Date().toDateString(), {
    align: 'center',
  });
  doc.moveDown();

  // System Type
  const systemType = data.systemType === 'drip' ? 'Micro-Drip System' : 'Overhead Sprinkler System';
  doc.fontSize(14).font('Helvetica-Bold').text(`System: ${systemType}`);
  doc.moveDown();

  // Input Summary
  doc.fontSize(12).font('Helvetica-Bold').text('Input Parameters:', {
    underline: true,
  });
  doc.fontSize(10).font('Helvetica');
  doc.text(`Area: ${data.calculations.areaM2.toFixed(2)} m²`);
  doc.text(`Acres: ${data.inputs.acres}`);
  doc.text(`Operating Hours: ${data.inputs.operatingHours} hrs/day`);
  doc.moveDown();

  // Calculations Summary
  doc.fontSize(12).font('Helvetica-Bold').text('Calculated Results:', {
    underline: true,
  });
  doc.fontSize(10).font('Helvetica');
  doc.text(`System Flow: ${data.summary.systemFlow} LPS`);
  doc.text(`Total Dynamic Head: ${data.summary.totalHead} m`);
  doc.text(`Required Pump Power: ${data.summary.pumpPower} HP`);
  doc.moveDown();

  // BOQ Table
  doc.fontSize(12).font('Helvetica-Bold').text('Bill of Quantities (BOQ):', {
    underline: true,
  });
  doc.moveDown(0.5);

  // Table headers
  const tableTop = doc.y;
  const col1 = 50;
  const col2 = 150;
  const col3 = 250;
  const col4 = 330;
  const col5 = 420;
  const col6 = 500;

  doc.fontSize(9).font('Helvetica-Bold');
  doc.text('Category', col1, tableTop);
  doc.text('Item', col2, tableTop);
  doc.text('Specs', col3, tableTop);
  doc.text('Qty', col4, tableTop);
  doc.text('Unit Price', col5, tableTop);
  doc.text('Total', col6, tableTop);

  // Horizontal line
  doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

  let yPosition = tableTop + 20;
  doc.fontSize(8).font('Helvetica');

  data.boq.forEach((item) => {
    if (yPosition > 700) {
      doc.addPage();
      yPosition = 50;
    }

    const category = item.category || '';
    const itemName = item.item || '';
    const specs = item.specs || '';
    const qty = item.quantity.toFixed(1);
    const unitPrice = item.unitPrice.toFixed(0);
    const totalCost = item.totalCost.toFixed(0);

    doc.text(category.substring(0, 15), col1, yPosition);
    doc.text(itemName.substring(0, 20), col2, yPosition);
    doc.text(specs.substring(0, 15), col3, yPosition);
    doc.text(qty, col4, yPosition);
    doc.text(unitPrice, col5, yPosition);
    doc.text(totalCost, col6, yPosition);

    yPosition += 12;
  });

  // Total Cost
  yPosition += 10;
  doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
  yPosition += 10;

  doc.fontSize(10).font('Helvetica-Bold');
  const totalProjectCost = data.summary.totalCost;
  doc.text(`TOTAL PROJECT COST: PKR ${totalProjectCost.toFixed(0)}`, col1, yPosition);

  doc.end();
};
