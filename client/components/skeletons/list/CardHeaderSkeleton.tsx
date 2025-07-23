import { Skeleton } from '@/components/ui/skeleton';

const CardHeaderSkeleton = () => {
  return (
    <div className="flex space-x-4 pt-16 pb-8">
      <Skeleton className="aspect-square h-24 rounded-md" />
      <div className="w-full">
        <Skeleton className="mt-1 mb-4 h-6 w-[25%] rounded-sm" />
        <Skeleton className="mb-2 h-4 w-full rounded-sm" />
        <Skeleton className="h-4 w-[80%] rounded-sm" />
      </div>
    </div>
  );
};

export default CardHeaderSkeleton;
