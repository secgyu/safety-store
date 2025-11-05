import { AlertTriangle, Trash2 } from "lucide-react";

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
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useToast } from "@/shared/hooks/use-toast";

interface DataManagementProps {
  onDeleteHistory?: () => void;
  onDeleteAccount?: () => void;
}

export function DataManagement({ onDeleteHistory, onDeleteAccount }: DataManagementProps) {
  const { toast } = useToast();

  const handleDeleteHistory = () => {
    console.log("[v0] Deleting history");
    onDeleteHistory?.();
    toast({
      title: "삭제 완료",
      description: "모든 진단 기록이 삭제되었습니다.",
      variant: "destructive",
    });
  };

  const handleDeleteAccount = () => {
    console.log("[v0] Deleting account");
    onDeleteAccount?.();
    toast({
      title: "계정 삭제 요청",
      description: "계정 삭제가 예약되었습니다. 7일 후 완전히 삭제됩니다.",
      variant: "destructive",
    });
  };

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          데이터 관리
        </CardTitle>
        <CardDescription>진단 기록을 삭제하거나 계정을 삭제할 수 있습니다</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Delete History */}
        <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-semibold mb-1">진단 기록 삭제</h4>
              <p className="text-sm text-muted-foreground">모든 진단 기록과 관련 데이터를 삭제합니다</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="gap-2 text-orange-600 border-orange-600 hover:bg-orange-50">
                  <Trash2 className="h-4 w-4" />
                  기록 삭제
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>진단 기록을 삭제하시겠습니까?</AlertDialogTitle>
                  <AlertDialogDescription>
                    이 작업은 되돌릴 수 없습니다. 모든 진단 기록, 차트 데이터, 실행 계획이 영구적으로 삭제됩니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteHistory} className="bg-orange-600 hover:bg-orange-700">
                    삭제하기
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Delete Account */}
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-semibold mb-1">계정 삭제</h4>
              <p className="text-sm text-muted-foreground">
                계정과 모든 데이터를 영구적으로 삭제합니다. 7일 이내 취소 가능합니다.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="gap-2 text-red-600 border-red-600 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                  계정 삭제
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>계정을 삭제하시겠습니까?</AlertDialogTitle>
                  <AlertDialogDescription>
                    이 작업은 매우 신중하게 결정해야 합니다. 계정 삭제 후 7일 이내에 취소하지 않으면 모든 데이터가
                    영구적으로 삭제됩니다.
                    <br />
                    <br />
                    <strong>다음 데이터가 삭제됩니다:</strong>
                    <ul className="list-disc list-inside mt-2 text-sm">
                      <li>가게 정보</li>
                      <li>진단 기록</li>
                      <li>실행 계획</li>
                      <li>알림 설정</li>
                    </ul>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                    계정 삭제하기
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          * 데이터 삭제는 신중하게 결정해주세요. 삭제된 데이터는 복구할 수 없습니다.
        </p>
      </CardContent>
    </Card>
  );
}

