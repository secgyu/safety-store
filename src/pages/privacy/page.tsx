import { Link } from "@/lib/next-compat";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            홈으로 돌아가기
          </Link>
        </Button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">개인정보처리방침</h1>
          <p className="text-muted-foreground mb-8">최종 수정일: 2025년 1월 18일</p>

          <div className="prose prose-slate max-w-none space-y-8">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-bold">1. 개인정보의 수집 및 이용 목적</h2>
                <p className="text-muted-foreground leading-relaxed">
                  사업 안전 진단(이하 "회사")은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는
                  다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에
                  따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>사업 위험도 진단 서비스 제공</li>
                  <li>회원 관리 및 본인 확인</li>
                  <li>서비스 개선 및 신규 서비스 개발</li>
                  <li>고객 문의 및 불만 처리</li>
                  <li>통계 분석 및 학술 연구</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-bold">2. 수집하는 개인정보 항목</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">필수 수집 항목</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>사업장 정보: 업종, 지역, 영업 기간</li>
                      <li>경영 정보: 월 매출, 일 고객 수</li>
                      <li>회원 가입 시: 이메일, 비밀번호, 이름, 연락처</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">자동 수집 항목</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li>서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보</li>
                      <li>기기 정보 (OS, 브라우저 종류 등)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-bold">3. 개인정보의 보유 및 이용 기간</h2>
                <p className="text-muted-foreground leading-relaxed">
                  회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보
                  보유·이용기간 내에서 개인정보를 처리·보유합니다.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>회원 탈퇴 시까지 (단, 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간 동안 보관)</li>
                  <li>비회원 진단 기록: 진단 완료 후 90일</li>
                  <li>
                    법령에 따른 보관:
                    <ul className="list-circle list-inside ml-6 mt-2 space-y-1">
                      <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
                      <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                      <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
                    </ul>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-bold">4. 개인정보의 제3자 제공</h2>
                <p className="text-muted-foreground leading-relaxed">
                  회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로
                  합니다.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>이용자가 사전에 동의한 경우</li>
                  <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 요구가 있는 경우</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-bold">5. 개인정보 처리의 위탁</h2>
                <p className="text-muted-foreground leading-relaxed">
                  회사는 서비스 향상을 위해서 아래와 같이 개인정보를 위탁하고 있으며, 관계 법령에 따라 위탁계약 시
                  개인정보가 안전하게 관리될 수 있도록 필요한 사항을 규정하고 있습니다.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">수탁업체</th>
                        <th className="text-left py-2">위탁업무 내용</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b">
                        <td className="py-2">AWS</td>
                        <td className="py-2">클라우드 서버 운영 및 데이터 보관</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">SendGrid</td>
                        <td className="py-2">이메일 발송 서비스</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-bold">6. 정보주체의 권리·의무 및 행사방법</h2>
                <p className="text-muted-foreground leading-relaxed">
                  정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>개인정보 열람 요구</li>
                  <li>오류 등이 있을 경우 정정 요구</li>
                  <li>삭제 요구</li>
                  <li>처리정지 요구</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  권리 행사는 설정 페이지 또는 고객센터(support@business-warning.com)를 통해 하실 수 있으며, 회사는 이에
                  대해 지체 없이 조치하겠습니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-bold">7. 개인정보의 파기</h2>
                <p className="text-muted-foreground leading-relaxed">
                  회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당
                  개인정보를 파기합니다.
                </p>
                <div className="space-y-2">
                  <p className="font-semibold">파기 절차</p>
                  <p className="text-muted-foreground leading-relaxed">
                    이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져(종이의 경우 별도의 서류) 내부 방침 및 기타
                    관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">파기 방법</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>전자적 파일 형태: 복구 및 재생되지 않도록 안전하게 삭제</li>
                    <li>종이에 출력된 개인정보: 분쇄기로 분쇄하거나 소각</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-bold">8. 개인정보 보호책임자</h2>
                <p className="text-muted-foreground leading-relaxed">
                  회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및
                  피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p>
                    <span className="font-semibold">개인정보 보호책임자:</span> 홍길동
                  </p>
                  <p>
                    <span className="font-semibold">연락처:</span> 1588-0000
                  </p>
                  <p>
                    <span className="font-semibold">이메일:</span> privacy@business-warning.com
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-bold">9. 개인정보 처리방침 변경</h2>
                <p className="text-muted-foreground leading-relaxed">
                  이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는
                  경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
