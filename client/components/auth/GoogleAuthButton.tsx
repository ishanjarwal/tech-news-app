import React from 'react';
import { Button } from '../ui/button';
import { google } from '@/assets/icons/icons';

const GoogleAuthButton = () => {
  return (
    <Button variant="outline" className="w-full cursor-pointer">
      <span className="h-6">{google}</span>
      Continue with Google
    </Button>
  );
};

export default GoogleAuthButton;
