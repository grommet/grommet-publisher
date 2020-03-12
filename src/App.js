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
import { apiUrl, starter, upgradeSite, publish } from './site';
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
  const [changes, setChanges] = React.useState([]);
  const [changeIndex, setChangeIndex] = React.useState();
  const storeTimer = React.useRef(null);

  // load initial site
  React.useEffect(() => {
    const params = getParams();
    if (params.id) {
      fetch(`${apiUrl}/${params.id}`)
        .then(response => response.json())
        .then(nextSite => {
          if (!nextSite.id) nextSite.id = params.id;
          upgradeSite(nextSite);
          document.title = nextSite.name;
          setPreview(true);
          setSite(nextSite);
          setChanges([{ site: nextSite }]);
          // save it for future offline usage
          localStorage.setItem(params.id, JSON.stringify(nextSite));
        })
        .catch(() => {
          // see if we have this site cached, we might be offline
          const stored = localStorage.getItem(params.id);
          if (stored) {
            const nextSite = JSON.parse(stored);
            upgradeSite(nextSite);
            document.title = nextSite.name;
            setPreview(true);
            setSite(nextSite);
            setChanges([{ site: nextSite }]);
          }
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
        setChanges([{ site: nextSite }]);
      } else {
        setSite(starter);
        setChanges([{ site: starter }]);
      }
    }
  }, []);

  // add to changes, if needed
  React.useEffect(() => {
    // do this stuff lazily to ride out typing sprees
    const timer = setTimeout(() => {
      // If we already have this site object, we must be doing an undo or
      // redo, and therefore no need to add a change
      if (!changes.some(c => c.site === site)) {
        let nextChanges;
        nextChanges = [...changes];
        nextChanges = nextChanges.slice(changeIndex, 10);
        nextChanges.unshift({ site });
        setChanges(nextChanges);
        setChangeIndex(0);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [changes, changeIndex, site]);

  const onUndo = React.useCallback(() => {
    const nextChangeIndex = Math.min(changeIndex + 1, changes.length - 1);
    const { site: nextSite } = changes[nextChangeIndex];
    setSite(nextSite);
    setChangeIndex(nextChangeIndex);
  }, [changes, changeIndex]);

  const onRedo = React.useCallback(() => {
    const nextChangeIndex = Math.max(changeIndex - 1, 0);
    const { site: nextSite } = changes[nextChangeIndex];
    setSite(nextSite);
    setChangeIndex(nextChangeIndex);
  }, [changes, changeIndex]);

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
      } else if (event.key === 'p' && event.shiftKey) {
        const stored = localStorage.getItem('identity');
        if (stored) {
          const identity = JSON.parse(stored);
          publish({
            site,
            ...identity,
            onChange,
            onError: error => console.error(error),
          });
        } else {
          console.warn('You need to have published to be able to re-publish');
        }
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
                <Box fill justify="center" align="center" margin="xlarge">
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
                    <Nav
                      site={site}
                      onChange={onChange}
                      onRedo={changeIndex > 0 && onRedo}
                      onUndo={changeIndex < changes.length - 1 && onUndo}
                    />
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
