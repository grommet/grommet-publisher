import React from 'react';
import { Box, Grid, ResponsiveContext } from 'grommet';
import Header from './Header';
import Footer from './Footer';
import Content from './Content';
import Sidebar from './Sidebar';
import Cards from './Cards';

const Layout = ({
  children,
  content,
  onChange,
  parent,
  peers,
  site,
  ...rest
}) => {
  const responsive = React.useContext(ResponsiveContext);
  const overlay = content.slice(0, 8) === '<Section';
  const sidebar =
    site.navMode === 'bar' &&
    responsive !== 'small' &&
    (children || peers).length > 0;

  if (!sidebar && overlay) {
    return (
      <Box flex="grow" style={{ position: 'relative' }} {...rest}>
        <Header site={site} overlay />
        <Box flex="grow">
          <Content fill>{content}</Content>
          {site.navMode === 'cards' && (
            <Cards routes={children} size={site.size} overlay />
          )}
        </Box>
        <Footer site={site} overlay onChange={onChange} />
      </Box>
    );
  }

  return (
    <Grid
      columns={
        sidebar
          ? ['flex', ['small', 'medium'], ['medium', 'large'], 'flex']
          : ['flex', ['medium', 'xlarge'], 'flex']
      }
      rows={['xsmall', 'flex']}
      areas={
        sidebar
          ? [
              { name: 'header', start: [1, 0], end: [2, 0] },
              { name: 'sidebar', start: [1, 1], end: [1, 1] },
              { name: 'content', start: [2, 1], end: [2, 1] },
            ]
          : [
              { name: 'header', start: [1, 0], end: [1, 0] },
              { name: 'content', start: [1, 1], end: [1, 1] },
            ]
      }
      fill
      style={{ minHeight: '100vh' }}
      {...rest}
    >
      <Header gridArea="header" site={site} parent={parent} />
      {sidebar && (
        <Sidebar gridArea="sidebar" site={site} routes={children || peers} />
      )}
      <Box
        gridArea="content"
        margin={sidebar ? undefined : { horizontal: 'large' }}
      >
        <Box flex="grow">
          <Content size={site.size}>{content}</Content>
          {site.navMode === 'cards' && (
            <Cards routes={children} size={site.size} overlay={overlay} />
          )}
        </Box>
        <Footer site={site} onChange={onChange} />
      </Box>
    </Grid>
  );
};

export default Layout;
