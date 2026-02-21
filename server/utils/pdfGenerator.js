const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateAgreementPDF = async (agreementData) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(20).text('Rental Agreement', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Agreement Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.moveDown(2);

    doc.fontSize(14).text('Parties:', { underline: true });
    doc.fontSize(11).text(`Landlord (Owner): ${agreementData.ownerName}`);
    doc.text(`Tenant: ${agreementData.tenantName}`);
    doc.moveDown();

    doc.text(`Property: ${agreementData.landTitle}`);
    doc.text(`Location: ${agreementData.landLocation}`);
    doc.text(`Rent: ₹${agreementData.rentPerMonth}/month`);
    doc.moveDown();

    doc.text(`Tenancy Period: ${agreementData.startDate} to ${agreementData.endDate}`);
    doc.moveDown(2);

    doc.fontSize(12).text(
      'Terms and Conditions: This agreement is subject to the terms agreed upon between the parties. Both parties agree to abide by the rental terms.',
      { align: 'justify' }
    );
    doc.moveDown(2);

    doc.text('Landlord Signature: ________________');
    doc.text('Tenant Signature: ________________');
    doc.end();
  });
};

module.exports = { generateAgreementPDF };
