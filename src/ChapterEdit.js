import React from 'react';
import { Box, Button, FormField, TextArea, TextInput } from 'grommet';
import { Trash } from 'grommet-icons';
import { RouterContext } from './Router';
import Scope from './components/Scope';

export default ({ path, site, onChange }) => {
  const { replace } = React.useContext(RouterContext);
  const [confirmDelete, setConfirmDelete] = React.useState();
  const chapter = site.chapters[path];
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
                    value={chapter.name || ''}
                    onChange={(event) => {
                      const nextSite = JSON.parse(JSON.stringify(site));
                      nextSite.chapters[chapter.path].name = event.target.value;
                      onChange(nextSite);
                    }}
                  />
                </FormField>
                <FormField htmlFor="path" label="Path">
                  <TextInput
                    id="path"
                    name="path"
                    plain
                    value={chapter.path || ''}
                    onChange={(event) => {
                      const path = event.target.value;
                      const nextSite = JSON.parse(JSON.stringify(site));
                      nextSite.chapters[path] = nextSite.chapters[chapter.path];
                      nextSite.chapters[path].path = path;
                      delete nextSite.chapters[chapter.path];
                      const index = nextSite.chapterOrder.indexOf(chapter.path);
                      nextSite.chapterOrder[index] = path;
                      onChange(nextSite);
                      replace(path);
                    }}
                  />
                </FormField>
              </Box>
              <Box alignSelf="start" align="start" gap="small">
                {confirmDelete && (
                  <Button
                    label="Confirm Delete"
                    icon={<Trash />}
                    color="status-critical"
                    onClick={() => {
                      const nextSite = JSON.parse(JSON.stringify(site));
                      // delete all pages in this chapter
                      chapter.pageOrder.forEach(pagePath =>
                        delete nextSite.pages[pagePath]);
                      delete nextSite.chapters[path];
                      nextSite.chapterOrder =
                      nextSite.chapterOrder.filter(p => p !== path);
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
                value={chapter.content || ''}
                onChange={(event) => {
                  const nextSite = JSON.parse(JSON.stringify(site));
                  nextSite.chapters[chapter.path].content = event.target.value;
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
