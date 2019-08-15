import React from 'react';
import { Box } from 'grommet';
import { Hpe } from 'grommet-icons';
import { RouterContext } from '../Router';
import RoutedAnchor from './RoutedAnchor';
import RoutedButton from './RoutedButton';
import { pageSection } from '../site';

const Header = ({ site, ...rest }) => {
  const { path: activePath } = React.useContext(RouterContext);
  const section = pageSection(site, activePath);
  return (
    <Box
      flex={false}
      pad={{ vertical: 'small' }}
      direction="row"
      align="center"
      justify="between"
      gap="small"
      {...rest}
    >
      <RoutedButton path="/" showActive={false}>
        <Hpe size="large" color="brand" />
      </RoutedButton>
      <Box direction="row" align="center" gap="medium">
        {site.sectionOrder.map(path => (
          <RoutedAnchor
            key={path}
            path={path} 
            active={section && section.path === path}
          >
            <Box>{site.sections[path].name}</Box>
          </RoutedAnchor>
        ))}
      </Box>
    </Box>
  );
}

export default Header;
