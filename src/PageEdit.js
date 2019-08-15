import React from 'react';
import { Box, Button, FormField, TextArea, TextInput } from 'grommet';
import { Trash } from 'grommet-icons';
import Scope from './Scope';
import { pageSection } from './site';

export default ({ path, site, onChange }) => {
  const [confirmDelete, setConfirmDelete] = React.useState();
  const page = site.pages[path];
  const section = pageSection(site, path);
  return (
    <Scope scopes={['content', 'details']}>
      {(scope) => {
        if (scope === 'details') {
          return (
            <Box flex="grow" pad="small">
              <Box flex="grow">
                <FormField htmlFor="name" label="Name">
                  <TextInput
                    id="name"
                    name="name"
                    plain
                    value={page.name || ''}
                    onChange={(event) => {
                      const nextSite = JSON.parse(JSON.stringify(site));
                      nextSite.pages[page.path].name = event.target.value;
                      onChange(nextSite);
                    }}
                  />
                </FormField>
                <FormField htmlFor="path" label="Path">
                  <TextInput
                    id="path"
                    name="path"
                    plain
                    value={page.path || ''}
                    onChange={(event) => {
                      const path = event.target.value;
                      const nextSite = JSON.parse(JSON.stringify(site));
                      nextSite.pages[path] = nextSite.pages[page.path];
                      nextSite.pages[path].path = path;
                      delete nextSite.pages[page.path];
                      onChange(nextSite);
                      // TODO: push history to new path
                    }}
                  />
                </FormField>
              </Box>
              <Box gap="small">
                {confirmDelete && (
                  <Button
                    label="Confirm Delete"
                    icon={<Trash />}
                    color="status-critical"
                    onClick={() => {
                      const nextSite = JSON.parse(JSON.stringify(site));
                      delete nextSite.pages[path];
                      const nextSection = nextSite.sections[section.path];
                      nextSection.pageOrder =
                        nextSection.pageOrder.filter(p => p !== path);
                      onChange(nextSite);
                    }}
                  />
                )}
                <Button
                  label="Delete"
                  icon={<Trash />}
                  color="status-critical"
                  onClick={() => setConfirmDelete(!confirmDelete)}
                />
              </Box>
            </Box>
          );
        } else if (scope === 'content') {
          return (
            <Box flex pad="small">   
              <TextArea
                id="content"
                name="content"
                fill
                value={page.content || ''}
                onChange={(event) => {
                  const nextSite = JSON.parse(JSON.stringify(site));
                  nextSite.pages[page.path].content = event.target.value;
                  onChange(nextSite);
                }}
              />
            </Box>
          );
        }
      }}
    </Scope>
  )
}
