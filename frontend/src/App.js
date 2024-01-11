import "./App.css";
import Login from "./components/Login";
import SpeechToText from "./components/SpeechToText";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TextToSpeech from "./components/TextToSpeech";
import { useState } from "react";
import Socket, { socket } from "./components/Socket";
import Proute from "./components/proute";

function App() {
  const [chatList, setChatList] = useState([]);
  <Socket />;
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/speechToText"
          element={
            <Proute>
              <SpeechToText
                chatList={chatList}
                setChatList={setChatList}
                socket={socket}
              />
            </Proute>
          }
        />
        <Route
          path="/textToSpeech"
          element={
            <Proute>
              <TextToSpeech
                chatList={chatList}
                setChatList={setChatList}
                socket={socket}
              />
            </Proute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
