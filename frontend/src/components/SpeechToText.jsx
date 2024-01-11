import React, { useEffect, useState } from "react";
import "../styles/Chat.css";
import MuteButton from "../assets/images/MuteButton.png";
import ChatButton from "../assets/images/ChatButton.png";
import Volume from "../assets/images/Volume.png";
import OuterCircle from "../assets/images/OuterCircle.png";
import InnerCircle from "../assets/images/InnerCircle.png";
import Pause from "../assets/images/Pause.png";
import Header from "./Header";
import { Button } from "@mui/base";
import BackgroundVideo from "../assets/videos/Background-Video.mp4";
import { Link } from "react-router-dom";
import Video from "./Video";
import ChatPrint from "./ChatPrint";
import { useSelector, useDispatch } from "react-redux";

const SpeechToText = ({ chatList, setChatList, socket }) => {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const { user } = useSelector((state) => state.user);
  console.log(user)
  // For speech recognition
  const initialChatList = user?.chats || [];
  const [localChatList, setLocalChatList] = useState(initialChatList);
  useEffect(() => {
    // Update localChatList when user changes
    setLocalChatList(user?.chats || []);
  }, [user]);
  let recognition = null;
  recognition = new window.webkitSpeechRecognition(); // Initialize SpeechRecognition
  recognition.lang = "en-US"; // Set language
  recognition.continuous = true; // Continuous listening
  const startListening = () => {
    console.log("Speech recognition Entered...");
    recognition.onstart = () => {
      setListening(true);
      console.log("Speech recognition started...");
    };
    recognition.onresult = (event) => {
      const currentTranscript =
        event.results[event.results.length - 1][0].transcript;
      setTranscript(currentTranscript);
      console.log(transcript);
    };
    recognition.onend = () => {
      setListening(false);
      console.log("Speech recognition ended.");
    };
    recognition.start();
  };

  // Response from OpenAI is received
  socket.on("receiveMessage", (data) => {
    const newList = [...localChatList];
    newList.push({
      role: "server", message: data.message
    })
    setChatList(newList);
  });

  useEffect(() => {
    if (transcript) {
      socket.emit("sendMessage", { text: transcript });
      let newList=[];
    newList =[...localChatList];
    newList.push({role: "client", message: transcript})
      setChatList(newList);
    }
  }, [transcript]);

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setListening(false);
      console.log("Speech recognition stopped.");
    }
  };

  return (
    <div className="chat">
      <Header />
      <video
        autoPlay
        loop
        muted="false"
        className="background-icon"
        alt="BackgroundImage"
        src={BackgroundVideo}
      />
      <div className="outer-box">
        <div className="big-box">
          <div className="inner-box" />
          <div className="big-video">
            <Video />
          </div>
          <div className="mute-btn button-div">
            <Button onClick={listening ? stopListening : startListening}>
              <img className="mute-button" alt="MuteButton" src={MuteButton} />
            </Button>
            <p>Mute</p>
          </div>
          <div className="button-div">
            <div className="volume ">
              <div className="volume-meter">
                <div className="fill-meter"></div>
              </div>

              <img className="volume-icon" alt="VolumeIcon" src={Volume} />
            </div>
            <p>Volume</p>
          </div>
        </div>
        <div className="lower-box">
          <div className="text-box">
            <div className="chats">
              <ChatPrint chatList={chatList} />
            </div>
            <div className="button-div">
              <Link to="/textToSpeech">
                <Button className="chat-button">
                  <img
                    className="mute-button"
                    alt="ChatButton"
                    src={ChatButton}
                  />
                </Button>
              </Link>
              <p>Chat</p>
            </div>
          </div>
          <div className="pause-button-div">
            <Button className="pause-box">
              <img
                className="outer-circle"
                alt="ChatButton"
                src={OuterCircle}
              />
              <img className="inner-circle" src={InnerCircle} alt="" />
              <img className="pause-btn" src={Pause} alt="" />
              <p>Pause</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechToText;
