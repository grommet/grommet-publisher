import React from 'react';
import {
  Box,
  Grid,
  Grommet,
  ResponsiveContext,
  Keyboard,
  grommet,
} from 'grommet';
import { Document } from 'grommet-icons';
import { apiUrl, starter, upgradeSite } from './site';
import Router from './Router';
import Nav from './Nav/Nav';
import Editor from './Editor';
import Preview from './Preview';

const getParams = () => {
  const { location } = window;
  const params = {};
  location.search
    .slice(1)
    .split('&')
    .forEach(p => {
      const [k, v] = p.split('=');
      params[k] = decodeURIComponent(v);
    });
  return params;
};

const App = () => {
  const [site, setSite] = React.useState();
  const [preview, setPreview] = React.useState();
  const storeTimer = React.useRef(null);

  React.useEffect(() => {
    const params = getParams();
    if (params.id) {
      fetch(`${apiUrl}/${params.id}`)
        .then(response => response.json())
        .then(nextSite => {
          upgradeSite(nextSite);
          document.title = nextSite.name;
          setPreview(true);
          setSite(nextSite);
        });
    } else {
      let stored = localStorage.getItem('activeSite');
      if (stored) {
        stored = localStorage.getItem(stored);
      }
      if (stored) {
        const nextSite = JSON.parse(stored);
        upgradeSite(nextSite);
        document.title = nextSite.name;
        setSite(nextSite);
      } else {
        setSite(starter);
      }
    }
  }, []);

  const onChange = nextSite => {
    setSite(nextSite);

    // delay storing it locally so we don't bog down typing
    clearTimeout(storeTimer.current);
    storeTimer.current = setTimeout(() => {
      document.title = nextSite.name;
      localStorage.setItem(nextSite.name, JSON.stringify(nextSite));
      localStorage.setItem('activeSite', nextSite.name);
      if (document.location.search) {
        // clear current URL, in case we've started editing a published design locally
        window.history.replaceState({}, nextSite.name, '/');
      }
      // ensure we have this site name in our site list
      const sites = JSON.parse(localStorage.getItem('sites') || '[]');
      if (!sites.includes(nextSite.name)) {
        sites.unshift(nextSite.name);
        localStorage.setItem('sites', JSON.stringify(sites));
      }
    }, 1000);
  };

  const onKey = event => {
    if (event.metaKey) {
      if (event.key === 'e') {
        event.preventDefault();
        setPreview(!preview);
      }
    }
  };

  return (
    <Router>
      <Grommet theme={grommet} style={{ minHeight: '100vh' }}>
        <Keyboard target="document" onKeyDown={onKey}>
          <ResponsiveContext.Consumer>
            {responsive => {
              return !site ? (
                <Box fill justify="center" align="center">
                  <Box animation="pulse">
                    <Document size="xlarge" />
                  </Box>
                </Box>
              ) : (
                <Grid
                  fill
                  columns={
                    responsive === 'small' || preview
                      ? 'flex'
                      : ['small', ['small', 'large'], ['large', 'flex']]
                  }
                  rows="full"
                >
                  {responsive !== 'small' && !preview && (
                    <Nav site={site} onChange={onChange} />
                  )}
                  {responsive !== 'small' && !preview && (
                    <Editor site={site} onChange={onChange} />
                  )}
                  <Preview site={site} onChange={onChange} />
                </Grid>
              );
            }}
          </ResponsiveContext.Consumer>
        </Keyboard>
      </Grommet>
    </Router>
  );
};

export default App;
