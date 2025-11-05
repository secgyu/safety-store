import { HelpCircle, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useLogout } from "@/features/auth";
import { UserMenu } from "@/features/user/components/UserMenu";
import { Button } from "@/shared/components/ui/button";
import { resetOnboarding } from "@/shared/services/onboarding/onboardingService";

export function AppHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logout = useLogout();
  const [unreadCount, setUnreadCount] = useState(3);

  const navLinks = [
    { href: "/diagnose", label: "진단하기" },
    { href: "/compare", label: "업종 비교" },
    { href: "/calculators", label: "재무 계산기" },
    { href: "/support", label: "고객 지원" },
  ];

  const isActive = (href: string) => location.pathname === href;

  const handleRestartTutorial = () => {
    resetOnboarding();
    window.location.href = "/";
  };

  const handleLogout = () => {
    logout.mutate();
    navigate("/");
  };

  return (
    <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center font-bold text-xl text-primary hover:opacity-80 transition-opacity">
            <img src="/public/favicon.svg" alt="구해줘 가게" className="w-12 h-12" />
            <span className="hidden sm:inline">구해줘 가게</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleRestartTutorial} title="튜토리얼 다시보기">
              <HelpCircle className="h-5 w-5" />
            </Button>

            {/* User Menu or Login/Logout */}
            <UserMenu />

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
