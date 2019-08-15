import React from 'react';
import { Box } from 'grommet';
import RoutedAnchor from './RoutedAnchor';

const Sidebar = ({ section, site, ...rest }) => {
  return (
    <Box  
      pad={{ vertical: 'small' }}
      gap="small"
      {...rest}
    >
      {section && section.pageOrder.map(path => site.pages[path])
        .filter(page => page)
        .map(page => (
        <RoutedAnchor key={page.path} path={page.path}>
          <Box>{page.name}</Box>
        </RoutedAnchor>
      ))}
    </Box>
  );
}

export default Sidebar;
