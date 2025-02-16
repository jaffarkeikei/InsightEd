
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Files } from "lucide-react";

interface ReportsSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onGenerateAllReports: () => void;
}

const ReportsSearch = ({ searchQuery, onSearchChange, onGenerateAllReports }: ReportsSearchProps) => {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="default"
        onClick={onGenerateAllReports}
        className="flex items-center gap-2"
      >
        <Files className="h-4 w-4" />
        Generate All Reports
      </Button>
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
};

export default ReportsSearch;
