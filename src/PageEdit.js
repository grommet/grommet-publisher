import React from 'react';
import { Box, Button, FormField, TextArea, TextInput } from 'grommet';
import { Trash } from 'grommet-icons';
import { RouterContext } from './Router';
import Scope from './components/Scope';
import { pageChapter } from './site';

export default ({ path, site, onChange }) => {
  const { replace } = React.useContext(RouterContext);
  const [tmpPath, setTmpPath] = React.useState(path);
  const debounceTimer = React.useRef();
  const [confirmDelete, setConfirmDelete] = React.useState();
  const page = site.pages[path];
  const chapter = pageChapter(site, path);

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
                    value={tmpPath || page.path || ''}
                    onChange={(event) => {
                      const path = event.target.value;
                      // debounce so we avoid replace() while the user types
                      setTmpPath(path);
                      clearTimeout(debounceTimer.current);
                      debounceTimer.current = setTimeout(() => {
                        // first add new path
                        let nextSite = JSON.parse(JSON.stringify(site));
                        nextSite.pages[path] = JSON.parse(JSON.stringify(nextSite.pages[page.path]));
                        nextSite.pages[path].path = path;
                        const index = nextSite.chapters[chapter.path].pageOrder.indexOf(page.path);
                        nextSite.chapters[chapter.path].pageOrder.splice(index, 0, path);
                        onChange(nextSite);
                        replace(path);
                        // then remove old path
                        nextSite = JSON.parse(JSON.stringify(nextSite));
                        delete nextSite.pages[page.path];
                        nextSite.chapters[chapter.path].pageOrder.splice(index + 1, 1);
                        onChange(nextSite);
                      }, 1000);
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
                      delete nextSite.pages[path];
                      const nextChapter = nextSite.chapters[chapter.path];
                      nextChapter.pageOrder =
                        nextChapter.pageOrder.filter(p => p !== path);
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
