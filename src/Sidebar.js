import React from 'react';
import { Box } from 'grommet';
import RoutedAnchor from './components/RoutedAnchor';

const Sidebar = ({ section, site, ...rest }) => {
  return (
    <Box  
      pad={{ horizontal: 'large', vertical: 'small' }}
      gap="small"
      {...rest}
    >
      {section.pageOrder.map(path => (
        <RoutedAnchor key={path} path={path}>
          <Box>{site.pages[path].name}</Box>
        </RoutedAnchor>
      ))}
    </Box>
  );
}

export default Sidebar;
