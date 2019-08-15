import React from 'react';
import { Grid, Markdown } from 'grommet';
import Header from './Header';
import Sidebar from './Sidebar';

const SectionPreview = ({ path, site }) => {
  const section = site.sections[path];
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
      <Markdown gridArea="content">{section.content}</Markdown>
    </Grid>
  );
}

export default SectionPreview;
