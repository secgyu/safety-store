import { Building2, CheckCircle } from "lucide-react";

import { Card } from "@/shared/components/ui/card";

import type { BusinessSearchResponse } from "../../types";

interface Business {
  encodedMct: string;
  businessName: string;
  industryCode: string;
  industryName?: string;
  region?: string;
}

interface BusinessListProps {
  businesses: BusinessSearchResponse["results"];
  selectedMct: string;
  onSelect: (mct: string) => void;
}

export function BusinessList({ businesses, selectedMct, onSelect }: BusinessListProps) {
  if (businesses.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>검색 결과가 없습니다.</p>
        <p className="text-sm mt-2">다른 키워드로 검색해보세요.</p>
      </div>
    );
  }

  console.log(businesses);
  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
      {businesses.map((business) => (
        <Card
          key={business.encodedMct}
          className={`p-4 cursor-pointer transition-all hover:shadow-md ${
            selectedMct === business.encodedMct
              ? "border-primary bg-primary/5 ring-2 ring-primary"
              : "hover:border-primary/50"
          }`}
          onClick={() => onSelect(business.encodedMct)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">{business.name}</h3>
                {selectedMct === business.encodedMct && <CheckCircle className="h-5 w-5 text-primary" />}
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                {business.businessType && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">{business.businessType}</span>
                )}
                {business.area && <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">{business.area}</span>}
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded font-mono text-xs">
                  {business.encodedMct}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
