import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createChat, getChats } from "../services/chat";

const Sidebar = () => {
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);

  const handleCreateChat = async () => {
    try {
      const response = await createChat();

      console.log(response);

      navigate(`/chats/${response.chat._id}`);

    } catch (error) {
      console.error(
        error.response?.data || error.message
      );
    }
  };

  const fetchChats = async () => {
    try {
      const response = await getChats();

      setChats(response.chats);

    } catch (error) {
      console.error(
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <aside className="dashboard-sidebar">

      {/* New Chat */}
      <button
        className="new-chat-button"
        onClick={handleCreateChat}
      >
        + New Chat
      </button>


      {/* Recent Chats */}
      <div className="sidebar-section">

        <p className="sidebar-section-title">
          Recent Chats
        </p>

        <div className="chat-list">

          {chats.length > 0 ? (

            chats.map((chat) => (

              <button
                key={chat._id}
                className="sidebar-chat"
                onClick={() =>
                  navigate(`/chats/${chat._id}`)
                }
              >
                <span className="chat-icon">
                  💬
                </span>

                <span className="chat-title">
                  {chat.title}
                </span>
              </button>

            ))

          ) : (

            <p className="no-chats">
              No chats yet
            </p>

          )}

        </div>

      </div>


      {/* Study Tools */}
      <div className="sidebar-section study-tools">

        <p className="sidebar-section-title">
          Study Tools
        </p>

        <button className="sidebar-tool">
          📄
          <span>Documents</span>
        </button>

        <button className="sidebar-tool">
          📝
          <span>Summaries</span>
        </button>

        <button className="sidebar-tool">
          🧠
          <span>Flashcards</span>
        </button>

        <button className="sidebar-tool">
          ❓
          <span>Quizzes</span>
        </button>

      </div>


      {/* Bottom */}
      <div className="sidebar-bottom">

        <button className="sidebar-tool">
          ⚙️
          <span>Settings</span>
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;