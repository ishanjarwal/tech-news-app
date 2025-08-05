import { env } from '@/config/env';
import axios from 'axios';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import PageContent from './PageContent';
import PostPageSkeleton from '@/components/skeletons/post/PostPageSkeleton';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const response = await axios.get(
    `${env.NEXT_PUBLIC_BASE_URL}/post/metadata/${slug}`
  );

  if (response.status !== 200) {
    return redirect('/error');
  }

  const data = response.data.data;
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
  const { slug } = await params;
  return (
    <Suspense fallback={<PostPageSkeleton />}>
      <PageContent slug={slug} />
    </Suspense>
  );
};

export default page;
