import React, { Fragment } from 'react';
import { Box, Button, Text } from 'grommet';
import { Apps, FormAdd, Share } from 'grommet-icons';
import { RouterContext } from '../Router';
import ActionButton from '../components/ActionButton';
import RoutedButton from '../components/RoutedButton';
import Sites from './Sites';
import Sharer from './Share';

const Actioner = ({ Icon, Modal, site, onChange }) => {
  const [show, setShow] = React.useState();
  return (
    <Fragment>
      <ActionButton icon={<Icon />} hoverIndicator onClick={() => setShow(true)} />
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
        {site.sectionOrder.map(path => site.sections[path])
          .filter(section => section)
          .map(section => (
            <Box key={section.path} flex={false}>
              <RoutedButton path={section.path} hoverIndicator>
                <Box pad={{ horizontal: 'small', vertical: 'xsmall' }}>
                  <Text size="small">{section.name}</Text>
                </Box>
              </RoutedButton>
              <Box flex={false} margin={{ left: 'small' }}>
                {section.pageOrder.map(path => site.pages[path])
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
                    const nextSection = nextSite.sections[section.path];
                    nextSection.pageOrder.push(nextPage.path);
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
          title="add a section"
          hoverIndicator
          onClick={() => {
            const nextSite = JSON.parse(JSON.stringify(site));
            const id = Object.keys(nextSite.sections).length;
            const nextSection = {
              name: `section ${id}`,
              path: `/section-${id}`,
              content: `# Section ${id}`,
              pageOrder: [],
            }
            nextSite.sections[nextSection.path] = nextSection;
            nextSite.sectionOrder.push(nextSection.path);
            onChange(nextSite);
            push(nextSection.path);
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
