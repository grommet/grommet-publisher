import React from 'react';
import { Box, FormField, TextArea, TextInput } from 'grommet';
import Scope from './Scope';

export default ({ site, onChange }) => (
  <Scope scopes={['content', 'details']}>
    {(scope) => {
      if (scope === 'details') {
        return (
          <Box flex={false} pad="small">
            <FormField htmlFor="name" label="Name">
              <TextInput
                name="name"
                plain
                value={site.name || ''}
                onChange={(event) => {
                  const nextSite = JSON.parse(JSON.stringify(site));
                  nextSite.name = event.target.value;
                  onChange(nextSite);
                }}
              />
            </FormField>
            <FormField htmlFor="theme" label="Theme">
              <TextInput
                name="theme"
                plain
                value={site.theme || ''}
                onChange={(event) => {
                  const nextSite = JSON.parse(JSON.stringify(site));
                  nextSite.theme = event.target.value;
                  onChange(nextSite);
                }}
              />
            </FormField>
          </Box>
        );
      } else if (scope === 'content') {
        return (
          <Box flex pad="small">   
            <TextArea
              id="content"
              name="content"
              fill
              value={site.content || ''}
              onChange={(event) => {
                const nextSite = JSON.parse(JSON.stringify(site));
                nextSite.content = event.target.value;
                onChange(nextSite);
              }}
            />
          </Box>
        );
      }
    }}
  </Scope>
)
