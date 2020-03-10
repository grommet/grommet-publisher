import React from 'react';
import PropTypes from 'prop-types';
import { Anchor } from 'grommet';
import { RouterContext } from '../Router';

const RoutedAnchor = ({ active, path, site, ...rest }) => {
  const { path: activePath, push } = React.useContext(RouterContext);
  const idPath = site.id ? `${path}?id=${encodeURIComponent(site.id)}` : path;
  return (
    <Anchor
      href={idPath}
      color={active || activePath === path ? 'brand' : undefined}
      onClick={
        idPath
          ? event => {
              event.preventDefault();
              push(idPath);
            }
          : undefined
      }
      {...rest}
    />
  );
};

RoutedAnchor.propTypes = {
  path: PropTypes.string.isRequired,
};

export default RoutedAnchor;
