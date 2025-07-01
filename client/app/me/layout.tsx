import Protected from '@/components/auth/Protected';
import React, { ReactNode } from 'react';

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <Protected>
      <div>{children}</div>;
    </Protected>
  );
};

export default layout;
