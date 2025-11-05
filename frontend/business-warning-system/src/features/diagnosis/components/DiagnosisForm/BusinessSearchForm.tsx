import { Search } from "lucide-react";

import { Input } from "@/shared/components/ui/input";

interface BusinessSearchFormProps {
  searchKeyword: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
  isSearching?: boolean;
}

export function BusinessSearchForm({
  searchKeyword,
  onSearchChange,
  onSearch,
  placeholder = "가게 이름 앞 글자를 입력하세요 (1-2자)",
  isSearching = false,
}: BusinessSearchFormProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchKeyword.trim()) {
      onSearch();
    }
  };

  return (
    <div className="flex gap-3">
      <div className="flex-1 relative">
        <Input
          value={searchKeyword}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="h-12 pr-10"
          disabled={isSearching}
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      <button
        onClick={onSearch}
        disabled={!searchKeyword.trim() || isSearching}
        className="h-12 px-6 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
      >
        <Search className="h-5 w-5" />
        검색
      </button>
    </div>
  );
}

