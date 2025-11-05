import { AlertCircle, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useSignup } from '@/features/auth';
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

const INDUSTRIES = [
  "음식점",
  "카페/디저트",
  "소매/유통",
  "미용/뷰티",
  "학원/교육",
  "의료/건강",
  "숙박/여행",
  "문화/여가",
  "기타",
];

export default function SignupPage() {
  const navigate = useNavigate();
  const signup = useSignup();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    businessName: "",
    industry: "",
  });
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Validate inputs
    if (!formData.email || !formData.password || !formData.name) {
      setValidationError("필수 항목을 모두 입력해주세요.");
      return;
    }

    if (formData.password.length < 6) {
      setValidationError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // Sign up
      await signup.mutateAsync({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        businessName: formData.businessName || undefined,
        industry: formData.industry || undefined,
      });
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          홈으로 돌아가기
        </Link>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
            <CardDescription>자영업 조기경보 시스템에 가입하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {(validationError || signup.error) && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{validationError || signup.error?.message}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">이메일 *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">이름 *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="홍길동"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">상호명</Label>
                <Input
                  id="businessName"
                  type="text"
                  placeholder="예: 홍길동 카페"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">업종</Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => setFormData({ ...formData, industry: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="업종을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호 *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="최소 6자 이상"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인 *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={signup.isPending}>
                {signup.isPending ? "가입 중..." : "회원가입"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              이미 계정이 있으신가요?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                로그인
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
