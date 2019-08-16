import React from 'react';
import { Box } from 'grommet';
import Header from './components/Header';
import Footer from './components/Footer';
import Content from './components/Content';

const SitePreview = ({ site }) => {
  const overlay = site.content.slice(0, 8) === '<Section';
  return (
    <Box flex="grow" style={{ position: 'relative' }}>
      <Header site={site} overlay={overlay} />
      <Box margin={overlay ? undefined : { horizontal: 'large' }}>
        <Content fill={overlay}>{site.content}</Content>
      </Box>
      <Footer site={site} overlay={overlay} />
    </Box>
  );
}

export default SitePreview;
