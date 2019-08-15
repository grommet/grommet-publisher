// NOTE: our routing needs are so simple, we roll our own
// to avoid dependencies on react-router, which doesn't appear to
// be keeping up with React changes.

import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';

export const RouterContext = React.createContext({});

export class Router extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.search !== prevState.search) {
      return { search: nextProps.search };
    }
    return null;
  }

  state = {};

  componentDidMount() {
    window.addEventListener('popstate', this.onPopState);
    this.onPopState();
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.onPopState);
  }

  onPopState = () => {
    const { location } = document;
    this.setState({ path: location.pathname, search: location.search });
  };

  onPush = nextPath => {
    const { path, search } = this.state;
    if (nextPath !== path) {
      if (nextPath.startsWith('http')) {
        window.location = nextPath;
      } else {
        window.history.pushState(
          undefined,
          undefined,
          `${nextPath}${search || ''}`,
        );
        this.setState({ path: nextPath });
        window.scrollTo(0, 0);
      }
    }
  };

  onReplace = nextPath => {
    const { path, search } = this.state;
    if (nextPath !== path) {
      if (nextPath.startsWith('http')) {
        window.location.replace(nextPath);
      } else {
        window.history.replaceState(
          undefined,
          undefined,
          `${nextPath}${search || ''}`,
        );
        this.setState({ path: nextPath });
        window.scrollTo(0, 0);
      }
    }
  };

  render() {
    const { children } = this.props;
    const { path, search } = this.state;
    return (
      <RouterContext.Provider
        value={{ path, search, push: this.onPush, replace: this.onReplace }}
      >
        {children}
      </RouterContext.Provider>
    );
  }
}

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
  if (currentPath && !found) {
    setTimeout(() => replace(notFoundRedirect), 1); // avoid setState in render()
  }
  return found || null;
};

Routes.propTypes = {
  children: PropTypes.node.isRequired,
  notFoundRedirect: PropTypes.string.isRequired,
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

export default Router;
