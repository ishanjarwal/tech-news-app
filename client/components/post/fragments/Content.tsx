import React from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.min.css'; // or any theme you like
import '../styles/PostStyle.css';
import * as cheerio from 'cheerio';

const Content = ({ rawHtml }: { rawHtml: string }) => {
  const $ = cheerio.load(rawHtml); // Load raw HTML

  // Highlight all code blocks
  $('pre code').each((_, element) => {
    const codeElement = $(element);
    const codeText = codeElement.text(); // Get raw code
    const highlighted = hljs.highlightAuto(codeText).value;
    codeElement.html(highlighted);
  });

  // Wrap all <table> elements in <div class="overflow-auto">
  $('table').each((_, table) => {
    const tableElement = $(table);

    // Check if it's already wrapped (avoid double-wrapping)
    if (!tableElement.parent().is('div.overflow-auto')) {
      const wrapper = $('<div></div>').addClass('overflow-auto');
      tableElement.wrap(wrapper);
    }
  });

  const formatted = $.html();

  return (
    <article
      className="rendered_post"
      dangerouslySetInnerHTML={{ __html: formatted }}
    />
  );
};

export default Content;
