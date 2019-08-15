import React from 'react';
import { Box, DropButton, ResponsiveContext } from 'grommet';
import { Hpe, Menu } from 'grommet-icons';
import { RouterContext } from '../Router';
import RoutedAnchor from './RoutedAnchor';
import RoutedButton from './RoutedButton';
import { pageSection } from '../site';

const Header = ({ site, ...rest }) => {
  const responsive = React.useContext(ResponsiveContext);
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
      {responsive === 'small' ? (
        <DropButton
          icon={<Menu />}
          hoverIndicator
          dropAlign={{ top: 'bottom', right: 'right' }}
          dropProps={{ plain: true }}
          dropContent={(
            <Box
              background={{ color: '#1A1F2B', opacity: '0.9' }}
              border
              elevation="large"
            >
              {site.sectionOrder.map(path => site.sections[path])
                .filter(section => section)
                .map(section => (
                <Box>
                  <RoutedButton
                    key={section.path}
                    path={section.path}
                    hoverIndicator
                  >
                    <Box pad={{ horizontal: 'medium', vertical: 'xsmall' }}>
                      {section.name}
                    </Box>
                  </RoutedButton>
                  {section.pageOrder.map(path => site.pages[path])
                    .filter(page => page)
                    .map(page => (
                    <RoutedButton
                      key={page.path}
                      path={page.path}
                      hoverIndicator
                    >
                      <Box pad={{ left: 'large', horizontal: 'medium', vertical: 'xsmall' }}>
                        {page.name}
                      </Box>
                    </RoutedButton>
                  ))}
                </Box>
              ))}
            </Box>
          )}
        />
      ) : (
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
      )}
    </Box>
  );
}

export default Header;
