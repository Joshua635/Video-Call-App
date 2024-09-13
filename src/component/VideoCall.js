import React, { useRef, useState, useEffect } from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';

const VideoCall = ({ roomId }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  
//   let peerConnection;
  
  const servers = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302"
      }
    ]
  };

  // Start Call Function
  const startCall = async () => {
    setIsCallStarted(true);
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = localStream;

    const peerConnection = new RTCPeerConnection(servers);
    peerConnectionRef.current = peerConnection;
    
    // Add Local Stream to Peer Connection
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });

    // Set Remote Stream
    peerConnection.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

     // Set up ICE candidate exchange (using a signaling server)
     peerConnection.onicecandidate = event => {
        if (event.candidate) {
            // Send the ICE candidate to the other peer (signaling step)
            console.log('Send candidate:', event.candidate);
        }
    };

    // Create Offer and Set Local Description
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log('Send offer:', offer);


    // Simulate Sending Offer to Other Peer (this is where signaling server would come in)
    // Let's assume you get an answer back
    // await peerConnection.setRemoteDescription(answer);
  };

  const endCall = () => {
    if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;  // Clean up the reference
    }
    setIsCallStarted(false);

    // Optionally, you can stop the media tracks as well to release the camera and microphone
    if (localVideoRef.current && localVideoRef.current.srcObject) {
        localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
        localVideoRef.current.srcObject = null;  // Clear the video reference
    }
    if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;  // Clear the remote video reference
    }
};

  const sendMessage = (e) => {
    e.preventDefault();
    setChatMessages([...chatMessages, { user: 'You', text: message }]);
    setMessage('');
    // Simulate Sending Message (send via WebSocket or another method)
  };

  return (
    <Container className="mt-5 text-center">
      <Row>
        <Col>
          <h2>Room ID: {roomId}</h2>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <video ref={localVideoRef} autoPlay muted style={{ width: '100%', height: '300px' }} className="border"></video>
          <h5>Local Video</h5>
        </Col>
        <Col>
          <video ref={remoteVideoRef} autoPlay style={{ width: '100%', height: '300px' }} className="border"></video>
          <h5>Remote Video</h5>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          {!isCallStarted ? (
            <Button variant="primary" onClick={startCall}>Start Call</Button>
          ) : (
            <Button variant="danger" onClick={endCall}>End Call</Button>
          )}
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Form onSubmit={sendMessage}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Enter message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-2">Send</Button>
          </Form>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <ul className="list-group">
            {chatMessages.map((msg, index) => (
              <li key={index} className="list-group-item">
                <strong>{msg.user}: </strong>{msg.text}
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </Container>
  );
};

export default VideoCall;
