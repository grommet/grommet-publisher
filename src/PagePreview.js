import React from 'react';
import { Box, Grid, ResponsiveContext } from 'grommet';
import Header from './components/Header';
import Content from './components/Content';
import Sidebar from './components/Sidebar';
import { pageChapter } from './site';

const PagePreview = ({ path, site }) => {
  const responsive = React.useContext(ResponsiveContext);
  const page = site.pages[path];
  const chapter = pageChapter(site, path);
  return (
    <Grid
      columns={responsive === 'small' ?
        ['xxsmall', 'flex', 'xxsmall'] : [
        ['xxsmall', 'flex'],
        ['small', 'medium'],
        ['medium', 'large'],
        ['xxsmall', 'flex'],
      ]}
      rows={['xsmall', 'flex']}
      areas={responsive === 'small' ? [
        { name: 'header', start: [1, 0], end: [1, 0] },
        { name: 'content', start: [1, 1], end: [1, 1] },
      ] : [
        { name: 'header', start: [1, 0], end: [2, 0] },
        { name: 'sidebar', start: [1, 1], end: [1, 1] },
        { name: 'content', start: [2, 1], end: [2, 1] },
      ]}
    >
      <Header gridArea="header" site={site} />
      {responsive !== 'small' && (
        <Sidebar gridArea="sidebar" site={site} chapter={chapter} />
      )}
      <Box gridArea="content">
        <Content>{page.content}</Content>
      </Box>
    </Grid>
  );
}

export default PagePreview;
