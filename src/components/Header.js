import React from 'react';
import { Box, Image } from 'grommet';
import { Document } from 'grommet-icons';
import RoutedAnchor from './RoutedAnchor';
import RoutedButton from './RoutedButton';
import NavBar from './NavBar';
import { normalizeImageSrc } from '../site';

const Header = ({ overlay, parent, site, ...rest }) => {
  let style;
  if (overlay) {
    style = { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 };
  }
  return (
    <Box
      flex={false}
      pad={{ vertical: 'medium' }}
      direction="row"
      align="center"
      justify="between"
      gap="medium"
      responsive={false}
      style={style}
      {...rest}
    >
      {site.navMode === 'cards' && parent ? (
        <RoutedAnchor site={site} path={parent.path} label={parent.name} />
      ) : (
        <RoutedButton
          site={site}
          path="/"
          showActive={false}
          style={{ lineHeight: 0 }}
        >
          {site.logo ? (
            <Image src={normalizeImageSrc(site.logo)} />
          ) : (
            <Document />
          )}
        </RoutedButton>
      )}
      {site.navMode === 'bar' && <NavBar site={site} overlay={overlay} />}
    </Box>
  );
};

export default Header;
