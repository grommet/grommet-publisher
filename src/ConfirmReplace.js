import React from 'react';
import { Box, Button, Layer, Paragraph, Text } from 'grommet';

const ConfirmReplace = ({ site, nextSite, onDone }) => (
  <Layer
    position="top"
    margin="medium"
    modal
    onEsc={() => onDone(undefined)}
    onClickOutside={() => onDone(undefined)}
  >
    <Box pad="large">
      <Paragraph>
        You already have a site named <Text weight="bold">{site.name}</Text>. If
        you make a change, you will replace your local copy. If you do not want
        to replace your copy, you should rename this site.
      </Paragraph>
      <Box direction="row" align="center" gap="medium">
        <Button
          label={`Replace my ${site.name}`}
          onClick={() => {
            nextSite.derivedFromId = site.id;
            nextSite.local = true;
            onDone(nextSite);
          }}
        />
        <Button label="Discard change" onClick={() => onDone(undefined)} />
      </Box>
    </Box>
  </Layer>
);

export default ConfirmReplace;
