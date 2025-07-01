'use client';

import { ReactNode } from 'react';
import { appstore } from '@/stores/appstore';
import { Provider } from 'react-redux';

const AppStoreProvider = ({ children }: { children: ReactNode }) => {
  return <Provider store={appstore}>{children}</Provider>;
};

export default AppStoreProvider;
