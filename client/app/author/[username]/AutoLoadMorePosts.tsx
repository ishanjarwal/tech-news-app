'use client';

import Card from '@/components/post_card/Card';
import { mapCardPost } from '@/utils/mappers';
import axios from 'axios';
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const AutoLoadMorePosts = ({
  initialUrl,
  initialPosts,
  initialPage,
}: {
  initialUrl: string;
  initialPosts: any[];
  initialPage: number;
}) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [scrollThreshold, setScrollThreshold] = useState<string>('');

  const fetchNext = async () => {
    const nextPage = page + 1;
    const url = new URL(initialUrl);
    url.searchParams.append('page', String(nextPage));
    const res = await axios.get(url.toString());
    const newPosts = res.data?.data.posts;

    if (!newPosts || newPosts.length === 0) {
      setHasMore(false);
    } else {
      setPosts((prev) => [...prev, ...newPosts]);
      setPage(nextPage);
    }
  };

  useEffect(() => {
    if (initialPosts.length == 0) {
      setHasMore(false);
      return;
    }

    const footerEl = document.querySelector('#footer');
    if (footerEl) {
      const height = footerEl.getBoundingClientRect().height;
      setScrollThreshold(height + 20 + 'px');
    }
  });

  return (
    <InfiniteScroll
      scrollThreshold={scrollThreshold}
      dataLength={posts.length}
      next={fetchNext}
      hasMore={hasMore}
      loader={
        <p className="mx-auto flex items-center justify-center py-4">
          <Loader className="animate-spin" />
        </p>
      }
      // endMessage={<p className="mt-4 text-center">No more posts</p>}
    >
      {initialPosts.length > 0 ? (
        <div className="columns-md gap-8 pb-8">
          {initialPosts.map((post: any) => (
            <div key={post.slug} className="mb-4 sm:mb-8">
              <Card post={mapCardPost(post)} />
            </div>
          ))}
          {posts.map((post: any) => (
            <div key={post.slug} className="mb-4 sm:mb-8">
              <Card post={mapCardPost(post)} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center pt-48 pb-64">
          <p className="text-center text-xl text-balance md:text-3xl">
            🙁 This author has not posted anything
          </p>
        </div>
      )}
    </InfiniteScroll>
  );
};

export default AutoLoadMorePosts;
