
import "./App.css";

import React, { useState, useEffect } from "react";
import Chat from "./componenets/chat";
import axios from "axios";

function App() {
  const [userId, setUserId] = useState("");
  const [channelID, setChannelID] = useState("");
  const [subscriptionChannel, setSubscriptionChannel] = useState("");
  const [botName, setBotName] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function getUser() {
      try {
        const response = await axios.get(
          "https://insentstaging1.widget.insent.ai/getuser?url=insent-staging10.firebaseapp.com%2Ffe-assignment",
          {
            headers: {
              authorization: "Bearer C6RZpH3Ym4HphfpKHmHD",
            },
          }
        );
        const { data } = response;
        const { channelId, user, subscriptionChannel } = data;
        setSubscriptionChannel(subscriptionChannel);
        setUserId(user.id);
        setChannelID(channelId);
      } catch (error) {
        console.error(error);
      }
    }
    getUser();
  }, []);

  useEffect(() => {
    async function getChannels() {
      try {
        const response = await axios.get(
          `https://insentstaging1.widget.insent.ai/user/channels/${channelID}`,
          {
            headers: {
              authorization: "Bearer C6RZpH3Ym4HphfpKHmHD",
              Userid: userId,
            },
          }
        );
        const { data } = response;
        const { sender, messages } = data;
        setBotName(sender.name);
        setImgUrl(sender.img);
        setMessages(messages);
      } catch (error) {
        console.error(error);
      }
    }

    if (channelID) getChannels();
  }, [channelID, userId]);

  return (
    <div>
      {botName && (
        <Chat
          subscriptionChannel={subscriptionChannel}
          channelName={channelID}
          userId={userId}
          name={botName}
          img={imgUrl}
          messages={messages}
        />
      )}
    </div>
  );
}

export default App;
