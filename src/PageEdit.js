import React from 'react';
import { Box, Button, FormField, TextArea, TextInput } from 'grommet';
import { Down, Trash, Up } from 'grommet-icons';
import { RouterContext } from './Router';
import Scope from './components/Scope';
import { changePagePath, pageChapter, slugify } from './site';

export default ({ path, site, onChange }) => {
  const { replace } = React.useContext(RouterContext);
  const [tmpPath, setTmpPath] = React.useState(path || '');
  const [confirmDelete, setConfirmDelete] = React.useState();
  const page = site.pages[path];
  const chapter = pageChapter(site, path);

  // lazily handle changing the path, since it's a bit complicated
  React.useEffect(() => {
    if (path !== tmpPath) {
      const timer = setTimeout(() => {
        const nextSite = JSON.parse(JSON.stringify(site));
        changePagePath(nextSite, path, tmpPath);
        onChange(nextSite);
        replace(tmpPath);
      }, 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [chapter.path, onChange, path, replace, site, tmpPath]);

  return (
    <Scope scopes={['content', 'details']}>
      {scope => {
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
                    onChange={event => {
                      const nextName = event.target.value;
                      const nextSite = JSON.parse(JSON.stringify(site));
                      nextSite.pages[page.path].name = nextName;
                      setTmpPath(slugify(nextName));
                      onChange(nextSite);
                    }}
                  />
                </FormField>
                <FormField htmlFor="path" label="Path">
                  <TextInput
                    id="path"
                    name="path"
                    plain
                    value={tmpPath}
                    onChange={event => setTmpPath(event.target.value)}
                  />
                </FormField>
              </Box>
              <Box direction="row" justify="between">
                <Box direction="row">
                  <Button
                    icon={<Up />}
                    hoverIndicator
                    onClick={() => {
                      const nextSite = JSON.parse(JSON.stringify(site));
                      const nextChapter = pageChapter(nextSite, path);
                      const index = nextChapter.pageOrder.indexOf(path);
                      if (index > 0) {
                        nextChapter.pageOrder[index] =
                          nextChapter.pageOrder[index - 1];
                        nextChapter.pageOrder[index - 1] = path;
                      } else {
                        // look for prior chapter
                        const chapterIndex = nextSite.chapterOrder.indexOf(
                          nextChapter.path,
                        );
                        if (chapterIndex > 0) {
                          const priorChapter =
                            nextSite.chapters[
                              nextSite.chapterOrder[chapterIndex - 1]
                            ];
                          priorChapter.pageOrder.push(path);
                          nextChapter.pageOrder.shift();
                        } // else no place to go up
                      }
                      onChange(nextSite);
                    }}
                  />
                  <Button
                    icon={<Down />}
                    hoverIndicator
                    onClick={() => {
                      const nextSite = JSON.parse(JSON.stringify(site));
                      const nextChapter = pageChapter(nextSite, path);
                      const index = nextChapter.pageOrder.indexOf(path);
                      if (index < nextChapter.pageOrder.length - 1) {
                        nextChapter.pageOrder[index] =
                          nextChapter.pageOrder[index + 1];
                        nextChapter.pageOrder[index + 1] = path;
                      } else {
                        // look for subsequent chapter
                        const chapterIndex = nextSite.chapterOrder.indexOf(
                          nextChapter.path,
                        );
                        if (chapterIndex < nextSite.chapterOrder.length - 1) {
                          const subsChapter =
                            nextSite.chapters[
                              nextSite.chapterOrder[chapterIndex + 1]
                            ];
                          subsChapter.pageOrder.unshift(path);
                          nextChapter.pageOrder.pop();
                        } // else no place to go down
                      }
                      onChange(nextSite);
                    }}
                  />
                </Box>
                <Box direction="row" align="center" gap="small">
                  {confirmDelete && (
                    <Button
                      label="Confirm"
                      icon={<Trash />}
                      color="status-critical"
                      onClick={() => {
                        const nextSite = JSON.parse(JSON.stringify(site));
                        delete nextSite.pages[path];
                        const nextChapter = nextSite.chapters[chapter.path];
                        nextChapter.pageOrder = nextChapter.pageOrder.filter(
                          p => p !== path,
                        );
                        onChange(nextSite);
                      }}
                    />
                  )}
                  <Button
                    icon={<Trash />}
                    hoverIndicator
                    onClick={() => setConfirmDelete(!confirmDelete)}
                  />
                </Box>
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
                onChange={event => {
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
  );
};
