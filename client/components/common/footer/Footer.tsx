'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { footer_content, logo } from '@/constants/constants';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import Logo from '../Logo';

const Footer = () => {
  const {
    tagline,
    description,
    socialLinks,
    menuItems,
    bottomLinks,
    copyright,
    newsletter,
  } = footer_content;
  return (
    <section className="px-2 py-16 sm:px-4 lg:py-32">
      <div className="">
        <footer>
          <div className="grid grid-cols-2 gap-12 lg:grid-cols-7">
            <div className="col-span-2 mb-8 lg:mb-0">
              <div className="flex items-center gap-2 lg:justify-start">
                <Link href="/">
                  <Logo className="max-h-8" />
                </Link>
                <p className="text-xl font-semibold">{logo.title}</p>
              </div>
              <p className="text-muted-foreground mt-4 font-semibold">
                {tagline}
              </p>
              <p className="text-muted-foreground mt-4 text-sm">
                {description}
              </p>
              <div className="mt-4">
                <h3>Find us </h3>
                <div className="flex items-center justify-start space-x-2">
                  {socialLinks.map((el) => (
                    <Link href={el.href} key={el.title} title={el.title}>
                      <span className="block w-8">{el.icon}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="text-muted-foreground space-y-4">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="hover:text-primary font-medium"
                    >
                      <a href={link.url}>{link.text}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="col-span-2 flex flex-col space-y-2">
              <h2 className="text-xl font-bold">{newsletter.title}</h2>
              <p className="text-muted-foreground text-sm text-balance">
                {newsletter.description}
              </p>
              <div className="flex w-full max-w-sm flex-col items-center gap-2 sm:flex-row">
                <div className="w-full">
                  <Input
                    className="w-full"
                    placeholder="youremail@example.com"
                  />
                </div>
                <div className="w-full flex-1">
                  <Button className="w-full cursor-pointer">Subscribe</Button>
                </div>
              </div>
            </div>
          </div>
          <div className="text-muted-foreground mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium md:flex-row md:items-center">
            <p>{copyright}</p>
            <ul className="flex gap-4">
              {bottomLinks.map((link, linkIdx) => (
                <li key={linkIdx} className="hover:text-primary underline">
                  <a href={link.url}>{link.text}</a>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Footer;
