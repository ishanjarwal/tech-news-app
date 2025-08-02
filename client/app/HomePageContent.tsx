import MinimalCard from '@/components/post_card/MinimalCard';
import { Button } from '@/components/ui/button';
import { env } from '@/config/env';
import { MinimalCardProps } from '@/types/types';
import axios from 'axios';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import CategoryPosts from '@/components/homepage/CategoryPosts';
import Masonry from '@/components/masonry/Masonry';
import NewsletterBanner from '@/components/homepage/NewsletterBanner';

const fetchHomepage = async () => {
  try {
    const url = `${env.NEXT_PUBLIC_BASE_URL}/homepage`;
    const response = await axios.get(url);
    return response.data.data;
  } catch (error) {
    return redirect('/error');
  }
};

const HomePageContent = async () => {
  const data = await fetchHomepage();
  const trendingPosts = data.trendingPosts.map((el: any) => ({
    title: el.title,
    slug: el.slug,
    category: { name: el.category.name, slug: el.category.slug },
    author: {
      fullname: el.author.fullname,
      username: el.author.username,
      avatar: el.author?.avatar ?? undefined,
    },
    thumbnail: el?.thumbnail ?? undefined,
    created_at: el.created_at,
  }));
  const topTags = data.topTags.map((el: any) => ({
    name: el.name,
    slug: el.slug,
  }));

  const categoryPosts = data.categoryPosts.map((el: any) => ({
    category: { name: el.category.name, slug: el.category.slug },
    posts: el.posts.map((post: any) => ({
      title: post.title,
      slug: post.slug,
      created_at: post.created_at,
      thumbnail: post?.thumbnail,
    })),
  }));

  const recentPosts = data.recentPosts.map((el: any) => ({
    title: el.title,
    slug: el.slug,
    category: { name: el.category.name, slug: el.category.slug },
    author: {
      fullname: el.author.fullname,
      username: el.author.username,
      avatar: el.author?.avatar ?? undefined,
    },
    thumbnail: el?.thumbnail ?? undefined,
    created_at: el.created_at,
  }));

  return (
    <div className="flex flex-col space-y-24 py-8 md:space-y-32 md:py-16">
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <TopPosts posts={trendingPosts} />
      <Topics topics={topTags} />
      <NewsletterBanner />
      <div className="px-2 sm:px-0">
        <h2 className="mb-4 border-b pb-4 text-3xl font-semibold sm:mb-8 sm:pb-8 lg:text-4xl">
          📋 Posts by Category
        </h2>
        <CategoryPosts categoryPosts={categoryPosts} />
      </div>
      <RecentPosts posts={recentPosts} />
    </div>
  );
};

const TopPosts = ({ posts }: { posts: MinimalCardProps['post'][] }) => {
  return (
    <div className="px-2 md:px-0">
      <h2 className="mb-4 border-b pb-4 text-3xl font-semibold sm:mb-8 sm:pb-8 lg:text-4xl">
        🔥Top Stories
      </h2>
      <div>
        <Masonry>
          {posts.map((post: MinimalCardProps['post'], index: number) => (
            <div key={'top-post-' + post.slug} className="relative w-full">
              <span className="bg-accent text-foreground absolute top-0 right-0 z-[1] rounded-tr-md rounded-bl-md px-3 py-2">
                #{index + 1}
              </span>
              <MinimalCard post={post} />
            </div>
          ))}
        </Masonry>
      </div>
    </div>
  );
};

const Topics = ({ topics }: { topics: { name: string; slug: string }[] }) => {
  return (
    <div className="px-2 md:px-0">
      <h2 className="mb-4 border-b pb-4 text-3xl font-semibold sm:mb-8 sm:pb-8 lg:text-4xl">
        #️Trending Topics
      </h2>
      <div className="hidden flex-wrap gap-2 lg:flex">
        {topics.map((tag: { name: string; slug: string }, index: number) => (
          <Button key={'topic-button' + tag.slug} asChild variant={'secondary'}>
            <Link href={`/tag/${tag.slug}`}># {tag.name}</Link>
          </Button>
        ))}
      </div>

      <div className="relative lg:hidden">
        <Carousel
          opts={{
            dragFree: true,
          }}
        >
          <CarouselContent className="mx-8">
            {topics.map(
              (tag: { name: string; slug: string }, index: number) => (
                <CarouselItem
                  key={'topic-' + tag.slug}
                  className="basis-auto pl-2"
                >
                  <Button asChild variant={'secondary'}>
                    <Link href={`/tag/${tag.slug}`}># {tag.name}</Link>
                  </Button>
                </CarouselItem>
              )
            )}
          </CarouselContent>
          <div className="from-background absolute top-1/2 left-0 -translate-y-1/2 bg-gradient-to-r to-transparent py-2 pe-4">
            <CarouselPrevious
              variant={'ghost'}
              className="static translate-y-0 cursor-pointer"
            />
          </div>
          <div className="from-background absolute top-1/2 right-0 -translate-y-1/2 bg-gradient-to-l to-transparent py-2 ps-4">
            <CarouselNext
              variant={'ghost'}
              className="static translate-y-0 cursor-pointer"
            />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

const RecentPosts = ({ posts }: { posts: MinimalCardProps['post'][] }) => {
  return (
    <div className="px-2 md:px-0">
      <h2 className="mb-4 border-b pb-4 text-3xl font-semibold sm:mb-8 sm:pb-8 lg:text-4xl">
        Recently
      </h2>
      <div>
        <Masonry>
          {posts.map((post: MinimalCardProps['post'], index: number) => (
            <div key={'recent-post-' + post.slug} className="w-full">
              <MinimalCard post={post} />
            </div>
          ))}
        </Masonry>
      </div>
    </div>
  );
};

export default HomePageContent;
