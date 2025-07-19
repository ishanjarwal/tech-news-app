import React from 'react';
import { Button } from '../ui/button';
import { google } from '@/assets/icons/icons';
import { env } from '@/config/env';

const GoogleAuthButton = () => {
  const handleLogin = () => {
    window.location.href = `${env.NEXT_PUBLIC_BASE_URL}/user/google`;
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full cursor-pointer"
      onClick={handleLogin}
    >
      <span className="h-6">{google}</span>
      Continue with Google
    </Button>
  );
};

export default GoogleAuthButton;
