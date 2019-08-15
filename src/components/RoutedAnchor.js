import React from 'react';
import PropTypes from 'prop-types';
import { Anchor } from 'grommet';
import { RouterContext } from '../Router';

const RoutedAnchor = ({ path, ...rest }) => {
  const { path: activePath, push } = React.useContext(RouterContext);
  return (
    <Anchor
      href={path}
      active={activePath === path}
      onClick={path ? (event) => {
        event.preventDefault();
        push(path);
      } : undefined}
      {...rest}
    />
  );
}

RoutedAnchor.propTypes = {
  path: PropTypes.string.isRequired,
};

export default RoutedAnchor;
