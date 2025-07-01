'use client';
import { selectUserState } from '@/reducers/userReducer';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PageLoader from '../page_loader/PageLoader';

const Protected = ({ children }: { children: ReactNode }) => {
  const { loading, initialized, user } = useSelector(selectUserState);
  const router = useRouter();
  useEffect(() => {
    if (!user && initialized && !loading) {
      router.push('/login');
    }
  }, [user, initialized, router, loading]);

  if (!initialized) return <PageLoader />;
  if (!user && initialized && !loading) return <PageLoader />;

  return <>{children}</>;
};

export default Protected;
