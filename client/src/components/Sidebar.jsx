import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createChat, getChats, renameChat, deleteChat } from "../services/chat";

const Sidebar = ({ chatId, refreshTrigger = 0 }) => {
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);

  const [menuChatId, setMenuChatId] = useState(null);
  const [renamingChatId, setRenamingChatId] = useState(null);
  const [renameTitle, setRenameTitle] = useState("");

  const [deleteChatData, setDeleteChatData] = useState(null);

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
  }, [refreshTrigger]);

  const handleRename = async (chat) => {
    const newTitle = renameTitle.trim();

    if (!newTitle) {
      return;
    }

    try {
      const response = await renameChat(
        chat._id,
        newTitle
      );

      setChats((prevChats) =>
        prevChats.map((item) =>
          item._id === chat._id
            ? response.chat
            : item
        )
      );

      setRenamingChatId(null);
      setRenameTitle("");
      setMenuChatId(null);

    } catch (error) {
      console.error(
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        "Failed to rename chat."
      );
    }
  };

  const handleDelete = async (chat) => {
    setDeleteChatData(chat);
    setMenuChatId(null);
  };

  const confirmDeleteChat = async () => {
    if (!deleteChatData) {
      return;
    }

    try {
      await deleteChat(deleteChatData._id);

      setChats((prevChats) =>
        prevChats.filter(
          (item) => item._id !== deleteChatData._id
        )
      );

      if (deleteChatData._id === chatId) {
        navigate("/dashboard", {
          replace: true,
        });
      }

      setDeleteChatData(null);

    } catch (error) {
      console.error(
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        "Failed to delete chat."
      );
    }
  };

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

              <div
                key={chat._id}
                className={`sidebar-chat-wrapper ${chat._id === chatId ? "active" : ""
                  }`}
              >
                {renamingChatId === chat._id ? (
                  <div className="chat-rename-box">
                    <input
                      type="text"
                      value={renameTitle}
                      onChange={(e) =>
                        setRenameTitle(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRename(chat);
                        }

                        if (e.key === "Escape") {
                          setRenamingChatId(null);
                          setRenameTitle("");
                        }
                      }}
                      autoFocus
                    />

                    <button
                      onClick={() => handleRename(chat)}
                    >
                      ✓
                    </button>

                    <button
                      onClick={() => {
                        setRenamingChatId(null);
                        setRenameTitle("");
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <button
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

                    <button
                      className="chat-menu-button"
                      onClick={(e) => {
                        e.stopPropagation();

                        setMenuChatId(
                          menuChatId === chat._id
                            ? null
                            : chat._id
                        );
                      }}
                    >
                      ⋯
                    </button>

                    {menuChatId === chat._id && (
                      <div className="chat-menu">
                        <button
                          onClick={() => {
                            setRenamingChatId(chat._id);
                            setRenameTitle(chat.title);
                            setMenuChatId(null);
                          }}
                        >
                          Rename
                        </button>

                        <button
                          className="delete-chat-option"
                          onClick={() => handleDelete(chat)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

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

      {deleteChatData && (
        <div
          className="delete-modal-overlay"
          onClick={() => setDeleteChatData(null)}
        >
          <div
            className="delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-modal-icon">
              🗑️
            </div>

            <div className="delete-modal-content">
              <h3>
                Delete chat?
              </h3>

              <p>
                Are you sure you want to permanently
                delete{" "}
                <strong>
                  "{deleteChatData.title}"
                </strong>
                ?
              </p>

              <span className="delete-modal-warning">
                This will delete the chat, messages,
                and uploaded study material.
              </span>
            </div>

            <div className="delete-modal-actions">
              <button
                className="cancel-delete-button"
                onClick={() => setDeleteChatData(null)}
              >
                Cancel
              </button>

              <button
                className="confirm-delete-button"
                onClick={confirmDeleteChat}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </aside>
  );
};

export default Sidebar;