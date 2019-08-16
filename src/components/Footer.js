import React from 'react';
import { Box, Image, Text } from 'grommet';
import RoutedButton from './RoutedButton';
import { normalizeImageSrc } from '../site';

const Footer = ({ site, overlay, ...rest }) => {
  let style;
  if (overlay) {
    style = { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10 };
  }
  return (
    <Box
      flex={false}
      pad={{ vertical: 'small', horizontal: 'large' }}
      direction="row"
      align="center"
      justify="between"
      gap="small"
      style={style}
      {...rest}
    >
      <Box direction="row" align="center" gap="small">
        {site.logo && (
          <RoutedButton path="/" showActive={false} style={{ lineHeight: 0 }}>
            <Image
              src={normalizeImageSrc(site.logo)}
              style={{ transform: 'scale(0.5)' }}
            />
          </RoutedButton>
        )}
        <Text size="small" color="dark-4">{site.copyright}</Text>
      </Box>
    </Box>
  );
}

export default Footer;
