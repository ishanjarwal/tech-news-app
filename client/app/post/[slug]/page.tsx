import SidebarAdvertisement from '@/components/advertisements/SidebarAdvertisement';
import AuthorProfile from '@/components/post/author_profile/AuthorProfile';
import { Author } from '@/components/post/fragments/Author';
import { Breadcrumbs } from '@/components/post/fragments/Breadcrumbs';
import Content from '@/components/post/fragments/Content';
import { Contents } from '@/components/post/fragments/Contents';
import EditButton from '@/components/post/fragments/EditButton';
import { Heading } from '@/components/post/fragments/Heading';
import { Share } from '@/components/post/fragments/Share';
import { Summary } from '@/components/post/fragments/Summary';
import { Thumbnail } from '@/components/post/fragments/Thumbnail';
import PopularTopics from '@/components/post/popular_topics/PopularTopics';
import RecentPosts from '@/components/post/recent_posts/RecentPosts';
import { env } from '@/config/env';
import { addIdsForContents } from '@/utils/addIdsForContents';
import axios from 'axios';
import { redirect } from 'next/navigation';

interface PageProps {
  params: {
    slug: string;
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
              <div className="flex items-start justify-between">
                <Author
                  avatarUrl={author.avatar}
                  fullname={author.fullname}
                  username={author.username}
                  date={updatedAt}
                />
                <div className="flex items-center space-x-1 sm:space-x-2">
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
          </div>
        </div>
        <div className="col-span-6 flex flex-col space-y-16 lg:col-span-2">
          <AuthorProfile author={author} />
          <RecentPosts />
          <PopularTopics />
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
