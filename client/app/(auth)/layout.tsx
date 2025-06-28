import Image from 'next/image';
import { ReactNode } from 'react';

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="border-border flex h-full flex-col-reverse border-y lg:flex-row">
      <div className="border-border flex flex-1 items-center justify-center py-16 lg:border-e lg:py-32">
        {children}
      </div>
      <div className="relative h-32 lg:h-auto lg:flex-1">
        <Image
          src={'/images/abstract_waves.jpeg'}
          alt={'Abstract waves'}
          fill
          className="absolute h-full w-full object-cover object-center"
        />
      </div>
    </div>
  );
};

export default layout;
