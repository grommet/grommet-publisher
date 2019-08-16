import React from 'react';
import { Route, Routes } from './Router';
import SiteEdit from './SiteEdit';
import ChapterEdit from './ChapterEdit';
import PageEdit from './PageEdit';

const Editor = ({ site, onChange }) => {
  return (
    <Routes notFoundRedirect="/">
      <Route
        exact
        path="/"
        component={SiteEdit}
        props={{ site, onChange }}
      />
      {Object.keys(site.chapters).map(path => (
        <Route
          key={path}
          exact
          path={path}
          component={ChapterEdit}
          props={{ path, site, onChange }}
        />
      ))}
      {Object.keys(site.pages).map(path => (
        <Route
          key={path}
          exact
          path={path}
          component={PageEdit}
          props={{ path, site, onChange }}
        />
      ))}
    </Routes>
  );
}

export default Editor;
