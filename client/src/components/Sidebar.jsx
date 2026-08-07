import React from 'react'
import { createChat } from "../services/chat";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getChats } from "../services/chat";


const Sidebar = () => {
    const navigate = useNavigate();

    const [chats, setChats] = useState([]);

    const handleCreateChat = async () => {
        try {
            const response = await createChat();

            console.log(response);

            navigate(`/chat/${response.chat._id}`);
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    };

    const fetchChats = async () => {
        try {
            const response = await getChats();

            setChats(response.chats);

        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    };

    useEffect(() => {
        fetchChats();
    }, []);

    return (
        <>
            <div className="sidebar" style={{ display: "flex", flexDirection: "column" }}>
                <button onClick={handleCreateChat}>
                    + New Chat
                </button>

                {chats.map((chat) => (
                    <div key={chat._id}
                        onClick={() => navigate(`/chats/${chat._id}`)}
                    >
                        {chat.title}
                    </div>
                ))}
            </div>

        </>


    )
}

export default Sidebar