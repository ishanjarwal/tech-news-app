import Protected from '@/components/auth/Protected';
import PhotoUploader from '@/components/photo_upload/PhotoUploader';
import Header from '@/components/user_profile/Header';
import Stats from '@/components/user_profile/Stats';
import Tabs from '@/components/user_profile/Tabs';
import React, { ReactNode } from 'react';

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <Protected>
      <div className="mx-auto max-w-7xl px-0 sm:px-4 sm:py-16 md:px-8 lg:px-16 [1280px]:px-0">
        <div className="flex flex-col space-y-8">
          <Header />
          <Stats />
          <div className="relative w-full sm:rounded-2xl">
            <div className="sticky top-0 z-[2] w-full overflow-auto sm:static sm:top-auto">
              <Tabs />
            </div>
            <div className="min-h-[480px] overflow-y-auto py-4 sm:py-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </Protected>
  );
};

export default layout;
