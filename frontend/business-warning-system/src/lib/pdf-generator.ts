import html2canvas from "html2canvas"
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
  // HTML로 PDF 내용 생성
  const htmlContent = createHTMLReport(data);

  // 임시 div 생성
  const tempDiv = document.createElement('div');
  tempDiv.style.cssText = `
    all: initial;
    position: absolute;
    left: -9999px;
    width: 800px;
    padding: 40px;
    background-color: #ffffff;
    font-family: system-ui, -apple-system, sans-serif;
    color: #1e293b;
    line-height: 1.6;
  `;
  tempDiv.innerHTML = htmlContent;
  document.body.appendChild(tempDiv);

  try {
    // HTML을 캔버스로 변환
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const doc = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // 페이지가 A4보다 길면 여러 페이지로 분할
    const pageHeight = 297; // A4 height in mm
    let heightLeft = imgHeight;

    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    doc.save(`사업진단보고서_${data.diagnosisDate}.pdf`);
  } finally {
    // 임시 div 제거
    document.body.removeChild(tempDiv);
  }
}

function createHTMLReport(data: DiagnosisData): string {
  const riskColors = {
    GREEN: "#22c55e",
    YELLOW: "#eab308",
    ORANGE: "#f97316",
    RED: "#ef4444",
  };
  const riskLabels = {
    GREEN: "안전",
    YELLOW: "주의",
    ORANGE: "경고",
    RED: "위험",
  };

  return `
    <style>
      * { all: revert; box-sizing: border-box; }
    </style>
    <div style="font-family: system-ui, -apple-system, sans-serif; color: #1e293b; line-height: 1.6; background-color: #ffffff;">
      <!-- 헤더 -->
      <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #e2e8f0;">
        <h1 style="color: #1e40af; font-size: 28px; margin-bottom: 8px;">사업 위험도 진단 보고서</h1>
        <p style="color: #64748b; font-size: 14px;">구해줘 가게 - 자영업 조기경보 시스템</p>
      </div>

      <!-- 사업 정보 -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #0f172a; font-size: 18px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0;">📋 사업장 정보</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; background-color: #f8fafc; width: 30%; font-weight: 600;">사업장명</td>
            <td style="padding: 8px;">${data.businessName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; background-color: #f8fafc; font-weight: 600;">업종</td>
            <td style="padding: 8px;">${data.industry}</td>
          </tr>
          <tr>
            <td style="padding: 8px; background-color: #f8fafc; font-weight: 600;">진단일</td>
            <td style="padding: 8px;">${data.diagnosisDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px; background-color: #f8fafc; font-weight: 600;">영업 기간</td>
            <td style="padding: 8px;">${data.operatingMonths}개월</td>
          </tr>
        </table>
      </div>

      <!-- 종합 위험도 -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #0f172a; font-size: 18px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0;">⚠️ 종합 위험도</h2>
        <div style="background-color: ${riskColors[data.riskLevel]}15; 
                    border: 3px solid ${riskColors[data.riskLevel]}; 
                    padding: 20px; 
                    border-radius: 8px;
                    text-align: center;">
          <div style="font-size: 48px; font-weight: bold; color: ${riskColors[data.riskLevel]}; margin-bottom: 10px;">
            ${data.overallRisk.toFixed(1)}%
          </div>
          <div style="font-size: 20px; font-weight: 600; color: ${riskColors[data.riskLevel]};">
            ${riskLabels[data.riskLevel]} 단계
          </div>
        </div>
      </div>

      <!-- 위험 요소 분석 -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #0f172a; font-size: 18px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0;">📊 위험 요소 분석</h2>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0;">
          <thead>
            <tr style="background-color: #1e40af;">
              <th style="padding: 12px; text-align: left; color: white; border: 1px solid #1e40af;">항목</th>
              <th style="padding: 12px; text-align: center; color: white; border: 1px solid #1e40af;">점수</th>
              <th style="padding: 12px; text-align: center; color: white; border: 1px solid #1e40af;">상태</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">매출 안정성</td>
              <td style="padding: 10px; text-align: center; font-weight: 600; border: 1px solid #e2e8f0;">${data.salesRisk.toFixed(1)}</td>
              <td style="padding: 10px; text-align: center; border: 1px solid #e2e8f0;">${getRiskStatus(data.salesRisk)}</td>
            </tr>
            <tr style="background-color: #f8fafc;">
              <td style="padding: 10px; border: 1px solid #e2e8f0;">고객 유지력</td>
              <td style="padding: 10px; text-align: center; font-weight: 600; border: 1px solid #e2e8f0;">${data.customerRisk.toFixed(1)}</td>
              <td style="padding: 10px; text-align: center; border: 1px solid #e2e8f0;">${getRiskStatus(data.customerRisk)}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0;">시장 경쟁력</td>
              <td style="padding: 10px; text-align: center; font-weight: 600; border: 1px solid #e2e8f0;">${data.marketRisk.toFixed(1)}</td>
              <td style="padding: 10px; text-align: center; border: 1px solid #e2e8f0;">${getRiskStatus(data.marketRisk)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 사업 지표 -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #0f172a; font-size: 18px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0;">💼 사업 지표</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 33.33%; padding: 15px; background-color: #eff6ff; border-radius: 8px; text-align: center;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 5px;">월 평균 매출</div>
              <div style="color: #1e40af; font-size: 20px; font-weight: 700;">₩${data.revenue.toLocaleString()}</div>
            </td>
            <td style="width: 10px;"></td>
            <td style="width: 33.33%; padding: 15px; background-color: #faf5ff; border-radius: 8px; text-align: center;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 5px;">월 평균 고객</div>
              <div style="color: #7c3aed; font-size: 20px; font-weight: 700;">${data.customerCount.toLocaleString()}명</div>
            </td>
            <td style="width: 10px;"></td>
            <td style="width: 33.33%; padding: 15px; background-color: #f0fdf4; border-radius: 8px; text-align: center;">
              <div style="color: #64748b; font-size: 12px; margin-bottom: 5px;">영업 기간</div>
              <div style="color: #16a34a; font-size: 20px; font-weight: 700;">${data.operatingMonths}개월</div>
            </td>
          </tr>
        </table>
      </div>

      <!-- 개선 제안 -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #0f172a; font-size: 18px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0;">💡 맞춤 개선 제안</h2>
        ${data.recommendations.slice(0, 5).map((rec, index) => {
    const priorityColors: Record<string, string> = {
      HIGH: "#ef4444",
      MEDIUM: "#eab308",
      LOW: "#22c55e",
    };
    const priorityLabels: Record<string, string> = {
      HIGH: "높음",
      MEDIUM: "보통",
      LOW: "낮음",
    };
    return `
            <div style="margin-bottom: 15px; padding: 15px; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid ${priorityColors[rec.priority] || "#64748b"};">
              <table style="width: 100%;">
                <tr>
                  <td style="vertical-align: top; width: 60px;">
                    <span style="background-color: ${priorityColors[rec.priority] || "#64748b"}; 
                                 color: white; 
                                 padding: 4px 8px; 
                                 border-radius: 4px; 
                                 font-size: 11px; 
                                 font-weight: 600;
                                 display: inline-block;">
                      ${priorityLabels[rec.priority] || rec.priority}
                    </span>
                  </td>
                  <td style="vertical-align: top;">
                    <strong style="font-size: 14px;">${index + 1}. ${rec.title}</strong>
                  </td>
                </tr>
              </table>
              <p style="margin: 8px 0 0 0; color: #475569; font-size: 13px; line-height: 1.6;">${rec.description}</p>
            </div>
          `;
  }).join('')}
      </div>

      <!-- 푸터 -->
      <div style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px;">
        <p style="margin: 0;">이 보고서는 구해줘 가게 시스템에서 생성되었습니다.</p>
        <p style="margin: 5px 0 0 0;">${new Date().toLocaleString('ko-KR')} 생성</p>
      </div>
    </div>
  `;
}

function getRiskStatus(score: number): string {
  if (score >= 80) return "위험";
  if (score >= 60) return "경고";
  if (score >= 40) return "주의";
  return "양호";
}
