import React from 'react';
import { Box, FormField, TextArea, TextInput } from 'grommet';
import Scope from './components/Scope';

export default ({ site, onChange }) => (
  <Scope scopes={['content', 'details']}>
    {(scope) => {
      if (scope === 'details') {
        return (
          <Box flex={false} pad="small">
            <FormField htmlFor="name" label="Name">
              <TextInput
                id="name"
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
            <FormField htmlFor="themeLight" label="Light Theme">
              <TextInput
                id="themeLight"
                name="themeLight"
                plain
                value={site.themeLight || ''}
                onChange={(event) => {
                  const nextSite = JSON.parse(JSON.stringify(site));
                  nextSite.themeLight = event.target.value;
                  onChange(nextSite);
                }}
              />
            </FormField>
            <FormField htmlFor="themeDark" label="Dark Theme">
              <TextInput
                id="themeDark"
                name="themeDark"
                plain
                value={site.themeDark || ''}
                onChange={(event) => {
                  const nextSite = JSON.parse(JSON.stringify(site));
                  nextSite.themeDark = event.target.value;
                  onChange(nextSite);
                }}
              />
            </FormField>
            <FormField htmlFor="logo" label="Logo" help="raw <svg /> or a URL">
              <TextArea
                id="logo"
                name="logo"
                plain
                value={site.logo || ''}
                onChange={(event) => {
                  const nextSite = JSON.parse(JSON.stringify(site));
                  nextSite.logo = event.target.value;
                  onChange(nextSite);
                }}
              />
            </FormField>
            <FormField htmlFor="copyright" label="Copyright">
              <TextInput
                id="copyright"
                name="copyright"
                plain
                value={site.copyright || ''}
                onChange={(event) => {
                  const nextSite = JSON.parse(JSON.stringify(site));
                  nextSite.copyright = event.target.value;
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
