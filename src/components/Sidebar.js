import React from 'react';
import { Box } from 'grommet';
import RoutedAnchor from './RoutedAnchor';

const Sidebar = ({ routes, site, ...rest }) => {
  return (
    <Box pad={{ vertical: 'small' }} gap="small" {...rest}>
      {routes.map(route => (
        <RoutedAnchor key={route.path} path={route.path}>
          <Box>{route.name}</Box>
        </RoutedAnchor>
      ))}
    </Box>
  );
};

export default Sidebar;
