import { CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import Image from 'next/image';

const content = {
  heading: 'Subscribe to the Newsletter',
  description:
    'Never miss an important update. Get the latest tech trends, product launches, developer insights, and industry news delivered straight to your inbox, once a week, no spam',
  highlights: [
    'Handpicked by experts.',
    'Summarized in under 5 minutes',
    'Only what matters to you',
  ],
};

const NewsletterBanner = () => {
  const { heading, description, highlights } = content;
  return (
    <section className="px-2">
      <div className="container">
        <div className="bg-card flex w-full flex-col gap-16 overflow-hidden rounded-lg p-8 md:rounded-xl lg:flex-row lg:items-center lg:p-12">
          <div className="flex-1">
            <h3 className="mb-3 text-2xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
              {heading}
            </h3>
            <p className="text-muted-foreground mb-8 max-w-xl lg:text-lg">
              {description}
            </p>
            <ul className="mb-8">
              {highlights.map((highlight: string) => (
                <li className="flex items-center justify-start space-x-2">
                  <CheckCircle2 className="size-6 text-green-400/75" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col items-center gap-2 lg:flex-row">
              <Input placeholder="Your Email" className="flex-1" />
              <Button size="lg" className="w-full lg:w-auto">
                Subscribe
              </Button>
            </div>
          </div>
          <div className="hidden flex-1 xl:block">
            <Image
              src={
                'https://images.pexels.com/photos/123335/pexels-photo-123335.jpeg'
              }
              className="w-full rounded-lg"
              width={400}
              height={400}
              alt="newsletter-banner"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterBanner;
