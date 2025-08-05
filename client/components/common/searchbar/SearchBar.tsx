import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import React from 'react';

const SearchBar = () => {
  return (
    <div className="bg-accent flex max-w-sm flex-1 items-center space-x-2 rounded-md ps-2 pe-1 shadow-sm focus-within:ring-2">
      <Search size={'16'} />
      <Input
        className="h-8 w-full border-0 !bg-transparent p-0 text-xs shadow-none outline-none focus-visible:border-0 focus-visible:ring-0 sm:text-sm lg:h-9"
        placeholder="Search for anything"
      />
    </div>
  );
};

export default SearchBar;
