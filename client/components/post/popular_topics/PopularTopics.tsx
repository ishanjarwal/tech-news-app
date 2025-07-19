'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

const TECH_TAGS = [
  'artificial-intelligence',
  'machine-learning',
  'web-development',
  'data-science',
  'cloud-computing',
  'cyber-security',
  'blockchain',
  'devops',
  'programming-languages',
  'mobile-development',
  'augmented-reality',
  'virtual-reality',
  'internet-of-things',
  'software-engineering',
  'game-development',
];

const TAG_COLORS = ['#fa00ff', '#00b6ff', '#0cff00', '#ffcc00'];

export function getRandomTagColor(): string {
  const index = Math.floor(Math.random() * TAG_COLORS.length);
  return TAG_COLORS[index];
}

const PopularTopics = () => {
  return (
    <div>
      <h2 className="border-foreground border-b-2 pb-2 text-2xl font-semibold uppercase">
        🔥 Popular Topics
      </h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {TECH_TAGS.map((tag) => {
          const color = getRandomTagColor();
          console.log(color);
          return (
            <Link
              href={`/tag/${tag}`}
              className="rounded-md px-3 py-2 text-sm hover:brightness-50"
              style={{ backgroundColor: color + 25, color: color }}
            >
              #{tag}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PopularTopics;
