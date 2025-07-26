'use client';
import React, { ReactNode } from 'react';
import LayoutMasonry, { ResponsiveMasonry } from 'react-responsive-masonry';

const Masonry = ({
  children,
  breakpoints = { 0: 1, 750: 2, 1200: 3 },
  gutters = { 0: '16px', 900: '24', 1200: '32px' },
}: {
  children: ReactNode;
  breakpoints?: Record<number, number>;
  gutters?: Record<number, string>;
}) => {
  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={breakpoints}
      // @ts-ignore
      gutterBreakPoints={gutters}
    >
      <LayoutMasonry>{children}</LayoutMasonry>
    </ResponsiveMasonry>
  );
};

export default Masonry;
