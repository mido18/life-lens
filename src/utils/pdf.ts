import jsPDF from 'jspdf';
import { ReportData } from '../types/user';

// Helper to add a new section header and optionally start a new page if needed
function addSectionHeader(doc: jsPDF, title: string, y: number): number {
  // Calculate bottom margin dynamically (60pt)
  const pageHeight = doc.internal.pageSize.getHeight();
  const bottomMargin = 60;

  // If we are close to the bottom, add a new page
  if (y > pageHeight - bottomMargin) {
    doc.addPage();
    y = 40; // reset y with top margin
  }
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 20, y);
  y += 16; // more space between header and section body
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  return y;
}

// Generate PDF for premium report mimicking the Report component structure
export function generatePDF(report: ReportData) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });

  // Main title - center of page
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');

  const title = 'LifeLens Premium Report';
  const pageWidth = doc.internal.pageSize.getWidth();
  const textWidth = doc.getTextWidth(title);

  // Center title horizontally and place it near the top margin (40pt)
  const titleX = (pageWidth - textWidth) / 2;
  const titleY = 40;

  doc.text(title, titleX, titleY);

  // Start content a comfortable distance below the title
  let y = titleY + 30;

  if (!report.isPremium) {
    // Fallback for free reports: just print content
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(report.content || 'No content', 40, y, { maxWidth: 520 });
    doc.save(`LifeLens_Report_${report.reportId}.pdf`);
    return;
  }

  if (!report.sections) {
    doc.setFontSize(12);
    doc.text('Premium sections are missing.', 40, y);
    doc.save(`LifeLens_Report_${report.reportId}.pdf`);
    return;
  }

  // Handle case where introduction field contains embedded JSON (same logic as Report component)
  let sections: any = report.sections;
  if (
    typeof sections.introduction === 'string' &&
    sections.introduction.includes('{') &&
    sections.introduction.includes('"introduction"')
  ) {
    try {
      const jsonStart = sections.introduction.indexOf('{');
      const jsonEnd = sections.introduction.lastIndexOf('}') + 1;
      const jsonStr = sections.introduction.slice(jsonStart, jsonEnd);
      sections = JSON.parse(jsonStr);
    } catch {
      /* ignore parse failure */
    }
  }

  // Desired order of sections as in Report component
  const orderedKeys: [keyof typeof sections, string][] = [
    ['introduction', 'Introduction'],
    ['lifePath', 'Life Path Overview'],
    ['strengths', 'Strengths and Opportunities'],
    ['actionPlan', 'Action Plan'],
    ['challenges', 'Overcoming Challenges'],
    ['aspirationalVision', 'Aspirational Vision'],
    ['conclusion', 'Conclusion'],
  ];

  orderedKeys.forEach(([key, label]) => {
    const content = sections[key];
    if (!content) return;

    // Add header
    y = addSectionHeader(doc, label, y);

    // Add body, wrapping text
    const paragraphs = content.toString().split(/\n+/);
    paragraphs.forEach((para: string) => {
      const lines = doc.splitTextToSize(para, 520);
      const lineHeight = 14;
      const paragraphGap = 6; // slightly bigger gap after header
      lines.forEach((line: string) => {
        if (y > 780) {
          doc.addPage();
          y = 40;
        }
        doc.text(line, 40, y);
        y += lineHeight;
      });
      y += paragraphGap; // smoother gap between paragraphs
    });
    y += 12; // add clearer separation between sections
  });

  doc.save(`LifeLens_Premium_Report_${report.reportId}.pdf`);
}