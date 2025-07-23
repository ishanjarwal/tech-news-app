import {
  facebook,
  github,
  instagram,
  linkedin,
  threads,
  x,
  youtube,
} from '@/assets/icons/icons';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { env } from '@/config/env';
import { formatNumberShort } from '@/lib/utils';
import axios from 'axios';
import { format } from 'date-fns';
import { BadgeCheck, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const fetchAuthor = async (username: string) => {
  try {
    const url = `${env.NEXT_PUBLIC_BASE_URL}/user/author/${username}`;
    const response = await axios.get(url);
    return response.data.data;
  } catch (error) {
    return redirect('/error');
  }
};

const AuthorDetails = async ({ username }: { username: string }) => {
  const author = await fetchAuthor(username);

  return (
    <div>
      <div className="bg-card overflow-hidden sm:rounded-lg">
        <AspectRatio ratio={3} className="w-full">
          <Image
            src={author.cover_image || '/images/banner-placeholder.jpg'}
            fill
            alt="Author cover image"
            className="object-cover object-center"
          />
        </AspectRatio>
        <div className="relative">
          <Avatar className="absolute left-[3%] size-24 -translate-y-1/2 sm:left-[5%] sm:size-32 lg:size-48 xl:size-64">
            <AvatarImage
              src={author.avatar || '/images/profile-placeholder.png'}
              className="object-cover object-center"
              alt="Author Profile"
            />
          </Avatar>
        </div>
        <div className="flex items-center justify-between ps-32 pe-2 pt-1 sm:ps-48 sm:pt-2 lg:ps-64 xl:ps-96 xl:pt-4">
          <div>
            <p className="flex items-center space-x-1 text-base font-semibold lg:text-xl xl:text-3xl">
              <span>{author.fullname}</span>
              <BadgeCheck className="text-background fill-yellow-300 shadow-xs text-shadow-amber-300 text-shadow-md" />
            </p>
            <p className="text-muted-foreground text-xs sm:text-sm lg:text-base xl:text-lg">
              @{author.username}
            </p>
          </div>
        </div>
        <div className="px-4 pt-4 sm:ps-48 sm:pt-2 lg:ps-64 xl:ps-96 xl:pt-4">
          <div className="bg-accent flex max-w-lg items-center justify-evenly space-x-8 rounded-md p-4">
            <div className="flex flex-col items-center justify-center space-y-1">
              <p className="text-muted-foreground text-sm sm:text-lg">Posts</p>
              <p className="text-sm font-bold sm:text-lg">
                {formatNumberShort(author.totalPosts)}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-1">
              <p className="text-muted-foreground text-sm sm:text-lg">Likes</p>
              <p className="text-sm font-bold sm:text-lg">
                {formatNumberShort(author.totalLikes)}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-1">
              <p className="text-muted-foreground text-sm sm:text-lg">
                Followers
              </p>
              <p className="text-sm font-bold sm:text-lg">
                {formatNumberShort(author.totalFollowers)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-6 p-8 pt-8 sm:pt-16 lg:flex-row lg:items-start lg:justify-between lg:space-y-0 lg:space-x-2 lg:pt-24">
          <div className="flex flex-col space-y-6">
            {author.bio && (
              <div>
                <p className="text-muted-foreground text-xs sm:text-base">
                  About
                </p>
                <p className="text-base sm:text-lg">{author.bio}</p>
              </div>
            )}
            <div>
              <p className="text-muted-foreground text-xs sm:text-base">
                Joined
              </p>
              <p className="text-base sm:text-lg">
                {format(new Date(author.created_at), 'PPP')}{' '}
              </p>
            </div>
          </div>
          {author.socialLinks && (
            <div>
              <p className="text-muted-foreground text-xs sm:text-base">
                Profiles
              </p>
              <div className="flex items-center space-x-1">
                {author.socialLinks.instagram && (
                  <Link href={author.socialLinks.instagram} className="size-8">
                    {instagram}
                  </Link>
                )}
                {author.socialLinks.linkedin && (
                  <Link href={author.socialLinks.linkedin} className="size-8">
                    {linkedin}
                  </Link>
                )}
                {author.socialLinks.x && (
                  <Link href={author.socialLinks.x} className="size-8">
                    {x}
                  </Link>
                )}
                {author.socialLinks.github && (
                  <Link href={author.socialLinks.github} className="size-8">
                    {github}
                  </Link>
                )}
                {author.socialLinks.youtube && (
                  <Link href={author.socialLinks.youtube} className="size-8">
                    {youtube}
                  </Link>
                )}
                {author.socialLinks.facebook && (
                  <Link href={author.socialLinks.facebook} className="size-8">
                    {facebook}
                  </Link>
                )}
                {author.socialLinks.threads && (
                  <Link href={author.socialLinks.threads} className="size-8">
                    {threads}
                  </Link>
                )}
                {author.socialLinks.websites &&
                  author.socialLinks.websites.map(
                    (website: string, index: number) => (
                      <Link href={website} key={'author-website-' + index}>
                        <Globe className="size-6" />
                      </Link>
                    )
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorDetails;
