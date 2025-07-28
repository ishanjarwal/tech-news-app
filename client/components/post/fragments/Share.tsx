'use client';

import {
  facebook,
  instagram,
  linkedin,
  threads,
  whatsapp,
  x,
} from '@/assets/icons/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { env } from '@/config/env';
import { Copy, Mail, Share2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast'; // Optional: replace with your toast library

interface ShareProps {
  message?: string;
}

export function Share({ message = 'Check this out!' }: ShareProps) {
  const pathname = usePathname();

  const encodedUrl = encodeURIComponent(
    `${env.NEXT_PUBLIC_CLIENT_URL + pathname}`
  );
  const encodedTitle = encodeURIComponent(message);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.toString());
      toast.success('Link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="cursor-pointer !px-2">
          <Share2 />
          <span className="hidden sm:block">Share</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="me-4 w-56">
        <DropdownMenuLabel>Share this post</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Button
              className="w-full cursor-pointer justify-start"
              variant="ghost"
              onClick={() =>
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
                  '_blank'
                )
              }
            >
              <span className="w-8">{facebook}</span>
              <span>Facebook</span>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button
              className="w-full cursor-pointer justify-start"
              variant="ghost"
              onClick={() =>
                window.open(
                  `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
                  '_blank'
                )
              }
            >
              <span className="w-8">{x}</span>
              <span>X</span>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button
              className="w-full cursor-pointer justify-start"
              variant="ghost"
              onClick={() => {
                window.open(
                  `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
                  '_blank'
                );
              }}
            >
              <span className="w-8">{linkedin}</span>
              <span>Linkedin</span>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button
              className="w-full cursor-pointer justify-start"
              variant="ghost"
              onClick={() =>
                window.open(
                  `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
                  '_blank'
                )
              }
            >
              <span className="w-8">{whatsapp}</span>
              <span>Whatsapp</span>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button
              className="w-full cursor-pointer justify-start"
              variant="ghost"
              onClick={() =>
                window.open(
                  `https://www.threads.net/intent/post?text=${encodedTitle}%20${encodedUrl}`,
                  '_blank'
                )
              }
            >
              <span className="w-8">{threads}</span>
              <span>Threads</span>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button
              className="w-full cursor-pointer justify-start"
              variant="ghost"
              onClick={copyToClipboard}
            >
              <Copy className="size-6" />
              <span>Copy Link</span>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button
              className="w-full cursor-pointer justify-start"
              variant="ghost"
              onClick={() =>
                window.open(
                  `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
                  '_blank'
                )
              }
            >
              <Mail className="size-6" />
              <span>Mail</span>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
