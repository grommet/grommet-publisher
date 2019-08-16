import React from 'react';
import { Box, Grid, ResponsiveContext } from 'grommet';
import Header from './components/Header';
import Footer from './components/Footer';
import Content from './components/Content';
import Sidebar from './components/Sidebar';

const ChapterPreview = ({ path, site, onChange }) => {
  const responsive = React.useContext(ResponsiveContext);
  const chapter = site.chapters[path];
  const noPages = (chapter.pageOrder.length === 0);
  const noSidebar = (responsive === 'small') || noPages;

  if (noPages) {
    const overlay = chapter.content.slice(0, 8) === '<Section';
    return (
      <Box flex="grow" style={{ position: 'relative' }}>
        <Header site={site} overlay={overlay} />
        <Box flex="grow" margin={overlay ? undefined : { horizontal: 'large' }}>
          <Content fill={overlay}>{chapter.content}</Content>
        </Box>
        <Footer site={site} overlay={overlay} />
      </Box>
    );
  }

  return (
    <Grid
      columns={noSidebar ?
        ['flex', ['medium', 'xlarge'], 'flex'] : [
        'flex',
        ['small', 'medium'],
        ['medium', 'large'],
        'flex',
      ]}
      rows={['xsmall', 'flex', 'xxsmall']}
      areas={noSidebar ? [
        { name: 'header', start: [0, 0], end: [0, 0] },
        { name: 'content', start: [0, 1], end: [0, 1] },
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
      {!noSidebar && (
        <Sidebar gridArea="sidebar" site={site} chapter={chapter} />
      )}
      <Box gridArea="content" flex="grow">
        <Content>{chapter.content}</Content>
      </Box>
      <Footer gridArea="footer" site={site} onChange={onChange} />
    </Grid>
  );
}

export default ChapterPreview;
