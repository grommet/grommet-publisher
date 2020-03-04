export const apiUrl =
  'https://us-central1-grommet-designer.cloudfunctions.net/sites';

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
  theme: 'https://theme-designer.grommet.io/?id=HPE-1-eric-soderberg-hpe-com',
};

export const pageChapter = (site, pagePath) =>
  Object.keys(site.chapters)
    .map(p => site.chapters[p])
    .filter(chapter => chapter.pageOrder.includes(pagePath))[0];

const svgPrefix = 'data:image/svg+xml;utf8,';

export const normalizeImageSrc = src =>
  src.slice(0, 4) === '<svg' ? `${svgPrefix}${src}` : src;

export const slugify = str =>
  `/${str
    .toLocaleLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')}`;

export const changeChapterPath = (site, oldPath, newPath) => {
  site.chapters[newPath] = site.chapters[oldPath];
  site.chapters[newPath].path = newPath;
  delete site.chapters[oldPath];
  const index = site.chapterOrder.indexOf(oldPath);
  site.chapterOrder[index] = newPath;
  site.alias = { from: oldPath, to: newPath };
};

export const changePagePath = (site, oldPath, newPath) => {
  const chapter = pageChapter(site, oldPath);
  site.pages[newPath] = site.pages[oldPath];
  site.pages[newPath].path = newPath;
  delete site.pages[oldPath];
  const index = site.chapters[chapter.path].pageOrder.indexOf(oldPath);
  site.chapters[chapter.path].pageOrder[index] = newPath;
  site.alias = { from: oldPath, to: newPath };
};

export const upgradeSite = site => {
  // don't let a chapter or page have a path of '/'
  const chapterPaths = Object.keys(site.chapters);
  chapterPaths
    .filter(p => p === '/')
    .forEach(p => {
      const nextPath = slugify(site.chapters[p].name);
      changeChapterPath(site, p, nextPath);
    });
  const pagePaths = Object.keys(site.pages);
  pagePaths
    .filter(p => p === '/')
    .forEach(p => {
      const nextPath = slugify(site.pages[p].name);
      changePagePath(site, p, nextPath);
    });
  return site;
};
