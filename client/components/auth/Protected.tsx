'use client';
import { selectUserState } from '@/reducers/userReducer';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PageLoader from '../page_loader/PageLoader';
import { UserRoleValues } from '@/types/types';

const Protected = ({
  children,
  roles,
}: {
  children: ReactNode;
  roles?: UserRoleValues[];
}) => {
  const { loading, initialized, user } = useSelector(selectUserState);
  const router = useRouter();
  useEffect(() => {
    if (initialized && !loading) {
      if (!user) {
        router.push('/login');
      } else if (roles && !roles.some((role) => user.roles.includes(role))) {
        router.push('/');
      }
    }
  }, [user, initialized, router, loading]);

  if (
    !initialized ||
    (!user && initialized && !loading) ||
    (roles && user && !user.roles.every((role) => roles.includes(role)))
  )
    return <PageLoader />;

  return <>{children}</>;
};

export default Protected;
