import React from 'react';
import { Grid, Markdown } from 'grommet';
import Header from './Header';
import Sidebar from './Sidebar';
import { pageSection } from './site';

const PagePreview = ({ path, site }) => {
  const page = site.pages[path];
  const section = pageSection(site, path);
  return (
    <Grid
      columns={['small', 'flex']}
      rows={['xsmall', 'flex']}
      areas={[
        { name: 'header', start: [0, 0], end: [1, 0] },
        { name: 'sidebar', start: [0, 1], end: [0, 1] },
        { name: 'content', start: [1, 1], end: [1, 1] },
      ]}
    >
      <Header gridArea="header" site={site} />
      <Sidebar gridArea="sidebar" site={site} section={section} />
      <Markdown gridArea="content">{page.content}</Markdown>
    </Grid>
  );
}

export default PagePreview;
