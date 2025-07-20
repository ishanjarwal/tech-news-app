import type { Config } from 'dompurify';
import DOMPurify from 'dompurify';
// import 'highlight.js/styles/github.css'; // or any theme you like

const ALLOWED_TAGS = [
  'p',
  'h1',
  'h2',
  'h3',
  'a',
  'img',
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td',
  'b',
  'strong',
  'i',
  'em',
  'u',
  's',
  'strike',
  'blockquote',
  'pre',
  'code',
  'ul',
  'ol',
  'li',
];

const ALLOWED_ATTR = {
  a: ['href'],
  img: ['src', 'alt'],
} as unknown as Config['ALLOWED_ATTR'];

// Extend DOMPurify to add target="_blank" to all <a> tags
DOMPurify.addHook('afterSanitizeAttributes', function (node) {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

// Function to sanitize HTML
export function sanitizeHtml(htmlString: string) {
  const cleanHtml = DOMPurify.sanitize(htmlString, {
    ALLOWED_TAGS: ALLOWED_TAGS,
    ALLOWED_ATTR: ALLOWED_ATTR,
    FORBID_ATTR: ['style', 'class', 'id'],
    FORBID_TAGS: ['style', 'script'],
    USE_PROFILES: { html: true },
  });
  return cleanHtml;
}
