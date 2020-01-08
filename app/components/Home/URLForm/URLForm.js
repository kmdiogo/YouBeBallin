// @flow
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import ytdl from "ytdl-core";
import PropTypes from 'prop-types';
const { clipboard } = require('electron').remote;

export default function URLForm(props) {
  const [urlValue, setUrlValue] = useState("");
  function handleURLChange(value) {
    const url = value.trim();
    setUrlValue(url);

    if (!ytdl.validateURL(url)) return;
    props.onValidURL(url);
  }
  function handleInputFocus() {
    const cbContent = clipboard.readText().trim();
    if (ytdl.validateURL(cbContent)) {
      handleURLChange(cbContent);
    }
  }
  return (
    <Form className="w-100">
      <Form.Group>
        <Form.Label>Youtube URL:</Form.Label>
        <Form.Control onChange={e => {handleURLChange(e.target.value)}} onFocus={handleInputFocus} value={urlValue} />
        <Form.Text className="text-muted">
          Enter in the YouTube video's url here to begin.
        </Form.Text>
      </Form.Group>
    </Form>
  );
}

URLForm.propTypes = {
  onValidURL: PropTypes.func
};
