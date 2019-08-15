import React from 'react';
import { Box, Heading, Layer } from 'grommet';
import { Close } from 'grommet-icons';
import ActionButton from './ActionButton';

const Action = ({ children, label, onClose, ...rest }) => (
  <Layer
    position="top"
    margin="medium"
    modal
    plain
    {...rest}
    onEsc={onClose}
    onClickOutside={onClose}
  >
    <Box flex background="dark-1" elevation="medium">
      <Box flex={false} direction="row" align="center" justify="between">
        <ActionButton
          title='close'
          icon={<Close />}
          hoverIndicator
          onClick={onClose}
        />
        {label && (
          <Heading
            level={2}
            size="small"
            margin={{ vertical: 'none', horizontal: 'small' }}
          >
            {label}
          </Heading>
        )}
      </Box>
      <Box flex pad="medium" align="start" overflow="auto">
        {children}
      </Box>
    </Box>
  </Layer>
);

export default Action;
