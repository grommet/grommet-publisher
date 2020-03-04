import React from 'react';
import { Box, Button, FormField, TextArea, TextInput } from 'grommet';
import { Trash } from 'grommet-icons';
import { RouterContext } from './Router';
import Scope from './components/Scope';
import { changeChapterPath, slugify } from './site';

export default ({ path, site, onChange }) => {
  const { replace } = React.useContext(RouterContext);
  const [tmpPath, setTmpPath] = React.useState(path || '');
  React.useEffect(() => setTmpPath(path), [path]);
  const [confirmDelete, setConfirmDelete] = React.useState();
  const chapter = site.chapters[path];

  // lazily handle changing the path, since it's a but complicated
  React.useEffect(() => {
    if (path !== tmpPath) {
      const timer = setTimeout(() => {
        const nextSite = JSON.parse(JSON.stringify(site));
        changeChapterPath(nextSite, path, tmpPath);
        onChange(nextSite);
        replace(tmpPath);
      }, 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [onChange, path, replace, site, tmpPath]);

  return (
    <Scope scopes={['content', 'details']}>
      {scope => {
        if (scope === 'details') {
          return (
            <Box flex="grow" pad="small">
              <Box flex="grow">
                <FormField htmlFor="name" label="Name">
                  <TextInput
                    name="name"
                    plain
                    value={chapter.name || ''}
                    onChange={event => {
                      const nextName = event.target.value;
                      const nextSite = JSON.parse(JSON.stringify(site));
                      nextSite.chapters[chapter.path].name = nextName;
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
                    value={tmpPath || ''}
                    onChange={event => setTmpPath(event.target.value)}
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
                      chapter.pageOrder.forEach(
                        pagePath => delete nextSite.pages[pagePath],
                      );
                      delete nextSite.chapters[path];
                      nextSite.chapterOrder = nextSite.chapterOrder.filter(
                        p => p !== path,
                      );
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
                onChange={event => {
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
  );
};
