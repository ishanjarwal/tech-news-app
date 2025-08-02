import { instagram, linkedin, x, youtube } from '@/assets/icons/icons';

export const logo = {
  url: '/',
  src_dark: '/images/logo_dark.png',
  src_light: '/images/logo_light.png',
  namelogo_src_dark: '/images/namelogo_dark.png',
  namelogo_src_light: '/images/namelogo_light.png',
  alt: 'The Binary Ping | Stay ahead in the Tech Space',
  title: 'The Binary Ping',
};

export const auth = {
  login: {
    title: 'Login',
    href: '/login',
    icon: null,
  },
  signup: {
    title: 'Sign Up',
    href: '/signup',
    icon: null,
  },
};

export const footer_content = {
  tagline: 'Stay ahead in the Tech Space.',
  description:
    'We are a community-driven platform for developers, tech enthusiasts, and innovators to discover the latest in technology, share insights, publish ideas, and grow together.',
  menuItems: [
    {
      title: 'Explore',
      links: [
        { text: 'Trending', url: '#' },
        { text: 'Popular', url: '#' },
        { text: "Editor's Picks", url: '#' },
        { text: 'Cagegories', url: '#' },
        { text: 'Tags', url: '#' },
        { text: 'Authors', url: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', url: '#' },
        { text: 'Team', url: '#' },
        { text: 'Careers', url: '#' },
        { text: 'Contact', url: '#' },
        { text: 'Privacy', url: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { text: 'Help', url: '#' },
        { text: 'Mail', url: '#' },
        { text: 'Advertise your brand', url: '#' },
      ],
    },
  ],
  socialLinks: [
    { title: 'instagram', href: '', icon: instagram },
    { title: 'youtube', href: '', icon: youtube },
    { title: 'x', href: '', icon: x },
    { title: 'linkedin', href: '', icon: linkedin },
  ],
  copyright: '© 2025 TechNews. All rights reserved.',
  bottomLinks: [
    { text: 'Terms and Conditions', url: '#' },
    { text: 'Privacy Policy', url: '#' },
  ],
  newsletter: {
    title: 'Never miss an update!',
    description:
      'Get the weekly updates in the tech world directly in you inbox without any hassle.',
  },
};
