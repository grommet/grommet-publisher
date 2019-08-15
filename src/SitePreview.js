import React from 'react';
import { Box, Grid, Markdown } from 'grommet';
import Header from './Header';

const SitePreview = ({ site }) => (
  <Grid
    columns={['flex']}
    rows={['xsmall', 'flex']}
    areas={[
      { name: 'header', start: [0, 0], end: [0, 0] },
      { name: 'content', start: [0, 1], end: [0, 1] },
    ]}
  >
    <Header gridArea="header" site={site} />
    <Box pad={{ horizontal: 'large' }}>
      <Markdown gridArea="content">{site.content}</Markdown>
    </Box>
  </Grid>
);

export default SitePreview;
