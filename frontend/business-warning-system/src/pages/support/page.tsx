import { Clock, Mail, MapPin,MessageCircle, Phone } from "lucide-react";

import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <AppHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">고객 지원</h1>
          <p className="text-lg text-muted-foreground mb-12">
            궁금하신 점이나 도움이 필요하신가요? 언제든지 문의해주세요.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">이메일 문의</h3>
                <p className="text-sm text-muted-foreground mb-3">평일 24시간 이내 답변</p>
                <a href="mailto:support@business-warning.com" className="text-sm text-primary hover:underline">
                  support@business-warning.com
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">전화 상담</h3>
                <p className="text-sm text-muted-foreground mb-3">평일 09:00 - 18:00</p>
                <a href="tel:1588-0000" className="text-sm text-primary hover:underline">
                  1588-0000
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">카카오톡 상담</h3>
                <p className="text-sm text-muted-foreground mb-3">실시간 채팅 상담</p>
                <a href="#" className="text-sm text-primary hover:underline">
                  @사업안전진단
                </a>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-12">
            <CardHeader>
              <CardTitle>문의하기</CardTitle>
              <CardDescription>아래 양식을 작성해주시면 빠르게 답변드리겠습니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input id="name" placeholder="홍길동" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input id="email" type="email" placeholder="example@email.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">연락처</Label>
                  <Input id="phone" type="tel" placeholder="010-0000-0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">문의 제목</Label>
                  <Input id="subject" placeholder="문의 제목을 입력해주세요" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">문의 내용</Label>
                  <Textarea id="message" placeholder="문의 내용을 자세히 작성해주세요" rows={6} />
                </div>
                <Button type="submit" size="lg" className="w-full">
                  문의 보내기
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>운영 시간</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">고객센터 운영시간</p>
                  <p className="text-sm text-muted-foreground">평일 09:00 - 18:00 (주말 및 공휴일 휴무)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">본사 주소</p>
                  <p className="text-sm text-muted-foreground">서울특별시 강남구 테헤란로 123, 456호</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
