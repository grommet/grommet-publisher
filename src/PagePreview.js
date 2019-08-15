import React from 'react';
import { Box, Grid } from 'grommet';
import Header from './components/Header';
import Content from './components/Content';
import Sidebar from './components/Sidebar';
import { pageSection } from './site';

const PagePreview = ({ path, site }) => {
  const page = site.pages[path];
  const section = pageSection(site, path);
  return (
    <Grid
      columns={[['xxsmall', 'flex'], ['small', 'medium'], ['medium', 'large'], ['xxsmall', 'flex']]}
      rows={['xsmall', 'flex']}
      areas={[
        { name: 'header', start: [1, 0], end: [2, 0] },
        { name: 'sidebar', start: [1, 1], end: [1, 1] },
        { name: 'content', start: [2, 1], end: [2, 1] },
      ]}
    >
      <Header gridArea="header" site={site} />
      <Sidebar gridArea="sidebar" site={site} section={section} />
      <Box gridArea="content">
        <Content>{page.content}</Content>
      </Box>
    </Grid>
  );
}

export default PagePreview;
