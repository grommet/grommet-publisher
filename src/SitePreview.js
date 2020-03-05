import React from 'react';
import { Box } from 'grommet';
import Header from './components/Header';
import Footer from './components/Footer';
import Content from './components/Content';
import Cards from './components/Cards';

const SitePreview = ({ site, onChange }) => {
  const overlay = site.content.slice(0, 8) === '<Section';
  return (
    <Box flex="grow" style={{ position: 'relative' }}>
      <Header site={site} overlay={overlay} />
      <Box flex="grow" margin={overlay ? undefined : { horizontal: 'large' }}>
        <Content size={site.size} fill={overlay}>
          {site.content}
        </Content>
        {site.navMode === 'cards' && (
          <Cards
            routes={site.chapterOrder.map(c => site.chapters[c])}
            size={site.size}
            overlay={overlay}
          />
        )}
      </Box>
      <Footer site={site} overlay={overlay} onChange={onChange} />
    </Box>
  );
};

export default SitePreview;
