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

  // 세부 경영 지표
  detailedMetrics?: {
    avgRevenue: number          // 월평균 매출
    avgCustomers: number         // 월평균 고객 수
    customerSpending: number     // 객단가 (매출/고객수)
    revenueGrowth?: number       // 매출 성장률 %
    customerGrowth?: number      // 고객 수 성장률 %
  }

  // 업종 비교 데이터
  benchmarkData?: {
    industryName: string         // 업종명
    averageRiskScore: number     // 업종 평균 위험도
    myPosition: number           // 업종 내 백분위 (0-100)
    revenueComparison: {
      mine: number               // 내 매출
      average: number            // 업종 평균 매출
      differencePercent: number  // 차이 %
    }
    customerComparison: {
      mine: number               // 내 고객 수
      average: number            // 업종 평균 고객 수
      differencePercent: number  // 차이 %
    }
  }

  // 차트 이미지 (Base64)
  chartImages?: {
    radarChart?: string          // 레이더 차트 이미지
  }
}

export async function generatePDFReport(data: DiagnosisData) {
  // 디버깅: 전달받은 데이터 확인
  console.log("PDF 생성 시작");
  console.log("차트 이미지 데이터 존재:", !!data.chartImages?.radarChart);
  if (data.chartImages?.radarChart) {
    console.log("차트 이미지 길이:", data.chartImages.radarChart.length);
  }

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

      <!-- 레이더 차트 -->
      ${data.chartImages?.radarChart ? `
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h2 style="color: #0f172a; font-size: 18px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0;">
          📊 위험 요소 시각화
        </h2>
        <div style="text-align: center; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
          <img src="${data.chartImages.radarChart}" 
               style="max-width: 100%; height: auto; border-radius: 8px;" 
               alt="위험 요소 레이더 차트" />
        </div>
        <div style="margin-top: 15px; padding: 15px; background-color: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
          <p style="margin: 0; color: #1e40af; font-size: 13px; line-height: 1.6;">
            💡 <strong>차트 해석:</strong> 
            레이더 차트는 3가지 위험 요소(매출 안정성, 고객 유지력, 시장 경쟁력)를 한눈에 비교합니다. 
            파란색 영역이 내 가게, 회색 영역이 업종 평균입니다. 
            바깥쪽으로 갈수록 점수가 높고 안정적입니다.
          </p>
        </div>
      </div>
      ` : ''}

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

      <!-- 세부 경영 지표 -->
      ${data.detailedMetrics ? `
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h2 style="color: #0f172a; font-size: 18px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0;">
          📈 세부 경영 지표
        </h2>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0;">
          <tbody>
            <tr>
              <td style="padding: 12px; background-color: #f8fafc; font-weight: 600; width: 30%; border: 1px solid #e2e8f0;">
                월 평균 매출
              </td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">
                <span style="font-size: 18px; font-weight: 700; color: #1e40af;">
                  ₩${data.detailedMetrics.avgRevenue.toLocaleString()}
                </span>
              </td>
              <td style="padding: 12px; background-color: #f8fafc; font-weight: 600; width: 30%; border: 1px solid #e2e8f0;">
                ${data.detailedMetrics.revenueGrowth !== undefined ? '매출 성장률' : ''}
              </td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">
                ${data.detailedMetrics.revenueGrowth !== undefined ? `
                  <span style="font-size: 18px; font-weight: 700; color: ${data.detailedMetrics.revenueGrowth >= 0 ? '#22c55e' : '#ef4444'};">
                    ${data.detailedMetrics.revenueGrowth >= 0 ? '+' : ''}${data.detailedMetrics.revenueGrowth.toFixed(1)}%
                  </span>
                ` : ''}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px; background-color: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">
                월 평균 고객 수
              </td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">
                <span style="font-size: 18px; font-weight: 700; color: #7c3aed;">
                  ${data.detailedMetrics.avgCustomers.toLocaleString()}명
                </span>
              </td>
              <td style="padding: 12px; background-color: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">
                ${data.detailedMetrics.customerGrowth !== undefined ? '고객 증가율' : ''}
              </td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">
                ${data.detailedMetrics.customerGrowth !== undefined ? `
                  <span style="font-size: 18px; font-weight: 700; color: ${data.detailedMetrics.customerGrowth >= 0 ? '#22c55e' : '#ef4444'};">
                    ${data.detailedMetrics.customerGrowth >= 0 ? '+' : ''}${data.detailedMetrics.customerGrowth.toFixed(1)}%
                  </span>
                ` : ''}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px; background-color: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">
                객단가
              </td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">
                <span style="font-size: 18px; font-weight: 700; color: #16a34a;">
                  ₩${data.detailedMetrics.customerSpending.toLocaleString()}
                </span>
              </td>
              <td style="padding: 12px; background-color: #f8fafc; font-weight: 600; border: 1px solid #e2e8f0;">
                영업 기간
              </td>
              <td style="padding: 12px; border: 1px solid #e2e8f0;">
                <span style="font-size: 18px; font-weight: 700; color: #f97316;">
                  ${data.operatingMonths}개월
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div style="margin-top: 15px; padding: 15px; background-color: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
          <p style="margin: 0; color: #1e40af; font-size: 13px; line-height: 1.6;">
            💡 <strong>해석:</strong> 
            객단가는 고객 1명당 평균 지출 금액입니다. 
            ${data.detailedMetrics.customerSpending > 15000
        ? '높은 객단가를 유지하고 있습니다.'
        : data.detailedMetrics.customerSpending > 8000
          ? '적절한 객단가 수준입니다.'
          : '객단가 상승 전략을 고려해보세요.'}
            ${data.detailedMetrics.revenueGrowth !== undefined && data.detailedMetrics.revenueGrowth > 0
        ? ' 매출이 성장 중이니 현재 전략을 유지하세요.'
        : data.detailedMetrics.revenueGrowth !== undefined && data.detailedMetrics.revenueGrowth < -5
          ? ' 매출 감소세가 있으니 개선 방안을 검토하세요.'
          : ''}
          </p>
        </div>
      </div>
      ` : ''}

      <!-- 업종 비교 -->
      ${data.benchmarkData ? `
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h2 style="color: #0f172a; font-size: 18px; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0;">
          🏆 업종 내 순위 및 비교
        </h2>
        
        <!-- 업종 내 위치 -->
        <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 2px solid #3b82f6;">
          <div style="text-align: center;">
            <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">업종 내 내 위치</p>
            <div style="font-size: 42px; font-weight: bold; color: ${data.overallRisk > data.benchmarkData.averageRiskScore ? '#ef4444' : '#22c55e'}; margin-bottom: 5px;">
              ${data.benchmarkData.myPosition >= 50 ? '상위' : '하위'} ${Math.abs(data.benchmarkData.myPosition).toFixed(0)}%
            </div>
            <p style="margin: 5px 0 0 0; color: #64748b; font-size: 13px;">
              ${data.benchmarkData.industryName} 업종 기준
            </p>
          </div>
        </div>
        
        <!-- 업종 평균 비교 테이블 -->
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; margin-bottom: 15px;">
          <thead>
            <tr style="background-color: #f8fafc;">
              <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0; font-weight: 600;">항목</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0; font-weight: 600;">내 가게</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0; font-weight: 600;">업종 평균</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #e2e8f0; font-weight: 600;">차이</th>
            </tr>
          </thead>
          <tbody>
            <!-- 안전점수 비교 -->
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">안전점수</td>
              <td style="padding: 10px; text-align: center; border: 1px solid #e2e8f0; font-size: 16px; font-weight: 700; color: #1e40af;">
                ${data.overallRisk.toFixed(1)}점
              </td>
              <td style="padding: 10px; text-align: center; border: 1px solid #e2e8f0; font-size: 16px; font-weight: 700; color: #64748b;">
                ${data.benchmarkData.averageRiskScore.toFixed(1)}점
              </td>
              <td style="padding: 10px; text-align: center; border: 1px solid #e2e8f0; font-weight: 700; color: ${data.overallRisk > data.benchmarkData.averageRiskScore ? '#22c55e' : '#ef4444'};">
                ${data.overallRisk > data.benchmarkData.averageRiskScore ? '+' : ''}${(data.overallRisk - data.benchmarkData.averageRiskScore).toFixed(1)}점
                ${data.overallRisk > data.benchmarkData.averageRiskScore ? '(더 안전)' : '(주의 필요)'}
              </td>
            </tr>
            
            <!-- 매출 비교 -->
            <tr style="background-color: #f8fafc;">
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">월 평균 매출</td>
              <td style="padding: 10px; text-align: center; border: 1px solid #e2e8f0; font-size: 16px; font-weight: 700; color: #1e40af;">
                ₩${data.benchmarkData.revenueComparison.mine.toLocaleString()}
              </td>
              <td style="padding: 10px; text-align: center; border: 1px solid #e2e8f0; font-size: 16px; font-weight: 700; color: #64748b;">
                ₩${data.benchmarkData.revenueComparison.average.toLocaleString()}
              </td>
              <td style="padding: 10px; text-align: center; border: 1px solid #e2e8f0; font-weight: 700; color: ${data.benchmarkData.revenueComparison.differencePercent >= 0 ? '#22c55e' : '#ef4444'};">
                ${data.benchmarkData.revenueComparison.differencePercent >= 0 ? '+' : ''}${data.benchmarkData.revenueComparison.differencePercent.toFixed(1)}%
              </td>
            </tr>
            
            <!-- 고객 수 비교 -->
            <tr>
              <td style="padding: 10px; border: 1px solid #e2e8f0; font-weight: 600;">월 평균 고객 수</td>
              <td style="padding: 10px; text-align: center; border: 1px solid #e2e8f0; font-size: 16px; font-weight: 700; color: #7c3aed;">
                ${data.benchmarkData.customerComparison.mine.toLocaleString()}명
              </td>
              <td style="padding: 10px; text-align: center; border: 1px solid #e2e8f0; font-size: 16px; font-weight: 700; color: #64748b;">
                ${data.benchmarkData.customerComparison.average.toLocaleString()}명
              </td>
              <td style="padding: 10px; text-align: center; border: 1px solid #e2e8f0; font-weight: 700; color: ${data.benchmarkData.customerComparison.differencePercent >= 0 ? '#22c55e' : '#ef4444'};">
                ${data.benchmarkData.customerComparison.differencePercent >= 0 ? '+' : ''}${data.benchmarkData.customerComparison.differencePercent.toFixed(1)}%
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- 인사이트 -->
        <div style="padding: 15px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.6;">
            💡 <strong>업종 비교 인사이트:</strong> 
            ${data.overallRisk > data.benchmarkData.averageRiskScore
        ? `현재 안전점수가 업종 평균보다 ${(data.overallRisk - data.benchmarkData.averageRiskScore).toFixed(1)}점 높아 상대적으로 안정적입니다. 현재의 운영 방식을 유지하면서 지속적인 모니터링으로 안정성을 더욱 강화하세요.`
        : `안전점수가 업종 평균보다 ${Math.abs(data.overallRisk - data.benchmarkData.averageRiskScore).toFixed(1)}점 낮습니다. 매출 안정화와 고객 유지 전략에 집중하여 위험도를 낮춰보세요. 아래 맞춤 개선 제안을 참고하세요.`}
            ${data.benchmarkData.revenueComparison.differencePercent < -10
        ? ' 특히 매출이 업종 평균보다 10% 이상 낮으므로 매출 증대 방안을 우선 검토해야 합니다.'
        : data.benchmarkData.revenueComparison.differencePercent > 10
          ? ' 매출은 업종 평균보다 10% 이상 높아 우수합니다.'
          : ''}
          </p>
        </div>
      </div>
      ` : ''}

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
