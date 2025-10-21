"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Trash2, Bell, Store, Mail, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()

  // Store Information
  const [storeInfo, setStoreInfo] = useState({
    name: "우리 가게",
    industry: "restaurant",
    region: "gangnam",
    phone: "02-1234-5678",
    email: "store@example.com",
  })

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    riskThreshold: "ORANGE",
    monthlyReport: true,
    marketingEmails: false,
  })

  const handleSaveStoreInfo = () => {
    // Mock save - replace with actual API call
    console.log("[v0] Saving store info:", storeInfo)
    toast({
      title: "저장 완료",
      description: "가게 정보가 성공적으로 저장되었습니다.",
    })
  }

  const handleSaveNotifications = () => {
    // Mock save - replace with actual API call
    console.log("[v0] Saving notifications:", notifications)
    toast({
      title: "저장 완료",
      description: "알림 설정이 성공적으로 저장되었습니다.",
    })
  }

  const handleDeleteHistory = () => {
    // Mock delete - replace with actual API call
    console.log("[v0] Deleting history")
    toast({
      title: "삭제 완료",
      description: "모든 진단 기록이 삭제되었습니다.",
      variant: "destructive",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/dashboard"
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
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              가게 정보
            </CardTitle>
            <CardDescription>기본 정보를 수정할 수 있습니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">가게 이름</Label>
              <Input
                id="storeName"
                value={storeInfo.name}
                onChange={(e) => setStoreInfo({ ...storeInfo, name: e.target.value })}
                placeholder="가게 이름을 입력하세요"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">업종</Label>
                <Select
                  value={storeInfo.industry}
                  onValueChange={(value) => setStoreInfo({ ...storeInfo, industry: value })}
                >
                  <SelectTrigger id="industry">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurant">음식점</SelectItem>
                    <SelectItem value="cafe">카페</SelectItem>
                    <SelectItem value="retail">소매업</SelectItem>
                    <SelectItem value="service">서비스업</SelectItem>
                    <SelectItem value="beauty">미용업</SelectItem>
                    <SelectItem value="academy">학원</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">지역</Label>
                <Select
                  value={storeInfo.region}
                  onValueChange={(value) => setStoreInfo({ ...storeInfo, region: value })}
                >
                  <SelectTrigger id="region">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gangnam">강남구</SelectItem>
                    <SelectItem value="seocho">서초구</SelectItem>
                    <SelectItem value="songpa">송파구</SelectItem>
                    <SelectItem value="gangdong">강동구</SelectItem>
                    <SelectItem value="mapo">마포구</SelectItem>
                    <SelectItem value="yongsan">용산구</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">전화번호</Label>
                <Input
                  id="phone"
                  value={storeInfo.phone}
                  onChange={(e) => setStoreInfo({ ...storeInfo, phone: e.target.value })}
                  placeholder="02-1234-5678"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  value={storeInfo.email}
                  onChange={(e) => setStoreInfo({ ...storeInfo, email: e.target.value })}
                  placeholder="store@example.com"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={handleSaveStoreInfo} className="gap-2">
                <Save className="h-4 w-4" />
                저장하기
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              알림 설정
            </CardTitle>
            <CardDescription>위험도 알림과 리포트 수신 설정을 관리합니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailAlerts" className="text-base">
                  이메일 알림
                </Label>
                <p className="text-sm text-muted-foreground">위험도가 높아지면 이메일로 알림을 받습니다</p>
              </div>
              <Switch
                id="emailAlerts"
                checked={notifications.emailAlerts}
                onCheckedChange={(checked) => setNotifications({ ...notifications, emailAlerts: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="riskThreshold">알림 기준 위험도</Label>
              <Select
                value={notifications.riskThreshold}
                onValueChange={(value) => setNotifications({ ...notifications, riskThreshold: value })}
              >
                <SelectTrigger id="riskThreshold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="YELLOW">주의 (YELLOW) 이상</SelectItem>
                  <SelectItem value="ORANGE">경고 (ORANGE) 이상</SelectItem>
                  <SelectItem value="RED">위험 (RED)만</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">선택한 단계 이상의 위험도일 때 알림을 받습니다</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="monthlyReport" className="text-base">
                  월간 리포트
                </Label>
                <p className="text-sm text-muted-foreground">매월 진단 결과 요약을 이메일로 받습니다</p>
              </div>
              <Switch
                id="monthlyReport"
                checked={notifications.monthlyReport}
                onCheckedChange={(checked) => setNotifications({ ...notifications, monthlyReport: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketingEmails" className="text-base">
                  마케팅 이메일
                </Label>
                <p className="text-sm text-muted-foreground">새로운 기능과 팁을 이메일로 받습니다</p>
              </div>
              <Switch
                id="marketingEmails"
                checked={notifications.marketingEmails}
                onCheckedChange={(checked) => setNotifications({ ...notifications, marketingEmails: checked })}
              />
            </div>

            <div className="pt-4">
              <Button onClick={handleSaveNotifications} className="gap-2">
                <Save className="h-4 w-4" />
                저장하기
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="mb-6 border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              데이터 관리
            </CardTitle>
            <CardDescription>진단 기록을 삭제할 수 있습니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <h4 className="font-semibold mb-2 text-destructive">주의사항</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  모든 진단 기록을 삭제하면 복구할 수 없습니다. 삭제하기 전에 필요한 데이터는 다운로드하여 보관하세요.
                </p>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    모든 진단 기록 삭제
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
                    <AlertDialogDescription>
                      이 작업은 되돌릴 수 없습니다. 모든 진단 기록이 영구적으로 삭제됩니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteHistory} className="bg-destructive hover:bg-destructive/90">
                      삭제
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6 pb-6">
            <div className="flex gap-4">
              <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">도움이 필요하신가요?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  문의사항이 있으시면 언제든지 고객 지원팀에 연락해주세요.
                </p>
                <Button asChild variant="default" size="sm">
                  <Link href="/support">고객 지원 센터</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
