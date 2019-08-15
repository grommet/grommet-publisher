import React from 'react';
import { Box } from 'grommet';
import { Hpe } from 'grommet-icons';
import RoutedAnchor from './components/RoutedAnchor';
import RoutedButton from './components/RoutedButton';

const Header = ({ site, ...rest }) => {
  return (
    <Box
      flex={false}
      pad={{ horizontal: 'large', vertical: 'small' }}
      direction="row"
      align="center"
      justify="between"
      gap="small"
      {...rest}
    >
      <RoutedButton path="/" showActive={false}>
        <Hpe size="large" color="brand" />
      </RoutedButton>
      <Box direction="row" align="center">
        {site.sectionOrder.map(path => (
          <RoutedAnchor key={path} path={path}>
            <Box pad="small">{site.sections[path].name}</Box>
          </RoutedAnchor>
        ))}
      </Box>
    </Box>
  );
}

export default Header;
