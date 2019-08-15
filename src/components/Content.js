import React, { Component } from 'react';
import { Box, Button, Heading, Image, Markdown, Paragraph, Text } from 'grommet';

export default class Content extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.children !== nextProps.children) {
      return { children: nextProps.children, error: undefined };
    }
    return null;
  }

  state = {}

  componentDidCatch(error) {
    this.setState({ error: true });
  }

  render() {
    const { error } = this.state;

    if (error) return (
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
            props: { size: 'large' },
          },
          img: {
            component: Image,
            props: { fit: 'contain' },
          },
          Button: {
            component: Button,
            props: { primary: true },
          },
          Paragraph: {
            component: Paragraph,
          },
          Text: {
            component: Text,
          },
        }}
        {...this.props}
      />
    );
  }
}
