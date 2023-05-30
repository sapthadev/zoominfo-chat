import "./App.css";

import React, {useState, useEffect} from "react";
import Chat from "./componenets/chat";
import axios from "axios";
import {REACT_APP_KEY} from "./utils/config";

function App() {
    const [userId, setUserId] = useState("");
    const [channelID, setChannelID] = useState("");
    const [subscriptionChannel, setSubscriptionChannel] = useState("");
    const [botName, setBotName] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [messages, setMessages] = useState([]);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const appKey = REACT_APP_KEY;

    useEffect(() => {
        async function getUser() {
            try {
                const response = await axios.get("https://insentstaging1.widget.insent.ai/getuser?url=insent-staging10.firebaseapp.com%2Ffe-assignment", {
                    headers: {
                        authorization: `Bearer ${appKey}`
                    }
                });
                const {data} = response;
                const {channelId, user, subscriptionChannel} = data;
                setSubscriptionChannel(subscriptionChannel);
                setUserId(user.id);
                setChannelID(channelId);
            } catch (error) {
                console.error(error);
            }
        }
        getUser();
    }, [appKey]);

    async function getChannels() {
        try {
            const response = await axios.get(`https://insentstaging1.widget.insent.ai/user/channels/${channelID}`, {
                headers: {
                    authorization: `Bearer ${appKey}`,
                    Userid: userId
                }
            });
            const {data} = response;
            const {sender, messages} = data;
            setBotName(sender.name);
            setImgUrl(sender.img);
            setMessages(messages);
            setIsChatOpen(true);
        } catch (error) {
            console.error(error);
        }
    }

    const handleClick = (e) => {
        getChannels();
    }

    return (<div>
        <h1 className="pageTitle">Zoominfo Assessment</h1>
        <h2 className="pageTitle">Sapthagiri</h2>

        {
        channelID && !isChatOpen && <img className="chatIcon" data-testid="chatIcon" src="https://insent-assets.s3.amazonaws.com/bot-logo/option-1.png"
            onClick={handleClick}/>
    }
        {
        botName && (<div className="chatWidget"><Chat subscriptionChannel={subscriptionChannel}
                channelName={channelID}
                userId={userId}
                name={botName}
                img={imgUrl}
                messages={messages}/></div>)
        }
    
    
    
    </div>);
}

export default App;
