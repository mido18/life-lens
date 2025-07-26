import jsPDF from 'jspdf';
import { ReportData } from '../types/user';

// Generate PDF for premium report
export function generatePDF(report: ReportData) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('LifeLens Premium Report', 20, 20);
  doc.setFontSize(12);

  let y = 30;
  if (report.sections) {
    Object.entries(report.sections).forEach(([section, content]) => {
      doc.text(section.replace(/([A-Z])/g, ' $1').trim(), 20, y);
      y += 10;
      doc.text(content, 20, y, { maxWidth: 160 });
      y += 50;
    });
  }

  doc.save(`LifeLens_Premium_Report_${report.reportId}.pdf`);
}