import React, { Fragment } from 'react';
import {
  Box,
  Button,
  Form,
  FormField,
  Grid,
  Heading,
  MaskedInput,
  Paragraph,
  Text,
  TextInput,
} from 'grommet';
import { CloudUpload, Copy, Download } from 'grommet-icons';
import { publish } from '../site';
import Action from '../components/Action';

const Summary = ({ Icon, label, guidance }) => (
  <Box align="center" gap="small">
    <Icon size="large" />
    <Heading level={3} margin="none">
      {label}
    </Heading>
    <Paragraph textAlign="center">{guidance}</Paragraph>
  </Box>
);

const Publish = ({ site, onChange }) => {
  const [publication, setPublication] = React.useState();
  const [publishing, setPublishing] = React.useState();
  const [uploadUrl, setUploadUrl] = React.useState();
  const [message, setMessage] = React.useState();
  const [error, setError] = React.useState();
  const inputRef = React.useRef();

  React.useEffect(() => {
    let stored = localStorage.getItem(`${site.name}--identity`);
    if (stored) {
      const identity = JSON.parse(stored);
      setPublication({ ...identity, name: site.name });
    } else {
      stored = localStorage.getItem('identity');
      if (stored) {
        const identity = JSON.parse(stored);
        setPublication({ ...identity, name: site.name });
      } else {
        setPublication({ name: site.name });
      }
    }
  }, [site]);

  const onPublish = ({ value: { name, email, pin } }) => {
    setPublishing(true);
    // remember email and pin in local storage so we can use later
    localStorage.setItem(
      `${site.name}--identity`,
      JSON.stringify({ email, pin }),
    );
    publish({
      site,
      email,
      pin,
      onChange: (nextSite) => {
        setPublishing(false);
        setUploadUrl(nextSite.publishedUrl);
        onChange(nextSite);
      },
      onError: (error) => {
        setPublishing(false);
        setError(error);
      },
    });
  };

  const onCopy = () => {
    inputRef.current.select();
    document.execCommand('copy');
    setMessage('copied to clipboard!');
  };

  return (
    <Box flex={false}>
      <Summary
        Icon={CloudUpload}
        label="Publish"
        guidance={`
        Publishing your site will generate a URL
        that you can send to others so they can see it.
        We use your email and PIN # so nobody else can modify your copy.
        They will be able to create their own site based on it.
      `}
      />
      <Form
        value={publication}
        onChange={({ value }) => setPublication(value)}
        onSubmit={onPublish}
      >
        <FormField
          name="email"
          label="Email"
          required
          validate={{ regexp: /\w+@\w+\.\w+/ }}
        />
        <FormField
          name="pin"
          label="PIN"
          required
          validate={{ regexp: /\d{3}/, message: 'three digits' }}
          error={error}
          component={MaskedInput}
          type="password"
          mask={[
            {
              length: 3,
              regexp: /^\d{1,3}$/,
              placeholder: '###',
            },
          ]}
        />
        <Box align="center" margin="medium">
          <Button type="submit" label="Publish" disabled={publishing} />
        </Box>
      </Form>
      {uploadUrl && (
        <Fragment>
          <Box direction="row">
            <TextInput ref={inputRef} value={uploadUrl} />
            <Button
              icon={<Copy />}
              title="Copy URL"
              hoverIndicator
              onClick={onCopy}
            />
          </Box>
          <Box>
            <Text textAlign="end">{message}&nbsp;</Text>
          </Box>
        </Fragment>
      )}
      {site.date && (
        <Box>
          <Text size="small" color="text-xweak">
            Last published {new Date(site.date).toLocaleString()}
          </Text>
          {site.publishedUrl && (
            <Text size="small" color="text-xweak">
              {site.publishedUrl}
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
};

const SaveLocally = ({ site, onClose }) => (
  <Box flex={false} align="center">
    <Summary
      Icon={Download}
      label="Download"
      guidance={`
      Download the site to a JSON file. You can use this as a separate
      backup copy, inspect and transform it with a program, or share
      it with someone else. You can upload it via the top left control
      that shows all of your sites.
    `}
    />
    <Button
      label="Download"
      hoverIndicator
      href={`data:application/json;charset=utf-8,${JSON.stringify(site)}`}
      download={`${site.name || 'design'}.json`}
      onClick={onClose}
    />
  </Box>
);

const Share = ({ site, onChange, onClose }) => (
  <Action label="share" full="horizontal" animation="fadeIn" onClose={onClose}>
    <Grid fill="horizontal" columns="medium" gap="large">
      <Publish site={site} onChange={onChange} />
      <SaveLocally site={site} onClose={onClose} />
    </Grid>
  </Action>
);

export default Share;
