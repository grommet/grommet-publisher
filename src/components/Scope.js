import React from 'react';
import { Box, Button } from 'grommet';

export default ({ children, scopes }) => {
  const [activeScope, setActiveScope] = React.useState(scopes[0]);

  React.useEffect(() => {
    setActiveScope(localStorage.getItem('scope') || scopes[0]);
  }, [scopes]);

  return (
    <Box flex={false} background="light-2" fill overflow="auto">
      <Box flex={false} direction="row" align="center" background="light-4">
        {scopes.map(scope => (
          <Button
            key={scope}
            hoverIndicator
            onClick={() => {
              setActiveScope(scope);
              localStorage.setItem('scope', scope);
            }}
          >
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
  );
};
