import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            홈으로 돌아가기
          </Link>
        </Button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">이용약관</h1>
          <p className="text-muted-foreground mb-8">최종 수정일: 2025년 1월 18일</p>

          <div className="prose prose-slate max-w-none space-y-8">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-bold">제1조 (목적)</h2>
                <p className="text-muted-foreground leading-relaxed">
                  본 약관은 사업 안전 진단(이하 "회사")이 제공하는 사업 위험도 진단 서비스(이하 "서비스")의 이용과
                  관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-bold">제2조 (정의)</h2>
                <p className="text-muted-foreground leading-relaxed">
                  본 약관에서 사용하는 용어의 정의는 다음과 같습니다.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>
                    "서비스"란 회사가 제공하는 AI 기반 사업 위험도 진단, 분석, 개선 제안 등 일체의 서비스를 의미합니다.
                  </li>
                  <li>"이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 자를 말합니다.</li>
                  <li>
                    "회원"란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며,
                    회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.
                  </li>
                  <li>"비회원"란 회원가입 없이 회사가 제공하는 서비스를 이용하는 자를 말합니다.</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-bold">제3조 (약관의 효력 및 변경)</h2>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                  <li>본 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다.</li>
                  <li>
                    회사는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 본 약관을 변경할 수 있으며, 약관이 변경되는
                    경우 변경사항을 시행일자 7일 전부터 공지합니다.
                  </li>
                  <li>
                    이용자가 변경된 약관에 동의하지 않는 경우, 서비스 이용을 중단하고 탈퇴할 수 있습니다. 변경된 약관의
                    효력 발생일 이후에도 서비스를 계속 이용하는 경우에는 약관 변경에 동의한 것으로 간주됩니다.
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-bold">제4조 (서비스의 제공)</h2>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                  <li>
                    회사는 다음과 같은 서비스를 제공합니다.
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>AI 기반 사업 위험도 진단 및 분석</li>
                      <li>업종별, 지역별 비교 분석</li>
                      <li>맞춤형 개선 제안</li>
                      <li>진단 기록 저장 및 추세 분석 (회원 한정)</li>
                      <li>기타 회사가 추가 개발하거나 제휴계약 등을 통해 제공하는 일체의 서비스</li>
                    </ul>
                  </li>
                  <li>
                    서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다. 다만, 시스템 점검, 서버 증설 및 교체 등
                    운영상 필요한 경우 서비스의 전부 또는 일부를 일시 중단할 수 있습니다.
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-bold">제5조 (회원가입)</h2>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                  <li>
                    이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 함으로써
                    회원가입을 신청합니다.
                  </li>
                  <li>
                    회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로
                    등록합니다.
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
                      <li>기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</li>
                    </ul>
                  </li>
                  <li>회원가입계약의 성립 시기는 회사의 승낙이 이용자에게 도달한 시점으로 합니다.</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-bold">제6조 (회원 탈퇴 및 자격 상실)</h2>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                  <li>
                    회원은 언제든지 설정 페이지 또는 고객센터를 통해 탈퇴를 요청할 수 있으며, 회사는 즉시 회원 탈퇴를
                    처리합니다.
                  </li>
                  <li>
                    회원이 다음 각 호의 사유에 해당하는 경우, 회사는 회원자격을 제한 및 정지시킬 수 있습니다.
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>가입 신청 시에 허위 내용을 등록한 경우</li>
                      <li>
                        다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우
                      </li>
                      <li>서비스를 이용하여 법령 또는 본 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</li>
                    </ul>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-bold">제7조 (이용자의 의무)</h2>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                  <li>
                    이용자는 다음 행위를 하여서는 안 됩니다.
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>신청 또는 변경 시 허위 내용의 등록</li>
                      <li>타인의 정보 도용</li>
                      <li>회사가 게시한 정보의 변경</li>
                      <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                      <li>회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                      <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                      <li>
                        외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는
                        행위
                      </li>
                    </ul>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-bold">제8조 (서비스 이용의 제한)</h2>
                <p className="text-muted-foreground leading-relaxed">
                  회사는 이용자가 본 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 경고, 일시정지,
                  영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-bold">제9조 (서비스 제공의 중지)</h2>
                <p className="text-muted-foreground leading-relaxed">
                  회사는 다음 각 호에 해당하는 경우 서비스 제공을 중지할 수 있습니다.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>서비스용 설비의 보수 등 공사로 인한 부득이한 경우</li>
                  <li>전기통신사업법에 규정된 기간통신사업자가 전기통신 서비스를 중지했을 경우</li>
                  <li>국가비상사태, 서비스 설비의 장애 또는 서비스 이용의 폭주 등으로 서비스 이용에 지장이 있는 때</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-bold">제10조 (면책조항)</h2>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                  <li>
                    회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에
                    관한 책임이 면제됩니다.
                  </li>
                  <li>회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.</li>
                  <li>
                    회사는 이용자가 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며, 그 밖의
                    서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.
                  </li>
                  <li>
                    회사는 서비스에서 제공하는 진단 결과 및 분석 정보의 정확성, 신뢰성에 대해서는 보증하지 않으며,
                    이용자는 자신의 판단과 책임 하에 서비스를 이용해야 합니다.
                  </li>
                  <li>
                    진단 결과는 참고 자료로만 활용되어야 하며, 실제 경영 판단은 전문가의 조언을 받아 종합적으로 내리셔야
                    합니다.
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-bold">제11조 (분쟁 해결)</h2>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                  <li>
                    회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여
                    피해보상처리기구를 설치·운영합니다.
                  </li>
                  <li>
                    회사와 이용자 간에 발생한 전자상거래 분쟁과 관련하여 이용자의 피해구제신청이 있는 경우에는
                    공정거래위원회 또는 시·도지사가 의뢰하는 분쟁조정기관의 조정에 따를 수 있습니다.
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h2 className="text-2xl font-bold">제12조 (재판권 및 준거법)</h2>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                  <li>
                    회사와 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 제소 당시의 이용자의 주소에 의하고, 주소가
                    없는 경우에는 거소를 관할하는 지방법원의 전속관할로 합니다. 다만, 제소 당시 이용자의 주소 또는
                    거소가 분명하지 않거나 외국 거주자의 경우에는 민사소송법상의 관할법원에 제기합니다.
                  </li>
                  <li>회사와 이용자 간에 제기된 전자상거래 소송에는 대한민국 법을 적용합니다.</li>
                </ol>
              </CardContent>
            </Card>

            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  <strong>부칙</strong>
                  <br />본 약관은 2025년 1월 18일부터 적용됩니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
