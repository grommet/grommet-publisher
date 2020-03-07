import React from 'react';
import { ThemeContext } from 'styled-components';
import { Box, Grid, Text } from 'grommet';
import RoutedButton from './RoutedButton';

const colorNameExp = new RegExp('graph');

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
      <Grid columns="small" gap="large">
        {routes.map((route, index) => (
          <RoutedButton key={route.path} path={route.path} plain>
            {({ hover }) => (
              <Box
                pad="medium"
                background={{
                  color: colors[index % colors.length],
                  opacity: hover ? 'strong' : undefined,
                }}
                round
                align="center"
              >
                <Text size="large" weight="bold">
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
