import { Link } from "@/lib/next-compat";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            홈으로 돌아가기
          </Link>
        </Button>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">자주 묻는 질문</h1>
          <p className="text-lg text-muted-foreground mb-12">
            사업 안전 진단 서비스에 대해 자주 묻는 질문들을 모았습니다.
          </p>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">서비스 이용</h2>
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="border rounded-lg px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="text-left font-semibold">진단 비용이 있나요?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    아니요, 완전 무료입니다. 회원가입 없이도 바로 진단을 받을 수 있으며, 추가 비용은 일체 발생하지
                    않습니다. 다만, 더 상세한 분석과 과거 기록 저장을 원하시면 회원가입을 권장드립니다.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border rounded-lg px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="text-left font-semibold">회원가입이 필요한가요?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    회원가입 없이도 진단을 받을 수 있습니다. 하지만 회원가입을 하시면 과거 진단 기록을 저장하고, 추세를
                    분석하며, 정기적인 알림을 받을 수 있습니다.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border rounded-lg px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="text-left font-semibold">진단은 얼마나 자주 받아야 하나요?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    월 1회 정기적인 진단을 권장합니다. 매출이나 고객 수에 큰 변화가 있을 때는 즉시 진단을 받아보시는
                    것이 좋습니다. 정기적인 진단을 통해 추세를 파악하고 조기에 대응할 수 있습니다.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">정확도 및 신뢰성</h2>
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-4" className="border rounded-lg px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="text-left font-semibold">진단 결과는 얼마나 정확한가요?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    수천 개의 실제 사업장 데이터를 학습한 AI 모델을 사용하며, 평균 85% 이상의 예측 정확도를 보이고
                    있습니다. 다만, AI 예측은 참고 자료이며 실제 경영 판단은 종합적인 상황을 고려하여 내리셔야 합니다.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border rounded-lg px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="text-left font-semibold">어떤 데이터를 기반으로 분석하나요?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    매출 추세, 고객 수 변화, 업종별 평균 데이터, 지역 시장 상황 등을 종합적으로 분석합니다. 공공
                    데이터와 실제 사업장 데이터를 결합하여 더욱 정확한 예측을 제공합니다.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6" className="border rounded-lg px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="text-left font-semibold">모든 업종에 적용 가능한가요?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    네, 음식점, 카페, 소매업, 서비스업 등 대부분의 소상공인 업종에 적용 가능합니다. 각 업종별 특성을
                    반영한 분석 모델을 사용하여 더욱 정확한 결과를 제공합니다.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">개인정보 보호</h2>
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-7" className="border rounded-lg px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="text-left font-semibold">입력한 정보는 안전한가요?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    네, 모든 데이터는 암호화되어 안전하게 보관됩니다. 개인정보는 분석 목적으로만 사용되며, 제3자에게
                    제공되지 않습니다. 자세한 내용은 개인정보처리방침을 참고해주세요.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8" className="border rounded-lg px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="text-left font-semibold">데이터를 삭제할 수 있나요?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    네, 언제든지 설정 페이지에서 진단 기록을 삭제하거나 회원 탈퇴를 통해 모든 데이터를 삭제할 수
                    있습니다. 삭제된 데이터는 복구할 수 없으니 신중하게 결정해주세요.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">기술 지원</h2>
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-9" className="border rounded-lg px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="text-left font-semibold">모바일에서도 사용할 수 있나요?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    네, 모바일 브라우저에서 최적화되어 있습니다. 스마트폰이나 태블릿에서도 편리하게 이용하실 수
                    있습니다.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-10" className="border rounded-lg px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="text-left font-semibold">진단 결과를 다운로드할 수 있나요?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    네, 진단 결과 페이지에서 PDF 형식으로 다운로드할 수 있습니다. 다운로드한 보고서는 금융기관 제출
                    자료나 경영 개선 계획 수립에 활용하실 수 있습니다.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          <Card className="mt-12 bg-primary/5 border-primary/20">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">더 궁금하신 점이 있으신가요?</p>
              <Button asChild>
                <Link href="/support">고객 지원 문의하기</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
