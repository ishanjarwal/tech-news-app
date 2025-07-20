import Image from 'next/image';
import { format } from 'date-fns';
import { Dot } from 'lucide-react';

export interface AuthorProps {
  avatarUrl?: string;
  fullname: string;
  username: string;
}

export function Author({ avatarUrl, fullname, username }: AuthorProps) {
  return (
    <div className="flex items-start space-x-2">
      <div className="text-muted-foreground flex items-center space-x-4 text-sm">
        <Image
          src={avatarUrl ?? '/images/profile-placeholder.png'}
          alt={fullname}
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
        <div>
          <p className="text-foreground text-base font-medium">{fullname}</p>
          <p className="text-xs">@{username}</p>
        </div>
      </div>
    </div>
  );
}
