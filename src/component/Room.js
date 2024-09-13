import React, { useState } from 'react';
import { Button, Container, Form, Row, Col } from 'react-bootstrap';
import VideoCall from './VideoCall.js';

const Room = () => {
  const [roomId, setRoomId] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  const joinRoom = () => {
    if (roomId) {
      setIsJoined(true);
    }
  };

  return (
    <Container className="text-center mt-5">
      {!isJoined ? (
        <>
          <Row>
            <Col>
              <h2>Enter Room ID</h2>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <Form>
                <Form.Control
                  type="text"
                  placeholder="Room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />
              </Form>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <Button onClick={joinRoom} variant="primary">Join Room</Button>
            </Col>
          </Row>
        </>
      ) : (
        <VideoCall roomId={roomId} />
      )}
    </Container>
  );
};

export default Room;
