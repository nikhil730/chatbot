import React, { useEffect, useState } from 'react'
import ReceivedTextBubble from './ReceivedTextBubble';
import SentTextBubble from './SentTextBubble';
import io from "socket.io-client";

const socket = io("http://localhost:3000", {
    path: "/api/socket.io",
  });

function Socket() {

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected");
    });
  }, [socket]);
}

export {socket}
export default Socket
