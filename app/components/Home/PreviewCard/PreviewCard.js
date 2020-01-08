import React from 'react';
import { Button, Card, Form, Spinner } from 'react-bootstrap';
import { uniq, isEmpty } from 'lodash'
import PropTypes from 'prop-types'


export default function PreviewCard(props) {
  if (props.isLoading) {
    return (
      <Card>
        <Card.Body>
          <Card.Title>
            <Spinner animation="grow" />
          </Card.Title>
        </Card.Body>
      </Card>
    );
  } else if (isEmpty(props.videoInfo)) {
    return <div />;
  }

  const thumbnails = props.videoInfo.player_response.videoDetails.thumbnail.thumbnails;
  return (
    <Card>
      <Card.Img variant="top" src={thumbnails[thumbnails.length-1].url} />
      <Card.Body>
        <Card.Title>
          { props.isLoading ? <Spinner animation="grow" /> : props.videoInfo.title }
        </Card.Title>
        <Card.Text>
          { props.videoInfo.description }
        </Card.Text>

        <Form inline>
          <Form.Group className="mr-auto w-auto">
            <Form.Label className="mr-2">
              File Format
            </Form.Label>
            <Form.Control as="select" className="mr-auto w-auto">
              { uniq(props.videoInfo.formats.map(e => e.container)).map(e => <option key={e}>.{e}</option>) }
            </Form.Control>
          </Form.Group>

          <Button onClick={ () => { props.onDownloadClick(props.videoInfo) } }>Download</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

PreviewCard.propTypes = {
  videoInfo: PropTypes.object,
  isLoading: PropTypes.bool,
  onDownloadClick: PropTypes.func
};
PreviewCard.defaultProps = {
  onDownloadClick: function() {}
};
