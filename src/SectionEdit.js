import React from 'react';
import { Box, Button, FormField, TextArea, TextInput } from 'grommet';
import { Trash } from 'grommet-icons';
import Scope from './Scope';

export default ({ path, site, onChange }) => {
  const [confirmDelete, setConfirmDelete] = React.useState();
  const section = site.sections[path];
  return (
    <Scope scopes={['content', 'details']}>
      {(scope) => {
        if (scope === 'details') {
          return (
            <Box flex="grow" pad="small">
              <Box flex="grow">
                <FormField htmlFor="name" label="Name">
                  <TextInput
                    name="name"
                    plain
                    value={section.name || ''}
                    onChange={(event) => {
                      const nextSite = JSON.parse(JSON.stringify(site));
                      nextSite.pages[section.path].name = event.target.value;
                      onChange(nextSite);
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
                      // delete all pages in this section
                      section.pageOrder.forEach(pagePath =>
                        delete nextSite.pages[pagePath]);
                      delete nextSite.sections[path];
                      nextSite.sectionOrder =
                      nextSite.sectionOrder.filter(p => p !== path);
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
                value={section.content || ''}
                onChange={(event) => {
                  const nextSite = JSON.parse(JSON.stringify(site));
                  nextSite.sections[section.path].content = event.target.value;
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
