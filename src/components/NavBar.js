import React from 'react';
import { Box, DropButton, ResponsiveContext } from 'grommet';
import { Menu } from 'grommet-icons';
import { RouterContext } from '../Router';
import RoutedAnchor from './RoutedAnchor';
import RoutedButton from './RoutedButton';
import { pageChapter } from '../site';

const NavBar = ({ site, overlay, ...rest }) => {
  const responsive = React.useContext(ResponsiveContext);
  const { path: activePath } = React.useContext(RouterContext);
  const chapter = pageChapter(site, activePath);

  return responsive === 'small' ? (
    <DropButton
      icon={<Menu />}
      hoverIndicator
      dropAlign={{ top: 'bottom', right: 'right' }}
      dropProps={{ plain: true }}
      dropContent={
        <Box
          background={{ color: '#1A1F2B', opacity: '0.9' }}
          border
          elevation="large"
        >
          {site.chapterOrder
            .map(path => site.chapters[path])
            .filter(chapter => chapter)
            .map(chapter => (
              <Box>
                <RoutedButton
                  key={chapter.path}
                  site={site}
                  path={chapter.path}
                  hoverIndicator
                >
                  <Box pad={{ horizontal: 'medium', vertical: 'xsmall' }}>
                    {chapter.name}
                  </Box>
                </RoutedButton>
                {chapter.pageOrder
                  .map(path => site.pages[path])
                  .filter(page => page)
                  .map(page => (
                    <RoutedButton
                      key={page.path}
                      site={site}
                      path={page.path}
                      hoverIndicator
                    >
                      <Box
                        pad={{
                          left: 'large',
                          horizontal: 'medium',
                          vertical: 'xsmall',
                        }}
                      >
                        {page.name}
                      </Box>
                    </RoutedButton>
                  ))}
              </Box>
            ))}
        </Box>
      }
    />
  ) : (
    <Box direction="row" align="center" gap="medium" {...rest}>
      {site.chapterOrder.map(path => (
        <RoutedAnchor
          key={path}
          site={site}
          path={path}
          active={chapter && chapter.path === path}
        >
          <Box>{site.chapters[path].name}</Box>
        </RoutedAnchor>
      ))}
    </Box>
  );
};

export default NavBar;
