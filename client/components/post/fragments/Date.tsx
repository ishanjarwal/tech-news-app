import { format } from 'date-fns';
import React from 'react';

const Date = ({ date }: { date: Date }) => {
  return (
    <p className="text-muted-foreground text-sm font-bold">
      {format(date, 'PPP')}
    </p>
  );
};

export default Date;
