import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export interface ContentsProps {
  tocItems: {
    title: string;
    slug: string;
  }[];
}

export function Contents({ tocItems }: ContentsProps) {
  if (tocItems.length === 0) return null;

  return (
    <Accordion
      defaultValue="toc"
      type="single"
      collapsible
      className="bg-accent w-full overflow-hidden rounded-lg shadow-md"
    >
      <AccordionItem value="toc">
        <AccordionTrigger className="border-border hover:bg-popover cursor-pointer rounded-none px-8 hover:no-underline data-[state=open]:border-b">
          Table of Contents
        </AccordionTrigger>
        <AccordionContent className="px-8 py-4">
          <ul className="space-y-2 pl-5">
            {tocItems.map((item) => (
              <li key={item.slug} className="group relative text-blue-500">
                <span className="absolute top-1/2 -left-5 -translate-y-1/2 duration-75 group-hover:translate-x-1">
                  <ArrowRight className="text-accent-foreground size-4" />
                </span>
                <Link href={`#${item.slug}`} className="hover:underline">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
