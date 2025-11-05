import { Bell, Mail, Save } from "lucide-react";
import { useState } from "react";

import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { useToast } from "@/shared/hooks/use-toast";

interface NotificationConfig {
  emailAlerts: boolean;
  riskThreshold: string;
  monthlyReport: boolean;
  marketingEmails: boolean;
}

interface NotificationSettingsProps {
  initialData?: NotificationConfig;
  onSave?: (data: NotificationConfig) => void;
}

export function NotificationSettings({ initialData, onSave }: NotificationSettingsProps) {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<NotificationConfig>(
    initialData || {
      emailAlerts: true,
      riskThreshold: "ORANGE",
      monthlyReport: true,
      marketingEmails: false,
    }
  );

  const handleSave = () => {
    console.log("[v0] Saving notifications:", notifications);
    onSave?.(notifications);
    toast({
      title: "저장 완료",
      description: "알림 설정이 성공적으로 저장되었습니다.",
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          알림 설정
        </CardTitle>
        <CardDescription>원하는 알림을 설정하세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2">
          <div className="flex-1 space-y-1">
            <Label htmlFor="email-alerts" className="text-base">
              이메일 알림
            </Label>
            <p className="text-sm text-muted-foreground">위험도 변화 시 이메일로 알림을 받습니다</p>
          </div>
          <Switch
            id="email-alerts"
            checked={notifications.emailAlerts}
            onCheckedChange={(checked) => setNotifications({ ...notifications, emailAlerts: checked })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="risk-threshold">알림 위험도 기준</Label>
          <Select
            value={notifications.riskThreshold}
            onValueChange={(value) => setNotifications({ ...notifications, riskThreshold: value })}
          >
            <SelectTrigger id="risk-threshold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GREEN">녹색 (안전) 이상</SelectItem>
              <SelectItem value="YELLOW">노란색 (주의) 이상</SelectItem>
              <SelectItem value="ORANGE">주황색 (경고) 이상</SelectItem>
              <SelectItem value="RED">빨간색 (위험)만</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">선택한 기준 이상의 위험도에서만 알림을 받습니다</p>
        </div>

        <div className="flex items-center justify-between space-x-2">
          <div className="flex-1 space-y-1">
            <Label htmlFor="monthly-report" className="text-base">
              월간 리포트
            </Label>
            <p className="text-sm text-muted-foreground">매월 초 지난달 요약 리포트를 이메일로 받습니다</p>
          </div>
          <Switch
            id="monthly-report"
            checked={notifications.monthlyReport}
            onCheckedChange={(checked) => setNotifications({ ...notifications, monthlyReport: checked })}
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <div className="flex-1 space-y-1">
            <Label htmlFor="marketing-emails" className="text-base flex items-center gap-2">
              <Mail className="h-4 w-4" />
              마케팅 이메일
            </Label>
            <p className="text-sm text-muted-foreground">신규 기능, 팁, 프로모션 안내를 받습니다</p>
          </div>
          <Switch
            id="marketing-emails"
            checked={notifications.marketingEmails}
            onCheckedChange={(checked) => setNotifications({ ...notifications, marketingEmails: checked })}
          />
        </div>

        <Button onClick={handleSave} className="w-full gap-2">
          <Save className="h-4 w-4" />
          저장하기
        </Button>
      </CardContent>
    </Card>
  );
}

