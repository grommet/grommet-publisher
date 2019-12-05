import React from 'react';
import { Box, CheckBox, Image, Text } from 'grommet';
import RoutedButton from './RoutedButton';
import { normalizeImageSrc } from '../site';

const Footer = ({ site, overlay, onChange, ...rest }) => {
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
        <Text size="small" color="text-xweak">{site.copyright}</Text>
      </Box>
      {site.themeLight && site.themeDark && (
        <CheckBox
          toggle
          checked={site.theme === site.themeDark}
          onChange={(event) => {
            const nextSite = JSON.parse(JSON.stringify(site));
            nextSite.theme = event.target.checked
              ? site.themeDark : site.themeLight;
            onChange(nextSite);
          }}
        />
      )}
    </Box>
  );
}

export default Footer;
