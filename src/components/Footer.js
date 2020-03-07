import React from 'react';
import { Box, CheckBox, Text } from 'grommet';

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
        <Text size="small" color="text-xweak">
          {site.copyright}
        </Text>
      </Box>
      <CheckBox
        toggle
        checked={site.themeMode === 'dark'}
        onChange={event => {
          const nextSite = JSON.parse(JSON.stringify(site));
          nextSite.themeMode = event.target.checked ? 'dark' : 'light';
          onChange(nextSite);
        }}
      />
    </Box>
  );
};

export default Footer;
