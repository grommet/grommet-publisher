import React from 'react';
import { ThemeContext } from 'styled-components';
import { Box, Grid, Text } from 'grommet';
import RoutedButton from './RoutedButton';

const colorNameExp = new RegExp('graph');

const textSizeMap = {
  small: 'medium',
  medium: 'large',
  large: 'xlarge',
};

const Cards = ({ overlay, routes = [], size, ...rest }) => {
  const theme = React.useContext(ThemeContext);
  const colors = Object.keys(theme.global.colors).filter(c =>
    colorNameExp.test(c),
  );
  return (
    <Box
      flex={false}
      margin={overlay ? 'xlarge' : { vertical: 'large' }}
      {...rest}
    >
      <Grid columns="small" gap="large" align="stretch">
        {routes.map((route, index) => (
          <RoutedButton key={route.path} path={route.path} plain>
            {({ hover }) => (
              <Box
                pad={size}
                background={{
                  color: colors[index % colors.length],
                  opacity: hover ? 'strong' : undefined,
                }}
                fill
                round
                align="center"
                justify="center"
              >
                <Text size={textSizeMap[size]} weight="bold" textAlign="center">
                  {route.name}
                </Text>
              </Box>
            )}
          </RoutedButton>
        ))}
      </Grid>
    </Box>
  );
};

export default Cards;
