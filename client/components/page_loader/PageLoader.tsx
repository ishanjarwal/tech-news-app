import { Loader } from 'lucide-react';
import React from 'react';

const PageLoader = () => {
  return (
    <div className="bg-background/90 fixed top-0 left-0 z-[1000] flex h-screen w-screen items-center justify-center backdrop-blur-md">
      <Loader size={24} className="animate-spin" />
    </div>
  );
};

export default PageLoader;
