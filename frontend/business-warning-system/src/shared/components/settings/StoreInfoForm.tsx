import { Save, Store } from "lucide-react";
import { useState } from "react";

import { useToast } from "@/shared/hooks/use-toast";

import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface StoreInfo {
  name: string;
  industry: string;
  region: string;
  phone: string;
  email: string;
}

interface StoreInfoFormProps {
  initialData?: StoreInfo;
  onSave?: (data: StoreInfo) => void;
}

export function StoreInfoForm({ initialData, onSave }: StoreInfoFormProps) {
  const { toast } = useToast();
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(
    initialData || {
      name: "우리 가게",
      industry: "restaurant",
      region: "gangnam",
      phone: "02-1234-5678",
      email: "store@example.com",
    }
  );

  const handleSave = () => {
    console.log("[v0] Saving store info:", storeInfo);
    onSave?.(storeInfo);
    toast({
      title: "저장 완료",
      description: "가게 정보가 성공적으로 저장되었습니다.",
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5" />
          가게 정보
        </CardTitle>
        <CardDescription>가게의 기본 정보를 입력하세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="store-name">가게 이름</Label>
          <Input
            id="store-name"
            value={storeInfo.name}
            onChange={(e) => setStoreInfo({ ...storeInfo, name: e.target.value })}
            placeholder="가게 이름을 입력하세요"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">업종</Label>
          <Select value={storeInfo.industry} onValueChange={(value) => setStoreInfo({ ...storeInfo, industry: value })}>
            <SelectTrigger id="industry">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="restaurant">음식점</SelectItem>
              <SelectItem value="cafe">카페</SelectItem>
              <SelectItem value="retail">소매</SelectItem>
              <SelectItem value="service">서비스업</SelectItem>
              <SelectItem value="other">기타</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">지역</Label>
          <Select value={storeInfo.region} onValueChange={(value) => setStoreInfo({ ...storeInfo, region: value })}>
            <SelectTrigger id="region">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gangnam">강남구</SelectItem>
              <SelectItem value="seocho">서초구</SelectItem>
              <SelectItem value="songpa">송파구</SelectItem>
              <SelectItem value="gangdong">강동구</SelectItem>
              <SelectItem value="other">기타</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">전화번호</Label>
          <Input
            id="phone"
            type="tel"
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

        <Button onClick={handleSave} className="w-full gap-2">
          <Save className="h-4 w-4" />
          저장하기
        </Button>
      </CardContent>
    </Card>
  );
}

