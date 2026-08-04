import jsPDF from 'jspdf';

/**
 * Exports data to a CSV file.
 * @param {Array} data - Array of objects containing data rows.
 * @param {Array} headers - Array of objects with { label: string, key: string }.
 * @param {string} filename - Output file name.
 */
export const exportToCSV = (data, headers, filename) => {
  try {
    const headerRow = headers.map(h => `"${h.label.replace(/"/g, '""')}"`).join(',');
    
    const rows = data.map(row => 
      headers.map(h => {
        const val = row[h.key] === undefined || row[h.key] === null ? '' : row[h.key];
        const escaped = String(val).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    );

    const csvContent = "\uFEFF" + [headerRow, ...rows].join('\r\n'); // Add UTF-8 BOM
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to export CSV:', error);
    throw new Error('CSV generation failed');
  }
};

/**
 * Exports data to a clean, structured PDF file using jsPDF.
 * @param {string} title - The title of the document.
 * @param {Array} headers - Array of objects with { label: string, key: string }.
 * @param {Array} data - Array of objects representing the rows.
 * @param {string} filename - Output file name.
 */
export const exportToPDF = (title, headers, data, filename) => {
  try {
    const doc = new jsPDF();
    
    // Header Style
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(title, 20, 20);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 27);
    
    // Draw table headers
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105); // slate-600
    
    // Calculate column X coordinates dynamically
    const startX = 20;
    const endX = 190;
    const usableWidth = endX - startX;
    const colWidth = usableWidth / headers.length;
    
    headers.forEach((h, i) => {
      doc.text(h.label, startX + i * colWidth, 38);
    });
    
    // Divider line
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.5);
    doc.line(startX, 41, endX, 41);
    
    // Draw table content rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    
    let y = 47;
    data.forEach((row) => {
      // Page spillover protection
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      
      headers.forEach((h, colIndex) => {
        const val = row[h.key] === undefined || row[h.key] === null ? '-' : String(row[h.key]);
        // Truncate text if it overflows cell width
        const cleanVal = val.length > 25 ? val.substring(0, 22) + '...' : val;
        doc.text(cleanVal, startX + colIndex * colWidth, y);
      });
      
      y += 8;
    });

    doc.save(filename);
  } catch (error) {
    console.error('Failed to export PDF:', error);
    throw new Error('PDF generation failed');
  }
};
