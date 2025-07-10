'use client';

import { cn } from '@/lib/utils';
import { logoutUser, selectUserState } from '@/reducers/userReducer';
import { AppDispatch } from '@/stores/appstore';
import { Loader, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

const LogoutButton = ({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) => {
  const { loading } = useSelector(selectUserState);
  const dispatch = useDispatch<AppDispatch>();
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <button
      onClick={() => {
        handleLogout();
        onClick && onClick();
      }}
      type="button"
      className={cn('w-full cursor-pointer text-start outline-none', className)}
    >
      {!loading ? (
        <span className="flex items-center space-x-2">
          <span>
            <LogOut />
          </span>
          <span>Logout</span>
        </span>
      ) : (
        <Loader className="mx-auto block animate-spin" />
      )}
    </button>
  );
};

export default LogoutButton;
