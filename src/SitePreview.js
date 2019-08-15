import React from 'react';
import { Box, Grid, ResponsiveContext } from 'grommet';
import Header from './components/Header';
import Content from './components/Content';

const SitePreview = ({ site }) => {
  const responsive = React.useContext(ResponsiveContext);
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
      areas={[
        { name: 'header', start: [1, 0], end: [1, 0] },
        { name: 'content', start: [1, 1], end: [1, 1] },
      ]}
    >
      <Header gridArea="header" site={site} />
      <Box gridArea="content">
        <Content>{site.content}</Content>
      </Box>
    </Grid>
  );
}

export default SitePreview;
