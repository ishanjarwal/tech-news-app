import { Node, mergeAttributes } from '@tiptap/core';

const YoutubeExtension = Node.create({
  name: 'youtubeEmbed',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'iframe[src*="youtube.com"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'iframe',
      mergeAttributes(HTMLAttributes, {
        allowfullscreen: 'true',
      }),
    ];
  },
});

export default YoutubeExtension;
