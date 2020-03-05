import React from 'react';
import { Box, Grid } from 'grommet';
import RoutedButton from './RoutedButton';

const Cards = ({ routes = [], size, ...rest }) => {
  return (
    <Box flex={false} margin={{ vertical: 'large' }} {...rest}>
      <Grid columns="small" gap="large">
        {routes.map(r => (
          <RoutedButton key={r.path} label={r.name} path={r.path} size={size} />
        ))}
      </Grid>
    </Box>
  );
};

export default Cards;
