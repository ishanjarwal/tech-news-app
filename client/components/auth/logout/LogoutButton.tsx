'use client';

import { cn } from '@/lib/utils';
import { logoutUser, selectUserState } from '@/reducers/userReducer';
import { AppDispatch } from '@/stores/appstore';
import { Loader } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

const LogoutButton = ({ className }: { className?: string }) => {
  const { loading } = useSelector(selectUserState);
  const dispatch = useDispatch<AppDispatch>();
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <button
      onClick={handleLogout}
      type="button"
      className={cn('w-full cursor-pointer text-start outline-none', className)}
    >
      {!loading ? 'Logout' : <Loader className="mx-auto block animate-spin" />}
    </button>
  );
};

export default LogoutButton;
