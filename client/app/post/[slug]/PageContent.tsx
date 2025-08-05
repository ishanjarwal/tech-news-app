import SidebarAdvertisement from '@/components/advertisements/SidebarAdvertisement';
import AuthorProfile from '@/components/post/author_profile/AuthorProfile';
import { Author } from '@/components/post/fragments/Author';
import { Breadcrumbs } from '@/components/post/fragments/Breadcrumbs';
import CommentButton from '@/components/post/fragments/CommentButton';
import Comments from '@/components/post/fragments/Comments';
import Content from '@/components/post/fragments/Content';
import { Contents } from '@/components/post/fragments/Contents';
import Date from '@/components/post/fragments/Date';
import EditButton from '@/components/post/fragments/EditButton';
import { Heading } from '@/components/post/fragments/Heading';
import LikeButton from '@/components/post/fragments/LikeButton';
import ReadTime from '@/components/post/fragments/ReadTime';
import { Share } from '@/components/post/fragments/Share';
import { Summary } from '@/components/post/fragments/Summary';
import Tags from '@/components/post/fragments/Tags';
import { Thumbnail } from '@/components/post/fragments/Thumbnail';
import PopularTopics from '@/components/post/popular_topics/PopularTopics';
import TrendingPosts from '@/components/post/recent_posts/TrendingPosts';
import PopularTagsSkeleton from '@/components/skeletons/post/PopularTagsSkeleton';
import TrendingPostsSkeleton from '@/components/skeletons/TrendingPostsSkeleton';
import { Button } from '@/components/ui/button';
import { env } from '@/config/env';
import { formatNumberShort } from '@/lib/utils';
import { addIdsForContents } from '@/utils/addIdsForContents';
import { Dot, Eye } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

const fetchPageContent = async (slug: string) => {
  try {
    const url = `${env.NEXT_PUBLIC_BASE_URL}/post/${slug}`;
    const response = await fetch(url, {
      next: { revalidate: 600 }, // 10 mins
    });

    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error('Fetch error:', error);
    return redirect('/error');
  }
};

const PageContent = async ({ slug }: { slug: string }) => {
  const post = await fetchPageContent(slug);

  const category = { name: post.category.name, slug: post.category.slug };
  const subCategory = post?.subCategory
    ? { name: post.subCategory.name, slug: post.subCategory.slug }
    : undefined;
  const title = post.title;
  const author = {
    id: post.author._id,
    fullname: post.author.fullname,
    username: post.author.username,
    avatar: post.author?.avatar ?? undefined,
    cover_image: post.author?.cover_image ?? undefined,
    bio: post.author?.bio ?? undefined,
    joined: post.author.joined,
  };
  const updatedAt = post.updated_at;
  const summary = post.summary;
  const thumbnail = post?.thumbnail ?? undefined;
  const tags = post?.tags.map((el: any) => ({
    slug: el.slug,
    name: el.name,
  }));

  const { modifiedHtml: formatted, headings } = addIdsForContents(post.content);

  const reading_time_sec = post.reading_time_sec;

  return (
    <div className="grid grid-cols-6 gap-y-24 px-2 py-4 sm:px-4 sm:py-16 md:py-24 lg:gap-x-32 lg:gap-y-0">
      <div className="col-span-6 lg:col-span-4">
        <div>
          <div className="flex flex-col space-y-8">
            <Breadcrumbs
              category={category}
              subCategory={subCategory}
              title={title}
            />
            <Heading title={title} />
            <div className="flex items-center justify-start space-x-1">
              <Date date={updatedAt} />
              <Dot />
              <ReadTime reading_time_sec={reading_time_sec} />
            </div>
            <div className="bg-background sticky top-0 z-[1] flex items-start justify-between py-2">
              <Author
                avatarUrl={author.avatar}
                fullname={author.fullname}
                username={author.username}
              />
              <div className="flex items-center space-x-[2px] sm:space-x-2">
                <Button
                  variant={'ghost'}
                  className="cursor-pointer flex-col gap-0 px-2"
                >
                  <span>{<Eye />}</span>
                  <span className="text-[8px] sm:!text-[10px]">
                    {formatNumberShort(post.totalViews)}
                  </span>
                </Button>
                <LikeButton
                  id={post._id}
                  author_username={author.username}
                  like_count={post.totalLikes}
                />
                <CommentButton comments_count={post.totalComments} />
                <EditButton
                  author_username={author.username}
                  post_id={post._id}
                />
                <Share message={title} />
              </div>
            </div>
            <Thumbnail src={thumbnail} alt={slug} />
            <Tags tags={tags} />
            <Summary summary={summary} />
            <Contents tocItems={headings} />
            <Content rawHtml={formatted} />
          </div>
          <Comments id={post._id} comments_count={post.totalComments} />
        </div>
      </div>
      <div className="col-span-6 flex flex-col space-y-16 lg:col-span-2">
        <AuthorProfile author={author} />
        <Suspense fallback={<TrendingPostsSkeleton />}>
          <TrendingPosts />
        </Suspense>
        <Suspense fallback={<PopularTagsSkeleton />}>
          <PopularTopics />
        </Suspense>
        <div className="sticky top-12">
          <SidebarAdvertisement />
        </div>
      </div>
    </div>
  );
};

export default PageContent;
