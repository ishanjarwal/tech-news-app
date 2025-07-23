import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function page() {
  return (
    <>
      <main className="grid min-h-full place-items-center px-6 py-32 sm:py-48 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold">500</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
            Unexpected Error
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty sm:text-xl/8">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild>
              <Link href={'/'}>Go to Home</Link>
            </Button>
            <a
              href="mailto:support@technewz.com"
              className="text-sm font-semibold"
            >
              Contact support <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
