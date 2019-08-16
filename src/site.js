
export const apiUrl = 'https://us-central1-grommet-designer.cloudfunctions.net/sites';

export const starter = {
  name: 'My Site',
  content: '# My Site',
  chapterOrder: ['/welcome', '/about'],
  chapters: {
    '/welcome': {
      name: 'welcome',
      path: '/welcome',
      pageOrder: ['/join', '/explore'],
      content: '# Welcome',
    },
    '/about': {
      name: 'about',
      path: '/about',
      pageOrder: ['/contact', '/legal'],
      content: '# About',
    },
  },
  pages: {
    '/contact': {
      name: 'contact',
      path: '/contact',
      content: '# Contact',
    },
    '/join': {
      name: 'join',
      path: '/join',
      content: '# Join',
    },
    '/explore': {
      name: 'explore',
      path: '/explore',
      content: '# Explore',
    },
    '/legal': {
      name: 'legal',
      path: '/legal',
      content: '# Legal',
    },
  },
  theme: 'https://theme-designer.grommet.io/?id=HPE-eric-soderberg-hpe-com',
}

export const pageChapter = (site, pagePath) =>
  Object.keys(site.chapters).map(p => site.chapters[p])
    .filter(chapter => chapter.pageOrder.includes(pagePath))[0];

const svgPrefix = 'data:image/svg+xml;utf8,';

export const normalizeImageSrc = (src) =>
  src.slice(0, 4) === '<svg' ? `${svgPrefix}${src}` : src

export const upgradeSite = (site) => {
  return site; // nothing to upgrade yet.
}
