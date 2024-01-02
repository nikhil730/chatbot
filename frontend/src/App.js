import "./App.css";
import Login from "./components/Login";
import SpeechToText from "./components/SpeechToText";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TextToSpeech from "./components/TextToSpeech";
import { useState } from "react";
import Socket, { socket } from "./components/Socket";
import ProtectedRoute from "./components/protectedRoute";

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
            <ProtectedRoute>
              <SpeechToText
                chatList={chatList}
                setChatList={setChatList}
                socket={socket}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/textToSpeech"
          element={
            <ProtectedRoute>
              <TextToSpeech
                chatList={chatList}
                setChatList={setChatList}
                socket={socket}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
