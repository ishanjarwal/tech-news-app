'use client';
import { useAuth } from '@/hooks/useAuth';
import React, { ReactNode } from 'react';

const InitializeUser = ({ children }: { children: ReactNode }) => {
  useAuth();

  return <>{children}</>;
};

export default InitializeUser;
