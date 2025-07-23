import { formatReadingTime } from '@/lib/utils';

const ReadTime = ({ reading_time_sec }: { reading_time_sec: number }) => {
  return (
    <p className="text-muted-foreground text-sm font-bold">
      {formatReadingTime(reading_time_sec)}
    </p>
  );
};

export default ReadTime;
