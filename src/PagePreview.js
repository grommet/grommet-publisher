import React from 'react';
import Layout from './components/Layout';
import { pageChapter } from './site';

const PagePreview = ({ path, site, onChange }) => {
  const page = site.pages[path];
  const chapter = pageChapter(site, path);
  return (
    <Layout
      content={page.content}
      parent={chapter}
      peers={chapter.pageOrder.map(p => site.pages[p])}
      site={site}
      onChange={onChange}
    />
  );
};

export default PagePreview;
