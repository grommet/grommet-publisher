import React from 'react';
import { Grommet, Box, grommet } from 'grommet';
import { Document } from 'grommet-icons';
import { Redirect, Route, Routes } from './Router';
import SitePreview from './SitePreview';
import ChapterPreview from './ChapterPreview';
import PagePreview from './PagePreview';

export const themeApiUrl =
  'https://us-central1-grommet-designer.cloudfunctions.net/themes';

// const npmTheme = {}

const Preview = ({ site, onChange }) => {
  const [theme, setTheme] = React.useState();
  React.useEffect(() => {
    if (site.theme) {
      const id = site.theme.split('id=')[1];
      if (id) {
        fetch(`${themeApiUrl}/${id}`)
          .then(response => response.json())
          .then(theme => {
            setTheme(theme);
            // save it for future offline usage
            localStorage.setItem(id, JSON.stringify(theme));
          })
          .catch(() => {
            // see if we have this site cached, we might be offline
            const stored = localStorage.getItem(id);
            if (stored) {
              const theme = JSON.parse(stored);
              setTheme(theme);
            } else {
              setTheme(grommet);
            }
          });
        // NOTE: This doesn't work because we don't have react + styled globals
        // } else {
        //   // this is from npmjs
        //   // e.g. https://unpkg.com/grommet-theme-hpe/dist/grommet-theme-hpe.min.js
        //   const name = site.theme.split('/')[3].split('.')[0]; // grommet-theme-hpe
        //   const nameParts = name.split('-'); // [grommet, theme, hpe]
        //   const varName = nameParts
        //     .map(p => `${p[0].toUpperCase()}${p.slice(1)}`)
        //     .join(''); // GrommetThemeHpe
        //   const subName = nameParts[2]; // hpe
        //   if (!document.getElementById(name)) {
        //     // we haven't loaded this theme, add it in its own script tag
        //     const script = document.createElement('script');
        //     script.src = site.theme;
        //     script.id = name;
        //     document.body.appendChild(script);
        //     script.onload = () => {
        //       npmTheme[name] = window[varName][subName];
        //       setTheme(npmTheme[name]);
        //     };
        //   } else {
        //     setTheme(npmTheme[name]);
        //   }
      }
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
