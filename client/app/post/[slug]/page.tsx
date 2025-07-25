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
import { Share } from '@/components/post/fragments/Share';
import { Summary } from '@/components/post/fragments/Summary';
import { Thumbnail } from '@/components/post/fragments/Thumbnail';
import PopularTopics from '@/components/post/popular_topics/PopularTopics';
import TrendingPosts from '@/components/post/recent_posts/TrendingPosts';
import PopularTagsSkeleton from '@/components/skeletons/post/PopularTagsSkeleton';
import TrendingPostsSkeleton from '@/components/skeletons/TrendingPostsSkeleton';
import { env } from '@/config/env';
import { addIdsForContents } from '@/utils/addIdsForContents';
import axios from 'axios';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Metadata } from 'next';
import ReadTime from '@/components/post/fragments/ReadTime';
import { Dot } from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slug = params.slug;
  const response = await axios.get(
    `${env.NEXT_PUBLIC_BASE_URL}/post/metadata/${slug}`
  );

  if (response.status !== 200) {
    return redirect('/error');
  }

  const data = response.data.data;
  console.log(data);
  const { metaTitle, metaDescription, metaImage, metaTags } = data;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaTags,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: metaImage,
          alt: metaTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
    },
  };
}

const page = async ({ params }: PageProps) => {
  try {
    const { slug } = params;

    const url = `${env.NEXT_PUBLIC_BASE_URL}/post/${slug}`;
    const response = await axios.get(url);
    const post = response.data.data;

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

    const { modifiedHtml: formatted, headings } = addIdsForContents(
      post.content
    );

    const reading_time_sec = post.reading_time_sec;

    return (
      <div className="grid grid-cols-6 gap-y-24 px-2 py-4 sm:px-4 sm:py-16 md:py-24 lg:gap-x-32 lg:gap-y-0">
        <div className="col-span-6 lg:col-span-4">
          <div>
            <Suspense fallback={<div className="text-6xl">Loading</div>}>
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
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <LikeButton
                      id={post._id}
                      author_username={author.username}
                    />
                    <CommentButton />
                    <EditButton
                      author_username={author.username}
                      post_id={post._id}
                    />
                    <Share message={title} />
                  </div>
                </div>
                <Thumbnail src={thumbnail} alt={slug} />
                <Summary summary={summary} />
                <Contents tocItems={headings} />
                <Content rawHtml={formatted} />
              </div>
            </Suspense>
            <Suspense fallback={<div>Loading. . .</div>}>
              <Comments />
            </Suspense>
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
  } catch (error) {
    console.log(error);
    redirect('/error');
  }
};

export default page;
