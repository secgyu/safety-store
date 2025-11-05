import { MapPin } from "lucide-react";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

interface Industry {
  value: string;
  label: string;
}

interface IndustryFiltersProps {
  industries: Industry[];
  subIndustries: Record<string, Industry[]>;
  selectedCategory: string;
  selectedSubIndustry: string;
  onCategoryChange: (value: string) => void;
  onSubIndustryChange: (value: string) => void;
}

export function IndustryFilters({
  industries,
  subIndustries,
  selectedCategory,
  selectedSubIndustry,
  onCategoryChange,
  onSubIndustryChange,
}: IndustryFiltersProps) {
  return (
    <Card className="mb-8">
      <CardContent className="pt-6 pb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">업종 대분류</label>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry.value} value={industry.value}>
                    {industry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              세부 업종 <span className="text-muted-foreground text-xs">(선택사항)</span>
            </label>
            <Select value={selectedSubIndustry} onValueChange={onSubIndustryChange}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="전체 (대분류 평균)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">전체 (대분류 평균)</SelectItem>
                {subIndustries[selectedCategory]?.map((subIndustry) => (
                  <SelectItem key={subIndustry.value} value={subIndustry.value}>
                    {subIndustry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-3 text-sm text-muted-foreground flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className="font-medium">대상 지역:</span> 성동구 전체
        </div>
      </CardContent>
    </Card>
  );
}

