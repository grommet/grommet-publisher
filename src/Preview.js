import React, { useEffect, useState } from 'react';
import { Grommet, Box, grommet } from 'grommet';
import { Redirect, Route, Routes } from './Router';
import SitePreview from './SitePreview';
import ChapterPreview from './ChapterPreview';
import PagePreview from './PagePreview';
import Loading from './components/Loading';

export const themeApiUrl =
  'https://us-central1-grommet-designer.cloudfunctions.net/themes';

const Preview = ({ site, onChange }) => {
  const [theme, setTheme] = useState();
  useEffect(() => {
    if (site.theme) {
      const id = site.theme.split('id=')[1];
      if (id) {
        fetch(`${themeApiUrl}/${id}`)
          .then((response) => response.json())
          .then((theme) => {
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
      } else {
        fetch(site.theme)
          .then((response) => response.json())
          .then((theme) => {
            setTheme(theme);
            // save it for future offline usage
            localStorage.setItem(site.theme, JSON.stringify(theme));
          })
          .catch(() => {
            // see if we have this site cached, we might be offline
            const stored = localStorage.getItem(site.theme);
            if (stored) {
              const theme = JSON.parse(stored);
              setTheme(theme);
            } else {
              setTheme(grommet);
            }
          });
      }
    } else {
      setTheme(grommet);
    }
  }, [site.theme]);

  if (!theme) return <Loading />;

  return (
    <Grommet
      theme={theme}
      themeMode={site.themeMode}
      style={{ minHeight: '100vh' }}
    >
      <Box fill overflow="auto" animation="fadeIn">
        <Routes notFoundRedirect="/">
          <Route
            exact
            path="/"
            component={SitePreview}
            props={{ site, onChange }}
          />
          {Object.keys(site.chapters).map((path) => (
            <Route
              key={path}
              exact
              path={path}
              site={site}
              component={ChapterPreview}
              props={{ path, site, onChange }}
            />
          ))}
          {Object.keys(site.pages).map((path) => (
            <Route
              key={path}
              exact
              path={path}
              component={PagePreview}
              props={{ path, site, onChange }}
            />
          ))}
          {site.alias && <Redirect path={site.alias.from} to={site.alias.to} />}
        </Routes>
      </Box>
    </Grommet>
  );
};

export default Preview;
