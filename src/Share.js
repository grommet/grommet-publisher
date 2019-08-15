import React, { Fragment } from 'react';
import {
  Box, Button, Form, FormField, Grid, Heading, MaskedInput, Paragraph,
  Text, TextInput
} from 'grommet';
import { CloudUpload, Copy, Download } from 'grommet-icons';
import { apiUrl } from './site';
import Action from './components/Action';

const Summary = ({ Icon, label, guidance }) => (
  <Box align="center" gap="small">
    <Icon size="large" />
    <Heading level={3} margin="none">{label}</Heading>
    <Paragraph textAlign="center">{guidance}</Paragraph>
  </Box>
);

const Publish = ({ site, onChange }) => {
  const [publication, setPublication] = React.useState();
  const [uploadUrl, setUploadUrl] = React.useState();
  const [message, setMessage] = React.useState();
  const [error, setError] = React.useState();
  const inputRef = React.useRef();

  React.useEffect(() => {
    const stored = localStorage.getItem('identity');
    if (stored) {
      const identity = JSON.parse(stored);
      setPublication({ ...identity, name: site.name });
    } else {
      setPublication({ name: site.name });
    }
  }, [site]);

  const onPublish = ({ value: { name, email, pin } }) => {
    // remember email and pin in local storage so we can use later
    localStorage.setItem('identity', JSON.stringify({ email, pin }));

    // add some metadata to the site
    const nextSite = JSON.parse(JSON.stringify(site));
    nextSite.email = email;
    const date = new Date();
    date.setMilliseconds(pin);
    nextSite.date = date.toISOString();

    const body = JSON.stringify(nextSite);
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Content-Length': body.length,
      },
      body,
    })
    .then((response) => {
      if (response.ok) {
        setError(undefined);
        return response.text()
          .then(id => {
            const nextUploadUrl = [
              window.location.protocol,
              '//',
              window.location.host,
              window.location.pathname,
              `?id=${encodeURIComponent(id)}`,
              window.location.hash,
            ].join('');
            setUploadUrl(nextUploadUrl);
          });
      }
      return response.text().then(setError);
    })
    .catch(e => setError(e.message));

    onChange({ site: nextSite });
  }

  const onCopy = () => {
    inputRef.current.select();
    document.execCommand('copy');
    setMessage('copied to clipboard!');
  }

  return (
    <Box>
      <Summary Icon={CloudUpload} label="Publish" guidance={`
        Publishing your site will generate a URL
        that you can send to others so they can see it.
        We use your email and PIN # so nobody else can modify your copy.
        They will be able to create their own site based on it.
      `} />
      <Form value={publication} onSubmit={onPublish}>
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
          <Button type="submit" label="Publish" />
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
    </Box>
  );
};

const SaveLocally = ({ site, onClose }) => (
  <Box align="center">
    <Summary Icon={Download} label="Download" guidance={`
      Download the site to a JSON file. You can use this as a separate
      backup copy, inspect and transform it with a program, or share
      it with someone else. You can upload it via the top left control
      that shows all of your sites.
    `} />
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
  <Action
    label="share"
    animation="fadeIn"
    onClose={onClose}
  >
    <Grid fill columns={{ count: 'fit', size: "small" }} gap="large">
      <Publish site={site} onChange={onChange} />
      <SaveLocally site={site} onClose={onClose} />
    </Grid>
  </Action>
);

export default Share;
