import React from 'react';
import Layout from './components/Layout';

const ChapterPreview = ({ path, site, onChange }) => {
  const chapter = site.chapters[path];
  return (
    <Layout
      children={chapter.pageOrder.map(p => site.pages[p])}
      content={chapter.content}
      parent={site}
      site={site}
      onChange={onChange}
    />
  );
};

export default ChapterPreview;
