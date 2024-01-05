
import React, { useEffect, useState } from "react";
import ReceivedTextBubble from "./ReceivedTextBubble";
import SentTextBubble from "./SentTextBubble";
import { useSelector, useDispatch } from "react-redux";

function ChatPrint({ chatList }) {
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    // Update localChatList when user changes
  }, [user]);
  console.log(chatList)
  return (
    <div>
      <div className="chat-container">
        {chatList?.map((chat, index) => {
          return (
            <div
              key={index}
              className={
                chat.role === "client"
                  ? "message sender-message"
                  : "message receiver-message"
              }
            >
              <p>
                {chat.role === "client" ? (
                  <SentTextBubble text={chat.message} />
                ) : (
                  <ReceivedTextBubble user={"AI"} text={chat.message} />
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChatPrint;
