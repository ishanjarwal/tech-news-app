import * as cheerio from 'cheerio';
import slugify from 'slugify';

type HeadingInfo = {
  title: string;
  slug: string;
};

export function addIdsForContents(html: string): {
  modifiedHtml: string;
  headings: HeadingInfo[];
} {
  const $ = cheerio.load(html);
  const headings: HeadingInfo[] = [];

  $('h1').each((_, el) => {
    const title = $(el).text().trim();
    const slug = slugify(title, { lower: true, strict: true });

    $(el).attr('id', slug); // Inject the slug as ID

    headings.push({ title, slug });
  });

  const modifiedHtml = $.html();

  return { modifiedHtml, headings };
}
