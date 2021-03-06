import React, { Component } from 'react';
import styled from 'styled-components';
import {
  Box,
  Button,
  Heading,
  Image,
  Markdown,
  Paragraph,
  Text,
} from 'grommet';

const Section = ({ background, ...rest }) => (
  <Box
    pad="xlarge"
    align="start"
    background={
      background && background.slice && background.slice(0, 4) === 'http'
        ? `url(${background})`
        : background
    }
    {...rest}
  />
);

const Pre = styled.pre`
  white-space: pre-wrap;
  overflow-wrap: break-word;
`;

export default class Content extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.children !== nextProps.children) {
      return { children: nextProps.children, error: undefined };
    }
    return null;
  }

  state = {};

  componentDidCatch(error) {
    this.setState({ error: true });
  }

  render() {
    const { fill, size, ...rest } = this.props;
    const { error } = this.state;

    if (error)
      return (
        <Box flex align="center" justify="center">
          <Text color="status-critical">
            Oops, looks like we can't render the current content.
          </Text>
        </Box>
      );

    return (
      <Markdown
        components={{
          h1: {
            component: Heading,
            props: { level: 1, size },
          },
          h2: {
            component: Heading,
            props: { level: 2, size },
          },
          h3: {
            component: Heading,
            props: { level: 3, size },
          },
          h4: {
            component: Heading,
            props: { level: 4, size },
          },
          p: {
            component: Paragraph,
            props: { size, fill: true },
          },
          img: {
            component: Image,
            props: { fit: 'contain', style: { maxWidth: '100%' } },
          },
          pre: {
            component: Pre,
          },
          Section: { component: Section },
          // Box: { component: Box },
          Button: {
            component: Button,
            props: { primary: true },
          },
          Heading: { component: Heading },
          Paragraph: { component: Paragraph },
          Text: { component: Text },
        }}
        {...rest}
      />
    );
  }
}
