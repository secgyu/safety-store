import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { DataManagement, NotificationSettings, StoreInfoForm } from "@/shared/components/settings";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">대시보드로 돌아가기</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">설정</h1>
          <p className="text-lg text-muted-foreground">가게 정보와 알림 설정을 관리하세요</p>
        </div>

        {/* Store Information */}
        <StoreInfoForm />

        {/* Notification Settings */}
        <NotificationSettings />

        {/* Data Management */}
        <DataManagement />
      </div>
    </div>
  );
}
