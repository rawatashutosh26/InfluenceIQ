'use client';

export default function ExportPDF({ idea }) {
  async function handleExport() {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const r = idea.report;
    const margin = 20;
    let y = margin;

    // Header bar
    doc.setFillColor(255, 59, 0);
    doc.rect(0, 0, 210, 18, 'F');
    doc.setTextColor(245, 240, 232);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('INFLUENCEIQ — AI VALIDATION REPORT', margin, 12);

    y = 30;

    // Title
    doc.setTextColor(10, 10, 15);
    doc.setFontSize(20);
    doc.text(idea.title, margin, y);
    y += 8;

    // Meta
    doc.setFontSize(9);
    doc.setTextColor(107, 107, 123);
    doc.text(`Generated: ${new Date(idea.createdAt).toLocaleString()}`, margin, y);
    y += 12;

    // Score row
    doc.setFillColor(245, 240, 232);
    doc.rect(margin, y, 170, 18, 'F');
    doc.setTextColor(10, 10, 15);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Profitability Score: ${r.profitability_score}/100`, margin + 4, y + 7);
    doc.text(`Risk Level: ${r.risk_level}`, margin + 90, y + 7);
    y += 26;

    // Sections helper
    function section(label, text) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 59, 0);
      doc.text(label.toUpperCase(), margin, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(10, 10, 15);
      doc.setFontSize(9);
      const lines = doc.splitTextToSize(text, 170);
      doc.text(lines, margin, y);
      y += lines.length * 5 + 6;
    }

    section('Problem', r.problem);
    section('Customer Persona', r.customer);
    section('Market Overview', r.market);
    section('Justification', r.justification);

    // Tech stack
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 59, 0);
    doc.text('TECH STACK', margin, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(10, 10, 15);
    doc.setFontSize(9);
    doc.text(r.tech_stack.join('  •  '), margin, y);
    y += 12;

    // Competitors table
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 59, 0);
    doc.text('COMPETITORS', margin, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [['Competitor', 'Differentiation']],
      body: r.competitors.map((c) => [c.name, c.differentiation]),
      headStyles: { fillColor: [10, 10, 15], textColor: [245, 240, 232], fontSize: 9 },
      bodyStyles: { fontSize: 8, textColor: [10, 10, 15] },
      margin: { left: margin, right: margin },
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(107, 107, 123);
      doc.text(
        `InfluenceIQ by Schmooze Media  |  Page ${i} of ${pageCount}`,
        margin,
        290
      );
    }

    doc.save(`InfluenceIQ_${idea.title.replace(/\s+/g, '_')}.pdf`);
  }

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 border border-amber-200 text-zinc-600 text-sm
                 px-5 py-2.5 rounded hover:border-orange-500 hover:text-orange-700 transition-colors"
    >
      ↓ EXPORT PDF
    </button>
  );
}