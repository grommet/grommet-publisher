import React from 'react';
import { Box, Image } from 'grommet';
import { Previous, Document } from 'grommet-icons';
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
      height="xsmall"
      pad={{ vertical: 'small', horizontal: 'large' }}
      direction="row"
      align="center"
      justify="between"
      gap="medium"
      style={style}
      {...rest}
    >
      {site.navMode === 'cards' && parent ? (
        <RoutedButton path={parent.path} icon={<Previous />} hoverIndicator />
      ) : (
        <RoutedButton path="/" showActive={false} style={{ lineHeight: 0 }}>
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
