import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useFAQs } from "@/lib/api";
import { Link } from "react-router-dom";

export default function FAQPage() {
  const { data: faqs, isLoading } = useFAQs();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">FAQ를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // Group FAQs by category
  const groupedFAQs = faqs?.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, typeof faqs>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/">
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
            {groupedFAQs &&
              Object.entries(groupedFAQs).map(([category, items]) => (
                <div key={category}>
                  <h2 className="text-2xl font-bold mb-4">{category}</h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {items.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-6">
                        <AccordionTrigger className="hover:no-underline">
                          <span className="text-left font-semibold">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
