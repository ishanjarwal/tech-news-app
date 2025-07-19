// components/BlogBreadcrumb.tsx
import { Home } from 'lucide-react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export interface BreadcrumbProps {
  category: {
    name: string;
    slug: string;
  };
  subCategory?: {
    name: string;
    slug: string;
  };
  title: string;
}

export function Breadcrumbs({ category, subCategory, title }: BreadcrumbProps) {
  return (
    <Breadcrumb className="text-muted-foreground truncate text-sm">
      <BreadcrumbList className="flex-nowrap">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">
              <Home className="h-4 w-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink
            className="max-w-[8rem] truncate"
            href={`/category/${category.slug}`}
          >
            {category.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
        {subCategory && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                className="max-w-[8rem] truncate"
                href={`/category/${category.slug}/${subCategory.slug}`}
              >
                {subCategory.name}
              </BreadcrumbLink>{' '}
            </BreadcrumbItem>
          </>
        )}
        <BreadcrumbSeparator />
        <BreadcrumbItem className="truncate">
          <BreadcrumbPage className="max-w-full truncate overflow-hidden text-ellipsis whitespace-nowrap">
            {title}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
