import jsPDF from 'jspdf';

export const generateAuditPDF = (report) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;

  // Colors
  const primaryColor = [59, 130, 246]; // Blue
  const secondaryColor = [99, 102, 241]; // Indigo
  const successColor = [34, 197, 94]; // Green
  const warningColor = [234, 179, 8]; // Yellow
  const dangerColor = [239, 68, 68]; // Red
  const textColor = [31, 41, 55]; // Dark gray
  const lightGray = [156, 163, 175];

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace) => {
    if (yPos + requiredSpace > pageHeight - 20) {
      doc.addPage();
      yPos = 20;
      return true;
    }
    return false;
  };

  // Header with gradient effect
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  // Logo/Title area
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('SEOBoostPro', 20, 25);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Professional SEO Audit Report', 20, 35);
  
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, 20, 42);

  yPos = 60;

  // Website URL Section
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Website Analyzed', 20, yPos);
  
  yPos += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(report.url || 'N/A', 20, yPos);
  
  yPos += 15;

  // Overall Score Section
  checkPageBreak(40);
  doc.setFillColor(240, 245, 249);
  doc.rect(20, yPos - 10, pageWidth - 40, 35, 'F');
  
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Overall SEO Score', 30, yPos);
  
  const score = report.score || 0;
  let scoreColor = dangerColor;
  if (score >= 90) scoreColor = successColor;
  else if (score >= 70) scoreColor = warningColor;
  
  doc.setFontSize(36);
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.text(`${score}`, 30, yPos + 15);
  
  // Score bar
  const barWidth = pageWidth - 80;
  const barHeight = 8;
  const scoreWidth = (score / 100) * barWidth;
  
  doc.setFillColor(229, 231, 235);
  doc.rect(30, yPos + 18, barWidth, barHeight, 'F');
  doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.rect(30, yPos + 18, scoreWidth, barHeight, 'F');
  
  doc.setFontSize(10);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text(`${score}%`, 30 + scoreWidth + 5, yPos + 23);
  
  yPos += 50;

  // PageSpeed Insights Section
  checkPageBreak(60);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text('PageSpeed Insights', 20, yPos);
  
  yPos += 10;

  if (report.pageSpeed?.mobile || report.pageSpeed?.desktop) {
    const metrics = [];
    
    if (report.pageSpeed?.mobile) {
      metrics.push({
        device: 'Mobile',
        score: report.pageSpeed.mobile.performanceScore || 'N/A',
        metrics: report.pageSpeed.mobile.metrics || {}
      });
    }
    
    if (report.pageSpeed?.desktop) {
      metrics.push({
        device: 'Desktop',
        score: report.pageSpeed.desktop.performanceScore || 'N/A',
        metrics: report.pageSpeed.desktop.metrics || {}
      });
    }

    metrics.forEach((deviceData, idx) => {
      checkPageBreak(30);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(`${deviceData.device} Performance`, 25, yPos);
      
      yPos += 7;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.text(`Performance Score: ${deviceData.score}`, 25, yPos);
      
      yPos += 6;
      
      // Metrics
      Object.entries(deviceData.metrics).forEach(([key, value]) => {
        if (yPos > pageHeight - 30) {
          doc.addPage();
          yPos = 20;
        }
        const formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
        doc.text(`${formattedKey}: ${value}`, 30, yPos);
        yPos += 5;
      });
      
      yPos += 5;
    });
  }

  yPos += 5;

  // Meta Information Section
  checkPageBreak(80);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text('Meta Information', 20, yPos);
  
  yPos += 10;

  const metaData = [
    { label: 'Title Tag', value: report.meta?.title || 'N/A' },
    { label: 'Meta Description', value: report.meta?.metaDescription || 'N/A' },
    { label: 'First H1', value: report.meta?.firstH1 || 'N/A' },
    { label: 'Status Code', value: report.meta?.statusCode || 'N/A' },
    { label: 'Images Missing Alt Tags', value: report.meta?.imagesMissingAlt ?? 'N/A' },
  ];

  metaData.forEach((item) => {
    checkPageBreak(15);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text(item.label + ':', 25, yPos);
    
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    
    // Handle long text
    const lines = doc.splitTextToSize(item.value, pageWidth - 50);
    lines.forEach((line) => {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, 30, yPos);
      yPos += 5;
    });
    
    yPos += 3;
  });

  // Canonical Links
  if (report.meta?.canonicalLinks && report.meta.canonicalLinks.length > 0) {
    checkPageBreak(20);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text('Canonical Links:', 25, yPos);
    
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...primaryColor);
    doc.setFontSize(8);
    report.meta.canonicalLinks.forEach((link) => {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
      }
      const lines = doc.splitTextToSize(link, pageWidth - 50);
      lines.forEach((line) => {
        doc.text(line, 30, yPos);
        yPos += 4;
      });
      yPos += 2;
    });
  }

  yPos += 10;

  // SEO Suggestions Section
  if (report.suggestions && report.suggestions.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text('SEO Suggestions', 20, yPos);
    
    yPos += 10;

    report.suggestions.forEach((suggestion, idx) => {
      checkPageBreak(25);
      
      // Parse suggestion
      const suggestionText = String(suggestion).trim();
      const boldMatch = suggestionText.match(/\*\*(.+?)\*\*/);
      const title = boldMatch ? boldMatch[1] : suggestionText.split('-')[0].trim();
      const description = boldMatch 
        ? suggestionText.replace(/\*\*(.+?)\*\*\s*-?\s*/, '').trim()
        : suggestionText.includes('-') 
          ? suggestionText.split('-').slice(1).join('-').trim()
          : '';
      
      // Number badge
      doc.setFillColor(warningColor[0], warningColor[1], warningColor[2]);
      doc.rect(23, yPos - 6, 8, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(`${idx + 1}`, 27, yPos);
      
      // Title
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      const titleLines = doc.splitTextToSize(title, pageWidth - 50);
      titleLines.forEach((line) => {
        doc.text(line, 35, yPos);
        yPos += 5;
      });
      
      // Description
      if (description) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
        const descLines = doc.splitTextToSize(description, pageWidth - 50);
        descLines.forEach((line) => {
          doc.text(line, 35, yPos);
          yPos += 4;
        });
      }
      
      yPos += 5;
    });
  }

  // Footer on each page
  const addFooter = (pageNum, totalPages) => {
    doc.setFontSize(8);
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text(
      `Page ${pageNum} of ${totalPages} | SEOBoostPro - Professional SEO Analysis`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  };

  // Add footer to all pages
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i, totalPages);
  }

  // Generate filename
  const url = new URL(report.url || 'audit');
  const domain = url.hostname.replace('www.', '') || 'website';
  const filename = `SEO_Audit_${domain}_${new Date().toISOString().split('T')[0]}.pdf`;

  // Save PDF
  doc.save(filename);
};

