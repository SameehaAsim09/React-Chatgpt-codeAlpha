import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import {MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react'

const API_KEY = "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";

function App() {
  const[typing, setTyping] = useState()
  const [messages, setMessages] = useState([
    {
      message: 'Hello! I am chatGpt',
      sender: 'Chatgpt'
    }
  ])

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: 'User',
      direction: 'outgoing'
    }
    const newMessages = [...messages, newMessage]
    setMessages(newMessages) //update state

    setTyping(true)
    await processMessageToChatGPT(newMessages);
  }

  async function processMessageToChatGPT(chatMessages){
    let apiMessages = chatMessages.map((messageObject) => {
      let role = '';
      if(messageObject.sender === 'ChatGPT'){
        role = 'assistant';
      }
      else{
        role=" user"
      }
      return {role: role, content: messageObject.message}
    });

    const systemMessage= {
      role: 'system',
      content: 'Explain all concepts like I am 10 years old' 
      //speak like a prite, Explain like I am a 10 years old expreinced software engineer
    }
    const apiRequestBody ={
      "model" : "gpt-4",
      "messages" : [
        systemMessage,
        ...apiMessages
      ]
    }
    await fetch("https://api.openai.com/v1/chat/completions",{
      method: 'POST',
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      console.log(data.choices[0].message.content);
    });
  }
  

  return (
    <div className='App'>
      <div style={{position: 'relative', height: '500px', width: '800px'}}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              typingIndicator={typing ? <TypingIndicator content='Typing'/> : null}
            >
              {
                messages.map((message, i) => {
                  return <Message key={i} model={message}/>
                })
              }
            </MessageList>
            <MessageInput placeholder='Type your message' onSend={handleSend}/>
          </ChatContainer>
        </MainContainer>
      </div>
      
    </div>
  )
}

export default App
