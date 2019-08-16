import React from 'react';
import { Box, Grid, ResponsiveContext } from 'grommet';
import Header from './components/Header';
import Footer from './components/Footer';
import Content from './components/Content';
import Sidebar from './components/Sidebar';
import { pageChapter } from './site';

const PagePreview = ({ path, site, onChange }) => {
  const responsive = React.useContext(ResponsiveContext);
  const page = site.pages[path];
  const chapter = pageChapter(site, path);
  return (
    <Grid
      columns={responsive === 'small' ?
        ['flex', ['medium', 'xlarge'], 'flex'] : [
        'flex',
        ['small', 'medium'],
        ['medium', 'large'],
        'flex',
      ]}
      rows={['xsmall', 'flex', 'xxsmall']}
      areas={responsive === 'small' ? [
        { name: 'header', start: [1, 0], end: [1, 0] },
        { name: 'content', start: [1, 1], end: [1, 1] },
        { name: 'footer', start: [0, 2], end: [0, 2] },
      ] : [
        { name: 'header', start: [1, 0], end: [2, 0] },
        { name: 'sidebar', start: [1, 1], end: [1, 1] },
        { name: 'content', start: [2, 1], end: [2, 1] },
        { name: 'footer', start: [1, 2], end: [2, 2] },
      ]}
      style={{ minHeight: '100vh'}}
    >
      <Header gridArea="header" site={site} />
      {responsive !== 'small' && (
        <Sidebar gridArea="sidebar" site={site} chapter={chapter} />
      )}
      <Box gridArea="content" flex="grow">
        <Content>{page.content}</Content>
      </Box>
      <Footer gridArea="footer" site={site} onChange={onChange} />
    </Grid>
  );
}

export default PagePreview;
