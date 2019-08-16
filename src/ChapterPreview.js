import React from 'react';
import { Box, Grid, ResponsiveContext } from 'grommet';
import Header from './components/Header';
import Content from './components/Content';
import Sidebar from './components/Sidebar';

const ChapterPreview = ({ path, site }) => {
  const responsive = React.useContext(ResponsiveContext);
  const chapter = site.chapters[path];
  const noPages = (chapter.pageOrder.length === 0);
  const noSidebar = (responsive === 'small') || noPages;

  if (noPages) {
    return (
      <Box style={{ position: 'relative' }}>
        <Header gridArea="header" site={site} overlay={true} />
        <Content fill>{chapter.content}</Content>
      </Box>
    );
  }

  return (
    <Grid
      columns={noSidebar ?
        ['flex'] : [
        ['xxsmall', 'flex'],
        ['small', 'medium'],
        ['medium', 'large'],
        ['xxsmall', 'flex'],
      ]}
      rows={['xsmall', 'flex']}
      areas={noSidebar ? [
        { name: 'header', start: [0, 0], end: [0, 0] },
        { name: 'content', start: [0, 1], end: [0, 1] },
      ] : [
        { name: 'header', start: [1, 0], end: [2, 0] },
        { name: 'sidebar', start: [1, 1], end: [1, 1] },
        { name: 'content', start: [2, 1], end: [2, 1] },
      ]}
    >
      <Header gridArea="header" site={site} />
      {!noSidebar && (
        <Sidebar gridArea="sidebar" site={site} chapter={chapter} />
      )}
      <Box gridArea="content">
        <Content>{chapter.content}</Content>
      </Box>
    </Grid>
  );
}

export default ChapterPreview;
