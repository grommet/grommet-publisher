import React, { Fragment } from 'react';
import { Box, Button, Text } from 'grommet';
import { Apps, FormAdd, Share } from 'grommet-icons';
import { RouterContext } from '../Router';
import ActionButton from '../components/ActionButton';
import RoutedButton from '../components/RoutedButton';
import Sites from './Sites';
import Sharer from './Share';

const Actioner = ({ Icon, Modal, site, onChange, ...rest }) => {
  const [show, setShow] = React.useState();
  return (
    <Fragment>
      <ActionButton
        icon={<Icon />}
        hoverIndicator
        onClick={() => setShow(true)}
        {...rest}
      />
      {show && (
        <Modal site={site} onChange={onChange} onClose={() => setShow(false)} />
      )}
    </Fragment>
  );
}

const Nav = ({ site, onChange }) => {
  const { push } = React.useContext(RouterContext);
  return (
    <Box fill="vertical" overflow="auto" background="dark-1" border="right" >
      <Box
        flex={false}
        direction="row"
        justify="between"
        border="bottom"
      >
        <Actioner
          title="choose another site"
          Icon={Apps}
          Modal={Sites}
          site={site}
          onChange={onChange}
        />
        <Box flex>
          <RoutedButton fill path="/" hoverIndicator>
            <Box fill direction="row" align="center" pad="small">
              <Text size="small" truncate>
                {site.name}
              </Text>
            </Box>
          </RoutedButton>
        </Box>
        <Actioner
          Icon={Share}
          Modal={Sharer}
          site={site}
          onChange={onChange}
        />
      </Box>
      <Box flex={false}>
        {site.chapterOrder.map(path => site.chapters[path])
          .filter(chapter => chapter)
          .map(chapter => (
            <Box key={chapter.path} flex={false}>
              <RoutedButton path={chapter.path} hoverIndicator>
                <Box pad={{ horizontal: 'small', vertical: 'xsmall' }}>
                  <Text size="small">{chapter.name}</Text>
                </Box>
              </RoutedButton>
              <Box flex={false} margin={{ left: 'small' }}>
                {chapter.pageOrder.map(path => site.pages[path])
                  .filter(page => page)
                  .map(page => (
                    <RoutedButton
                      key={page.path}
                      path={page.path}
                      hoverIndicator
                    >
                      <Box pad={{ horizontal: 'small', vertical: 'xsmall' }}>
                        <Text size="small">{page.name}</Text>
                      </Box>
                    </RoutedButton>
                  ))
                }
                <Button
                  title="add a page"
                  hoverIndicator
                  onClick={() => {
                    const nextSite = JSON.parse(JSON.stringify(site));
                    const id = Object.keys(nextSite.pages).length;
                    const nextPage = {
                      name: `page ${id}`,
                      path: `/page-${id}`,
                      content: `# Page ${id}`,
                    }
                    nextSite.pages[nextPage.path] = nextPage;
                    const nextChapter = nextSite.chapters[chapter.path];
                    nextChapter.pageOrder.push(nextPage.path);
                    onChange(nextSite);
                    push(nextPage.path);
                  }}
                >
                  <Box pad={{ horizontal: 'xsmall' }}>
                    <FormAdd color="dark-4" />
                  </Box>
                </Button>
              </Box>
            </Box>
          ))
        }
        <Button
          title="add a chapter"
          hoverIndicator
          onClick={() => {
            const nextSite = JSON.parse(JSON.stringify(site));
            const id = Object.keys(nextSite.chapters).length;
            const nextChapter = {
              name: `chapter ${id}`,
              path: `/chapter-${id}`,
              content: `# Chapter ${id}`,
              pageOrder: [],
            }
            nextSite.chapters[nextChapter.path] = nextChapter;
            nextSite.chapterOrder.push(nextChapter.path);
            onChange(nextSite);
            push(nextChapter.path);
          }}
        >
          <Box pad={{ horizontal: 'xsmall' }}>
            <FormAdd color="dark-4" />
          </Box>
        </Button>
      </Box>
    </Box>
  );
}

export default Nav;
