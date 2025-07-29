'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import NProgress from 'nprogress';
// import 'nprogress/nprogress.css';
import './style.css';

NProgress.configure({ showSpinner: false, trickleSpeed: 200 });

export default function PageProgress() {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();

    // Complete after a short delay to make it feel smoother
    const timer = setTimeout(() => {
      NProgress.done();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
