import { AlertTriangle, Bell, Calendar, Check, Filter, Info, Target, TrendingDown, X } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { useDeleteNotification, useMarkNotificationAsRead, useNotifications } from "@/lib/api";

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
  const { data: notifications, isLoading, error } = useNotifications();
  const deleteMutation = useDeleteNotification();
  const markAsReadMutation = useMarkNotificationAsRead();

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleMarkAsRead = async (id: string) => {
    await markAsReadMutation.mutateAsync(id);
  };

  const handleMarkAllAsRead = async () => {
    if (!notifications) return;

    const unreadNotifications = notifications.filter((n) => !n.isRead);
    await Promise.all(unreadNotifications.map((n) => markAsReadMutation.mutateAsync(n.id)));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link
                to="/"
                className="flex items-center font-bold text-xl text-primary hover:opacity-80 transition-opacity"
              >
                <img src="/public/favicon.svg" alt="구해줘 가게" className="w-12 h-12" />
                <span className="hidden sm:inline">구해줘 가게</span>
              </Link>
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">알림을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !notifications) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">데이터를 불러올 수 없습니다</h2>
            <p className="text-muted-foreground mb-4">로그인이 필요하거나 일시적인 오류가 발생했습니다.</p>
            <div className="flex gap-2 justify-center">
              <Button asChild>
                <Link to="/login">로그인</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/">홈으로</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center font-bold text-xl text-primary hover:opacity-80 transition-opacity"
            >
              <img src="/public/favicon.svg" alt="구해줘 가게" className="w-12 h-12" />
              <span className="hidden sm:inline">구해줘 가게</span>
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
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
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
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 transition-all hover:shadow-md ${
                !notification.isRead ? "bg-blue-50/50 border-blue-200" : "bg-white"
              }`}
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getPriorityColor(
                    notification.type
                  )}`}
                >
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className={`font-semibold ${!notification.isRead ? "text-gray-900" : "text-gray-700"}`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4 text-blue-600" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDelete(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{notification.message}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{formatTimestamp(notification.createdAt)}</span>
                    <Link to={"/dashboard"}>
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
        {notifications.length === 0 && (
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
