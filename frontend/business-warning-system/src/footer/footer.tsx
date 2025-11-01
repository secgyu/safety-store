import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const footer = () => {
  return (
    <div>
      <footer className="glass mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/public/favicon.svg" alt="구해줘 가게" className="w-12 h-12" />
                <span className="font-bold">구해줘 가게</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                서울 성동구 영세·중소 가맹점을 위한 AI 기반 폐업 위험 조기경보 시스템
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                이메일: support@business-safety.kr
                <br />
                전화: 1588-0000
              </p>
              <div className="flex items-center gap-3">
                <Link
                  to="https://www.facebook.com/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link to="https://x.com/" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link
                  to="https://www.instagram.com/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link
                  to="https://www.youtube.com/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Youtube className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">리소스</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/statistics" className="hover:text-foreground transition-colors">
                    자영업 통계
                  </Link>
                </li>
                <li>
                  <Link to="/insights" className="hover:text-foreground transition-colors">
                    업종별 인사이트
                  </Link>
                </li>
                <li>
                  <Link to="/success-stories" className="hover:text-foreground transition-colors">
                    성공 사례
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">고객 지원</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/support" className="hover:text-foreground transition-colors">
                    문의하기
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-foreground transition-colors">
                    자주 묻는 질문
                  </Link>
                </li>
                <li>
                  <Link to="/guide" className="hover:text-foreground transition-colors">
                    이용 가이드
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">약관 및 정책</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/terms" className="hover:text-foreground transition-colors">
                    이용약관
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-foreground transition-colors">
                    개인정보처리방침
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 사업 안전 진단. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default footer;
