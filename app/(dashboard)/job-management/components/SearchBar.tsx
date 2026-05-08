"use client";

import { Search } from "lucide-react";
import { useState } from "react";

type SearchBarProps = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative flex-1">
      <Search
        className="absolute left-3 top-5 -translate-y-1/2 text-custom-gray/60"
        size={18}
      />
      <input
        type="text"
        placeholder="Search by job title or department..."
        value={searchQuery}
        onChange={handleChange}
        className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm border-custom-gray/10 bg-transparent text-custom-gray/95 placeholder:text-custom-gray/60 focus:outline-none"
      />
    </div>
  );
}

