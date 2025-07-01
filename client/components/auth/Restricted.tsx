'use client';
import { selectUserState } from '@/reducers/userReducer';
import { useRouter } from 'next/navigation';
import React, { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PageLoader from '../page_loader/PageLoader';

const Restricted = ({ children }: { children: ReactNode }) => {
  const { loading, initialized, user } = useSelector(selectUserState);
  const router = useRouter();
  useEffect(() => {
    if (user && initialized && !loading) {
      router.push('/');
    }
  }, [user, initialized, loading, router]);

  if (!initialized) return <PageLoader />;
  if (user && initialized && !loading) return <PageLoader />; // Redirecting

  return <>{children}</>;
};

export default Restricted;
