import "jspdf-autotable"

import jsPDF from "jspdf"

interface DiagnosisData {
  businessName: string
  industry: string
  diagnosisDate: string
  overallRisk: number
  riskLevel: "GREEN" | "YELLOW" | "ORANGE" | "RED"
  salesRisk: number
  customerRisk: number
  marketRisk: number
  revenue: number
  customerCount: number
  operatingMonths: number
  recommendations: Array<{
    title: string
    description: string
    priority: string
  }>
}

export async function generatePDFReport(data: DiagnosisData) {
  const doc = new jsPDF()

  // Set font to support Korean (using default font for now)
  doc.setFont("helvetica")

  // Title
  doc.setFontSize(20)
  doc.setTextColor(30, 58, 138) // blue-900
  doc.text("Business Risk Analysis Report", 105, 20, { align: "center" })

  // Subtitle
  doc.setFontSize(12)
  doc.setTextColor(100, 116, 139) // slate-500
  doc.text("Small Business Early Warning System", 105, 28, { align: "center" })

  // Horizontal line
  doc.setDrawColor(226, 232, 240) // slate-200
  doc.setLineWidth(0.5)
  doc.line(20, 35, 190, 35)

  // Business Information Section
  let yPos = 45
  doc.setFontSize(14)
  doc.setTextColor(15, 23, 42) // slate-900
  doc.text("Business Information", 20, yPos)

  yPos += 8
  doc.setFontSize(10)
  doc.setTextColor(71, 85, 105) // slate-600
  doc.text(`Business Name: ${data.businessName}`, 20, yPos)
  yPos += 6
  doc.text(`Industry: ${data.industry}`, 20, yPos)
  yPos += 6
  doc.text(`Diagnosis Date: ${data.diagnosisDate}`, 20, yPos)
  yPos += 6
  doc.text(`Operating Period: ${data.operatingMonths} months`, 20, yPos)

  // Risk Assessment Section
  yPos += 15
  doc.setFontSize(14)
  doc.setTextColor(15, 23, 42)
  doc.text("Risk Assessment", 20, yPos)

  // Overall Risk Box
  yPos += 10
  const riskColors = {
    GREEN: [34, 197, 94],
    YELLOW: [234, 179, 8],
    ORANGE: [249, 115, 22],
    RED: [239, 68, 68],
  }
  const riskLabels = {
    GREEN: "Low Risk",
    YELLOW: "Moderate Risk",
    ORANGE: "High Risk",
    RED: "Critical Risk",
  }

  const color = riskColors[data.riskLevel]
  doc.setFillColor(color[0], color[1], color[2])
  doc.roundedRect(20, yPos, 170, 25, 3, 3, "F")

  doc.setFontSize(16)
  doc.setTextColor(255, 255, 255)
  doc.text(`Overall Risk Score: ${data.overallRisk}`, 105, yPos + 10, { align: "center" })
  doc.setFontSize(12)
  doc.text(riskLabels[data.riskLevel], 105, yPos + 18, { align: "center" })

  // Risk Breakdown Table
  yPos += 35
  doc.setFontSize(12)
  doc.setTextColor(15, 23, 42)
  doc.text("Risk Breakdown", 20, yPos)

  yPos += 5
  ;(doc as any).autoTable({
    startY: yPos,
    head: [["Category", "Score", "Status"]],
    body: [
      ["Sales Risk", data.salesRisk.toString(), getRiskStatus(data.salesRisk)],
      ["Customer Risk", data.customerRisk.toString(), getRiskStatus(data.customerRisk)],
      ["Market Risk", data.marketRisk.toString(), getRiskStatus(data.marketRisk)],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: [255, 255, 255],
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [71, 85, 105],
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 50, halign: "center" },
      2: { cellWidth: 60, halign: "center" },
    },
  })

  // Business Metrics
  yPos = (doc as any).lastAutoTable.finalY + 15
  doc.setFontSize(12)
  doc.setTextColor(15, 23, 42)
  doc.text("Business Metrics", 20, yPos)

  yPos += 5
  ;(doc as any).autoTable({
    startY: yPos,
    head: [["Metric", "Value"]],
    body: [
      ["Monthly Revenue", `${data.revenue.toLocaleString()} KRW`],
      ["Customer Count", data.customerCount.toLocaleString()],
      ["Operating Period", `${data.operatingMonths} months`],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: [255, 255, 255],
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [71, 85, 105],
    },
  })

  // Recommendations
  yPos = (doc as any).lastAutoTable.finalY + 15

  // Check if we need a new page
  if (yPos > 240) {
    doc.addPage()
    yPos = 20
  }

  doc.setFontSize(12)
  doc.setTextColor(15, 23, 42)
  doc.text("Recommendations", 20, yPos)

  yPos += 8
  doc.setFontSize(9)
  data.recommendations.slice(0, 5).forEach((rec, index) => {
    if (yPos > 270) {
      doc.addPage()
      yPos = 20
    }

    const priorityColors: Record<string, number[]> = {
      HIGH: [239, 68, 68],
      MEDIUM: [234, 179, 8],
      LOW: [34, 197, 94],
    }

    const priorityColor = priorityColors[rec.priority] || [100, 116, 139]
    doc.setFillColor(priorityColor[0], priorityColor[1], priorityColor[2])
    doc.circle(22, yPos - 1, 1.5, "F")

    doc.setTextColor(15, 23, 42)
    doc.setFont("helvetica", "bold")
    doc.text(`${index + 1}. ${rec.title}`, 26, yPos)

    yPos += 5
    doc.setFont("helvetica", "normal")
    doc.setTextColor(71, 85, 105)
    const lines = doc.splitTextToSize(rec.description, 160)
    doc.text(lines, 26, yPos)
    yPos += lines.length * 4 + 6
  })

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(148, 163, 184)
    doc.text(`Page ${i} of ${pageCount} | Generated by Small Business Early Warning System`, 105, 285, {
      align: "center",
    })
  }

  // Save the PDF
  doc.save(`business-risk-report-${data.diagnosisDate}.pdf`)
}

function getRiskStatus(score: number): string {
  if (score >= 80) return "Critical"
  if (score >= 60) return "High"
  if (score >= 40) return "Moderate"
  return "Low"
}
