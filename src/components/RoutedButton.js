import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'grommet';
import { RouterContext } from '../Router';

const RoutedButton = ({ path, showActive = true, ...rest }) => {
  const { path: activePath, push } = React.useContext(RouterContext);
  return (
    <Button
      {...rest}
      href={path}
      active={showActive && activePath === path}
      onClick={path ? (event) => {
        event.preventDefault();
        push(path);
      } : undefined}
      style={{ lineHeight: 0 }}
    />
  );
}

RoutedButton.propTypes = {
  path: PropTypes.string.isRequired,
};

export default RoutedButton;
