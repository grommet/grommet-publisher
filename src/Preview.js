import React from 'react';
import { Grommet, Box } from 'grommet';
import { Document } from 'grommet-icons';
import { Route, Routes } from './Router';
import SitePreview from './SitePreview';
import SectionPreview from './SectionPreview';
import PagePreview from './PagePreview';

export const themeApiUrl = 'https://us-central1-grommet-designer.cloudfunctions.net/themes';

const Preview = ({ site, onChange }) => {
  const [theme, setTheme] = React.useState();
  React.useState(() => {
    if (site.theme) {
      const id = site.theme.split('id=')[1];
      fetch(`${themeApiUrl}/${id}`)
        .then(response => response.json())
        .then(theme => setTheme(theme));
    } else {
      setTheme(false);
    }
  }, [site]);

  return (
    <Grommet theme={theme} style={{ minHeight: '100vh' }}>
      <Box background="#1A1F2B" overflow="hidden" animation="fadeIn" style={{ minHeight: '100vh' }}>
        {theme === undefined ? (
          <Box flex align="center" justify="center" animation="pulse">
            <Document size="xlarge" color="dark-3" />
          </Box>
        ) : (
          <Routes notFoundRedirect="/">
            <Route
              exact
              path="/"
              component={SitePreview}
              props={{ site }}
            />
            {Object.keys(site.sections).map(path => (
              <Route
                key={path}
                exact
                path={path}
                site={site}
                component={SectionPreview}
                props={{ path, site }}
              />
            ))}
            {Object.keys(site.pages).map(path => (
              <Route
                key={path}
                exact
                path={path}
                component={PagePreview}
                props={{ path, site }}
              />
            ))}
          </Routes>
        )}
      </Box>
    </Grommet>
  );
}

export default Preview;
