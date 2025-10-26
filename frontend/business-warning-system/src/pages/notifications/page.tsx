import { AlertTriangle, Bell, Calendar, Check, Filter,Info, Target, TrendingDown, X } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Mock notification data - 실제로는 API에서 가져옴
const mockNotifications = [
  {
    id: "1",
    type: "risk_change",
    title: "위험도 등급 변경",
    message: "귀하의 위험도가 YELLOW에서 ORANGE로 상승했습니다. 즉시 확인이 필요합니다.",
    timestamp: "2024-01-15T10:30:00",
    read: false,
    priority: "high",
    link: "/results",
  },
  {
    id: "2",
    type: "benchmark",
    title: "업종 평균 대비 변화",
    message: "귀하의 매출이 업종 평균 대비 15% 감소했습니다.",
    timestamp: "2024-01-14T15:20:00",
    read: false,
    priority: "medium",
    link: "/compare",
  },
  {
    id: "3",
    type: "reminder",
    title: "정기 진단 리마인더",
    message: "마지막 진단 후 30일이 경과했습니다. 재진단을 권장합니다.",
    timestamp: "2024-01-14T09:00:00",
    read: true,
    priority: "low",
    link: "/diagnose",
  },
  {
    id: "4",
    type: "action_plan",
    title: "개선 계획 진행 상황",
    message: "10개의 액션 아이템 중 5개를 완료했습니다. 50% 달성!",
    timestamp: "2024-01-13T14:45:00",
    read: true,
    priority: "low",
    link: "/action-plan",
  },
  {
    id: "5",
    type: "insight",
    title: "새로운 인사이트",
    message: "귀하의 업종에서 고객 유지율이 중요한 지표로 부상하고 있습니다.",
    timestamp: "2024-01-12T11:00:00",
    read: true,
    priority: "low",
    link: "/insights",
  },
  {
    id: "6",
    type: "risk_change",
    title: "긍정적 변화 감지",
    message: "지난 달 대비 매출이 12% 증가했습니다. 좋은 흐름입니다!",
    timestamp: "2024-01-10T16:30:00",
    read: true,
    priority: "medium",
    link: "/dashboard",
  },
];

const notificationTypes = [
  { value: "all", label: "전체" },
  { value: "risk_change", label: "위험도 변화" },
  { value: "benchmark", label: "업종 비교" },
  { value: "reminder", label: "리마인더" },
  { value: "action_plan", label: "개선 계획" },
  { value: "insight", label: "인사이트" },
];

function getNotificationIcon(type: string) {
  switch (type) {
    case "risk_change":
      return <AlertTriangle className="h-5 w-5" />;
    case "benchmark":
      return <TrendingDown className="h-5 w-5" />;
    case "reminder":
      return <Calendar className="h-5 w-5" />;
    case "action_plan":
      return <Target className="h-5 w-5" />;
    case "insight":
      return <Info className="h-5 w-5" />;
    default:
      return <Bell className="h-5 w-5" />;
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "bg-red-500/10 text-red-600 border-red-200";
    case "medium":
      return "bg-orange-500/10 text-orange-600 border-orange-200";
    case "low":
      return "bg-blue-500/10 text-blue-600 border-blue-200";
    default:
      return "bg-gray-500/10 text-gray-600 border-gray-200";
  }
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins}분 전`;
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`;
  } else if (diffDays < 7) {
    return `${diffDays}일 전`;
  } else {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

export default function NotificationsPage() {
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              자영업 조기경보
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/diagnose" className="text-gray-600 hover:text-blue-600">
                진단하기
              </Link>
              <Link to="/compare" className="text-gray-600 hover:text-blue-600">
                업종 비교
              </Link>
              <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">
                대시보드
              </Link>
              <Link to="/notifications" className="text-blue-600 font-medium">
                알림
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">알림 센터</h1>
              <p className="text-gray-600">비즈니스 상태 변화와 중요한 알림을 확인하세요</p>
            </div>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white px-3 py-1 text-sm">{unreadCount}개 읽지 않음</Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm">
              <Check className="h-4 w-4 mr-2" />
              모두 읽음 표시
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              필터
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {notificationTypes.map((type) => (
            <Button
              key={type.value}
              variant={type.value === "all" ? "default" : "outline"}
              size="sm"
              className="whitespace-nowrap"
            >
              {type.label}
            </Button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {mockNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 transition-all hover:shadow-md ${
                !notification.read ? "bg-blue-50/50 border-blue-200" : "bg-white"
              }`}
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getPriorityColor(
                    notification.priority
                  )}`}
                >
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className={`font-semibold ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{notification.message}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{formatTimestamp(notification.timestamp)}</span>
                    <Link to={notification.link}>
                      <Button variant="link" size="sm" className="h-auto p-0 text-blue-600">
                        자세히 보기 →
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State (if no notifications) */}
        {mockNotifications.length === 0 && (
          <Card className="p-12 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">알림이 없습니다</h3>
            <p className="text-gray-600 mb-6">새로운 알림이 도착하면 여기에 표시됩니다</p>
            <Link to="/diagnose">
              <Button>진단 시작하기</Button>
            </Link>
          </Card>
        )}
      </main>
    </div>
  );
}
