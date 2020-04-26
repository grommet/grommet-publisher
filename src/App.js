import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Grid, Grommet, ResponsiveContext, Keyboard, grommet } from 'grommet';
import { apiUrl, starter, upgradeSite, publish } from './site';
import Router from './Router';
import Nav from './Nav/Nav';
import ConfirmReplace from './ConfirmReplace';
import Editor from './Editor';
import Preview from './Preview';
import Loading from './components/Loading';

const getParams = () => {
  const { location } = window;
  const params = {};
  location.search
    .slice(1)
    .split('&')
    .forEach((p) => {
      const [k, v] = p.split('=');
      params[k] = decodeURIComponent(v);
    });
  return params;
};

const setNameParam = (name) => {
  const search = `?name=${encodeURIComponent(name)}`;
  const url = window.location.pathname + search;
  window.history.replaceState(undefined, undefined, url);
};

const App = () => {
  const responsiveSize = useContext(ResponsiveContext);
  const [site, setSite] = useState();
  const [mode, setMode] = useState();
  const [changes, setChanges] = useState([]);
  const [changeIndex, setChangeIndex] = useState();
  const [confirmReplace, setConfirmReplace] = useState();

  // load initial site
  useEffect(() => {
    const params = getParams();
    if (params.id) {
      fetch(`${apiUrl}/${params.id}`)
        .then((response) => response.json())
        .then((nextSite) => {
          if (!nextSite.id) nextSite.id = params.id;
          upgradeSite(nextSite);
          document.title = nextSite.name;
          setMode('preview');
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
            setMode('preview');
            setSite(nextSite);
            setChanges([{ site: nextSite }]);
          }
        });
    } else if (params.name) {
      const stored = localStorage.getItem(params.name);
      if (stored) {
        const nextSite = JSON.parse(stored);
        upgradeSite(nextSite);
        nextSite.local = true;
        document.title = nextSite.name;
        setSite(nextSite);
        setChanges([{ site: nextSite }]);
        const storedMode = localStorage.getItem(`${params.name}--mode`);
        setMode(storedMode ? JSON.parse(storedMode) : 'edit');
      } else {
        setSite(starter);
        setChanges([{ site: starter }]);
        setMode('edit');
      }
    } else {
      setSite(starter);
      setChanges([{ site: starter }]);
      setMode('edit');
    }
  }, []);

  // store lazily
  useEffect(() => {
    if (site && site.local) {
      // delay storing it locally so we don't bog down typing
      const timer = setTimeout(() => {
        localStorage.setItem(site.name, JSON.stringify(site));
        const params = getParams();
        if (params.name !== site.name) setNameParam(site.name);
        // ensure this site is first
        const stored = window.localStorage.getItem('sites');
        const sites = stored ? JSON.parse(stored) : [];
        const index = sites.indexOf(site.name);
        if (index !== 0) {
          if (index > 0) sites.splice(index, 1);
          sites.unshift(site.name);
          window.localStorage.setItem('sites', JSON.stringify(sites));
        }
        window.localStorage.setItem(`${site.name}--mode`, JSON.stringify(mode));
      }, 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [mode, site]);

  // add to changes, if needed
  useEffect(() => {
    // do this stuff lazily to ride out typing sprees
    const timer = setTimeout(() => {
      // If we already have this site object, we must be doing an undo or
      // redo, and therefore no need to add a change
      if (!changes.some((c) => c.site === site)) {
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

  const onUndo = useCallback(() => {
    const nextChangeIndex = Math.min(changeIndex + 1, changes.length - 1);
    const { site: nextSite } = changes[nextChangeIndex];
    setSite(nextSite);
    setChangeIndex(nextChangeIndex);
  }, [changes, changeIndex]);

  const onRedo = useCallback(() => {
    const nextChangeIndex = Math.max(changeIndex - 1, 0);
    const { site: nextSite } = changes[nextChangeIndex];
    setSite(nextSite);
    setChangeIndex(nextChangeIndex);
  }, [changes, changeIndex]);

  const onChange = (nextSite) => {
    if (nextSite && !nextSite.local && localStorage.getItem(nextSite.name)) {
      setConfirmReplace(nextSite);
    } else {
      if (nextSite) nextSite.local = true;
      setSite(nextSite);
    }
  };

  const onKey = (event) => {
    if (event.metaKey) {
      if (event.key === '.' || event.key === 'e') {
        event.preventDefault();
        setMode(mode === 'preview' ? 'edit' : 'preview');
      } else if (event.key === 'p' && event.shiftKey) {
        const stored = localStorage.getItem('identity');
        if (stored) {
          const identity = JSON.parse(stored);
          publish({
            site,
            ...identity,
            onChange,
            onError: (error) => console.error(error),
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
          {!site ? (
            <Loading />
          ) : (
            <Grid
              fill
              columns={
                responsiveSize === 'small' || mode === 'preview'
                  ? 'flex'
                  : ['small', ['small', 'large'], ['large', 'flex']]
              }
              rows="full"
            >
              {responsiveSize !== 'small' && mode !== 'preview' && (
                <Nav
                  site={site}
                  onChange={onChange}
                  onRedo={changeIndex > 0 && onRedo}
                  onUndo={changeIndex < changes.length - 1 && onUndo}
                />
              )}
              {responsiveSize !== 'small' && mode !== 'preview' && (
                <Editor site={site} onChange={onChange} />
              )}
              <Preview site={site} onChange={onChange} />
            </Grid>
          )}
        </Keyboard>
        {confirmReplace && (
          <ConfirmReplace
            site={site}
            nextSite={confirmReplace}
            onDone={(nextSite) => {
              if (nextSite) setSite(nextSite);
              setConfirmReplace(undefined);
            }}
          />
        )}
      </Grommet>
    </Router>
  );
};

export default App;
