import React from 'react';
import { Grommet, Box, grommet } from 'grommet';
import { Document } from 'grommet-icons';
import { Redirect, Route, Routes } from './Router';
import SitePreview from './SitePreview';
import ChapterPreview from './ChapterPreview';
import PagePreview from './PagePreview';

export const themeApiUrl =
  'https://us-central1-grommet-designer.cloudfunctions.net/themes';

const Preview = ({ site, onChange }) => {
  const [theme, setTheme] = React.useState();
  React.useEffect(() => {
    if (site.theme) {
      const id = site.theme.split('id=')[1];
      fetch(`${themeApiUrl}/${id}`)
        .then(response => response.json())
        .then(theme => setTheme(theme))
        .catch(() => setTheme(grommet));
    } else {
      setTheme(false);
    }
  }, [site.theme]);

  return (
    <Grommet
      theme={theme}
      themeMode={site.themeMode}
      style={{ minHeight: '100vh' }}
    >
      <Box fill overflow="auto" animation="fadeIn">
        {theme === undefined ? (
          <Box flex align="center" justify="center" animation="pulse">
            <Document size="xlarge" color="brand" />
          </Box>
        ) : (
          <Routes notFoundRedirect="/">
            <Route
              exact
              path="/"
              component={SitePreview}
              props={{ site, onChange }}
            />
            {Object.keys(site.chapters).map(path => (
              <Route
                key={path}
                exact
                path={path}
                site={site}
                component={ChapterPreview}
                props={{ path, site, onChange }}
              />
            ))}
            {Object.keys(site.pages).map(path => (
              <Route
                key={path}
                exact
                path={path}
                component={PagePreview}
                props={{ path, site, onChange }}
              />
            ))}
            {site.alias && (
              <Redirect path={site.alias.from} to={site.alias.to} />
            )}
          </Routes>
        )}
      </Box>
    </Grommet>
  );
};

export default Preview;
