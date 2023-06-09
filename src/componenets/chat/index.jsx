import React, { useState, useEffect, useRef } from "react";
import Pusher from 'pusher-js';
import './style.css';
import { isObject } from '../../utils/index';
import { REACT_APP_PUSHER_TOKEN, REACT_APP_PUSHER_CLUSTER, REACT_APP_KEY } from "../../utils/config";

function Chat({ subscriptionChannel, userId, name, img, messages, channelName }) {
    const [inputValue, setInputValue] = useState({ "name": "", "value": "" })
    const [chatMessages, setChatMessages] = useState(messages);
    const PusherRef = useRef();
    const pusherToken = REACT_APP_PUSHER_TOKEN;
    const pusherCluster = REACT_APP_PUSHER_CLUSTER;
    const appKey = REACT_APP_KEY;

    const triggerWidgetMessage = (payload) => {
        const message = {};
        if (isObject(payload)) message[payload['name']] = payload['value'];
        message["lastMessageTimeStamp"] = new Date().getTime();
        PusherRef.current.channel(subscriptionChannel).trigger('client-widget-message', {
            "senderId": userId,
            "channelName": channelName,
            "message": message
        });
    }

    const handleTextChange = (e) => {
        if (e.keyCode === 13) {
            triggerWidgetMessage(inputValue);
            const newChatMessages = [...chatMessages];
            newChatMessages[newChatMessages.length - 1] = { "type": "text", "text": inputValue.value, "style": "sentMessages" };
            setChatMessages(newChatMessages);
            setInputValue({ "name": "", "value": ""});
        } else {
            const newObject = { name: e.target.getAttribute('data-key'), value: e.target.value }
            setInputValue(newObject);
        }
    }

    const handleButtonClick = (name, selectedValue) => {
        const newChatMessages = [...chatMessages];
        newChatMessages[newChatMessages.length - 1] = { "type": "text", "text": selectedValue, "style": "sentMessages"  };
        setChatMessages(newChatMessages);
        triggerWidgetMessage({ name, value: [selectedValue] })
    }

    const handleServerMessage = ({ messages }) => {
        if (messages.length > 0) {
            if (messages[0]['type'] === "text") {
                triggerWidgetMessage();
            }
            setChatMessages(prev => [...prev, messages[0]])
        }


    }
    useEffect(() => {
        PusherRef.current = new Pusher(pusherToken, {
            cluster: pusherCluster,
            authEndpoint: `https://insentstaging1.widget.insent.ai/pusher/presence/auth/visitor?userid=${userId}`,
            auth: {
                headers: {
                    Authorization: `Bearer ${appKey}`,
                },
            },
        });
        const channel = PusherRef.current.subscribe(subscriptionChannel);
        channel.bind('server-message', handleServerMessage);

        channel.bind('client-widget-message', data => {
            console.log(data.messages);
        });

        channel.bind('pusher:subscription_succeeded', () => {
            triggerWidgetMessage();
        });

        channel.bind('pusher:subscription_error', data => {
            console.log(data);
        });

        return () => {
            channel.unbind();
        }
        // eslint-disable-next-line
    }, [subscriptionChannel, userId]);

    const getElement = (elementObject) => {
        const elementType = elementObject.hasOwnProperty('type') ? elementObject["type"] : Object.keys(elementObject)[0];
        switch (elementType) {
            case 'input':
                const attributes = elementObject[elementType];
                return <div key={attributes[0].key} className={'incomeMessage'}>
                    <p className="fieldlabel">{attributes[0].name}</p>
                    <input type={attributes[0].type} name={attributes[0].name} key={attributes[0].key} data-key={attributes[0].key} value={inputValue.value} onChange={handleTextChange} onKeyDown={handleTextChange} placeholder={`Enter your ${attributes[0].key}`} className="typeBox" />
                </div>;
            case 'buttons':
                const buttons = elementObject[elementType];
                const newButtons = buttons.fields.map((fieldObject) => <button className="chatButton" key={fieldObject.uid}
                    data-key={buttons.key} onClick={(e) => handleButtonClick(e.target.getAttribute('data-key'), fieldObject.text)}>{fieldObject.text}</button>)
                return <div className="buttonContainer" key={buttons.key}>{newButtons}</div>
            case 'gif':
                const gif = elementObject[elementType];
                return <img className="chatImage" src={gif[0].url} alt={gif[0].name} />
            case 'text':
                return <p key={attributes[0].key}>{elementObject[elementType].replace("<br />", "")}</p>;
            default:
                return <p></p>
        }
    }

    return (
        <div className='chatContainer'>
            <div className="chatHeader">
                <img src={img} alt="zoomInfo" className="logo" />
                <div className="titleConatiner">
                    <h3>Zoominfo</h3>
                    <p>{`You are chatting with${name}`}</p>
                </div>
            </div>
            <img src={img} alt="zoomInfo" className="chatlogo" />
            <div className='textContainer'>

                {
                    chatMessages.map((data, id) => {
                        if (data.type === "text") {
                            return (<p key={id} className={(data.hasOwnProperty('style')) ? data.style : 'incomeMessage'}>
                                {data.text.replace("<br />", "")}
                            </p>)
                        } else {
                            return getElement(data);
                        }
                    }

                    )
                } </div>
        </div>
    );
}

export default Chat;
