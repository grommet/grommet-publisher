// NOTE: our routing needs are so simple, we roll our own
// to avoid dependencies on react-router.

import React, { Children } from 'react';
import PropTypes from 'prop-types';

export const RouterContext = React.createContext({});

export const Router = ({ children }) => {
  const [path, setPath] = React.useState();

  React.useEffect(() => {
    const onPopState = () => setPath(document.location.pathname);
    onPopState();
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const push = nextPath => {
    if (nextPath !== path) {
      if (nextPath.startsWith('http')) {
        window.location = nextPath;
      } else {
        window.history.pushState(undefined, undefined, nextPath);
        setPath(nextPath);
        window.scrollTo(0, 0);
      }
    }
  };

  const replace = nextPath => {
    if (nextPath !== path) {
      if (nextPath.startsWith('http')) {
        window.location.replace(nextPath);
      } else {
        window.history.replaceState(undefined, undefined, nextPath);
        setPath(nextPath);
        window.scrollTo(0, 0);
      }
    }
  };

  return (
    <RouterContext.Provider value={{ path, push, replace }}>
      {children}
    </RouterContext.Provider>
  );
};

Router.propTypes = {
  children: PropTypes.node.isRequired,
};

export const Routes = ({ children, notFoundRedirect }) => {
  const { path: currentPath, replace } = React.useContext(RouterContext);
  let found;
  Children.forEach(children, child => {
    if (
      !found &&
      currentPath &&
      currentPath.split('#')[0] === child.props.path
    ) {
      found = child;
    }
  });
  if (currentPath && !found && notFoundRedirect) {
    setTimeout(() => replace(notFoundRedirect), 1); // avoid setPath() in render()
  }
  return found || null;
};

Routes.propTypes = {
  children: PropTypes.node.isRequired,
  notFoundRedirect: PropTypes.string,
};

export const Route = ({ component: Comp, path, props, redirect }) => {
  const { path: currentPath, replace } = React.useContext(RouterContext);
  if (currentPath && currentPath.split('#')[0] === path) {
    if (redirect) {
      replace(redirect);
    } else if (Comp) {
      return <Comp {...props} />;
    } else {
      console.error('Route missing component or redirect');
    }
  }
  return null;
};

Route.propTypes = {
  component: PropTypes.func,
  path: PropTypes.string.isRequired,
  redirect: PropTypes.string,
};

Route.defaultProps = {
  component: undefined,
  redirect: undefined,
};

export const Redirect = ({ from, to }) => {
  const { path, replace } = React.useContext(RouterContext);
  if (path && path.split('#')[0] === from) {
    replace(to);
  }
  return null;
};

export default Router;
