import React from 'react';
import Layout from './components/Layout';

const SitePreview = ({ site, onChange }) => {
  return (
    <Layout
      children={site.chapterOrder.map(c => site.chapters[c])}
      content={site.content}
      site={site}
      onChange={onChange}
    />
  );
};

export default SitePreview;
