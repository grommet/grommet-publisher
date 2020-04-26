import React from 'react';
import { Box } from 'grommet';
import { Document } from 'grommet-icons';

export default () => (
  <Box fill justify="center" align="center" margin="xlarge">
    <Box animation="pulse">
      <Document size="xlarge" />
    </Box>
  </Box>
);
