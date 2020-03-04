import React from 'react';
import { Box } from 'grommet';
import Header from './components/Header';
import Footer from './components/Footer';
import Content from './components/Content';

const SitePreview = ({ site, onChange }) => {
  const overlay = site.content.slice(0, 8) === '<Section';
  return (
    <Box flex="grow" style={{ position: 'relative' }}>
      <Header site={site} overlay={overlay} />
      <Box flex="grow" margin={overlay ? undefined : { horizontal: 'large' }}>
        <Content size={site.size} fill={overlay}>
          {site.content}
        </Content>
      </Box>
      <Footer site={site} overlay={overlay} onChange={onChange} />
    </Box>
  );
};

export default SitePreview;
