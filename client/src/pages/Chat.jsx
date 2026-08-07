import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMessages } from "../services/chat";

function Chat() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const response = await getMessages(chatId);

      setMessages(response.messages);



    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  console.log(messages)


  return (
    <>
      <h1>Chat ID</h1>

      <p>{chatId}</p>

      {messages.map((message) => (
        <div key={message._id}>
          <p><strong>{message.role}</strong></p>
          <p>{message.content}</p>
        </div>
      ))}

    </>
  )
}

export default Chat;