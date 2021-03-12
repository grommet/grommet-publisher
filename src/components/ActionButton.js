import React from 'react';
import { Box, Button } from 'grommet';

const ActionButton = (props) => (
  <Box flex={false}>
    <Button hoverIndicator {...props} />
  </Box>
);

export default ActionButton;
