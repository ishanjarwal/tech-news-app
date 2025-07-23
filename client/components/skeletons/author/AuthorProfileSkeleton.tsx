import { Skeleton } from '@/components/ui/skeleton';

const AuthorProfileSkeleton = () => {
  return (
    <div>
      <Skeleton className="aspect-[3] rounded-lg" />
      <div className="mt-8 mb-4 flex items-center space-x-6">
        <Skeleton className="aspect-square h-24 rounded-full sm:h-32" />
        <div className="w-full">
          <Skeleton className="mb-4 h-5 w-[25%] rounded-sm" />
          <Skeleton className="mb-2 h-4 w-[100%] rounded-sm" />
          <Skeleton className="h-4 w-[75%] rounded-sm" />
        </div>
      </div>
    </div>
  );
};

export default AuthorProfileSkeleton;
