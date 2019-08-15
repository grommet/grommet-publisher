import React from 'react';
import { Box, Button } from 'grommet';

export default ({ children, scopes }) => {
  const [activeScope, setActiveScope] = React.useState(scopes[0]);
  return (
    <Box background="light-2" fill overflow="auto">
      <Box direction="row" align="center" background="light-4">
        {scopes.map(scope => (
          <Button key={scope} hoverIndicator onClick={() => setActiveScope(scope)}>
            <Box
              pad="small"
              background={scope === activeScope ? 'light-2' : undefined}
            >
              {scope}
            </Box>
          </Button>
        ))}
      </Box>
      {children(activeScope)}
    </Box>
  )
}
