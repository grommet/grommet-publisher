import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'grommet';
import { RouterContext } from '../Router';

const RoutedButton = ({ path, showActive = true, site, ...rest }) => {
  const { path: activePath, push } = React.useContext(RouterContext);
  const idPath = site.id ? `${path}?id=${encodeURIComponent(site.id)}` : path;
  return (
    <Button
      {...rest}
      href={idPath}
      active={showActive && activePath === path}
      onClick={
        idPath
          ? event => {
              event.preventDefault();
              push(idPath);
            }
          : undefined
      }
    />
  );
};

RoutedButton.propTypes = {
  path: PropTypes.string.isRequired,
};

export default RoutedButton;
