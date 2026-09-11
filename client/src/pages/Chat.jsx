import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { getMessages, askQuestion } from "../services/chat";
import {
  uploadDocument,
  getDocuments,
  deleteDocument,
} from "../services/document";

import "./chat.css";

function Chat() {
  const { chatId } = useParams();

  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");

  // Changed from single document to multiple documents
  const [documents, setDocuments] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [asking, setAsking] = useState(false);

  const [chatRefresh, setChatRefresh] = useState(0);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);


  // =========================
  // Fetch Messages
  // =========================

  const fetchMessages = async () => {
    try {
      const response = await getMessages(chatId);

      setMessages(response.messages);

    } catch (error) {
      console.error(
        error.response?.data || error.message
      );
    }
  };


  // =========================
  // Fetch Documents
  // =========================

  const fetchDocuments = async () => {
    try {
      const response = await getDocuments(chatId);

      setDocuments(response.documents);

    } catch (error) {
      console.error(
        error.response?.data || error.message
      );
    }
  };


  // =========================
  // Scroll to Bottom
  // =========================

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };


  useEffect(() => {
    fetchMessages();
    fetchDocuments();
  }, [chatId]);


  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  // =========================
  // Upload Document
  // =========================

  const handleUpload = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please select a PDF file.");
      return;
    }

    try {

      setUploading(true);

      const response = await uploadDocument(
        chatId,
        file
      );

      console.log(response);

      // Refresh document list
      await fetchDocuments();

      // Refresh sidebar
      setChatRefresh((prev) => prev + 1);

    } catch (error) {

      console.error(
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        "Failed to upload document."
      );

    } finally {

      setUploading(false);

      // Allow selecting the same file again
      e.target.value = "";

    }
  };


  // =========================
  // Delete Document
  // =========================

  const handleDeleteDocument = async (documentId) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to remove this document?"
    );

    if (!confirmDelete) return;

    try {

      setDeleting(true);

      const response = await deleteDocument(
        chatId,
        documentId
      );

      console.log(response);

      // Refresh document list
      await fetchDocuments();

      // Refresh messages
      await fetchMessages();

      // Refresh sidebar
      setChatRefresh((prev) => prev + 1);

    } catch (error) {

      console.error(
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        "Failed to delete document."
      );

    } finally {

      setDeleting(false);

    }
  };


  // =========================
  // Ask Question
  // =========================

  const handleSend = async () => {

    if (!question.trim()) return;

    // Don't allow question without documents
    if (documents.length === 0) {
      alert("Please upload a PDF first.");
      return;
    }

    try {

      setAsking(true);

      const currentQuestion = question;

      setQuestion("");

      await askQuestion(
        chatId,
        currentQuestion
      );

      await fetchMessages();

    } catch (error) {

      console.error(
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        "Failed to get AI response."
      );

    } finally {

      setAsking(false);

    }
  };


  // =========================
  // Enter Key
  // =========================

  const handleKeyDown = (e) => {

    if (e.key === "Enter" && !e.shiftKey) {

      e.preventDefault();

      if (!asking) {
        handleSend();
      }

    }
  };


  return (
    <div className="chat-page">

      {/* Navbar */}

      <Navbar />


      <div className="chat-layout">

        {/* Sidebar */}

        <Sidebar
          chatId={chatId}
          refreshTrigger={chatRefresh}
        />


        {/* Main Chat */}

        <main className="chat-main">


          {/* Document Area */}

          <div className="document-area">

            {documents.length > 0 ? (

              <>

                {/* Existing document cards */}

                {documents.map((document) => (

                  <div
                    key={document._id}
                    className="document-card"
                  >

                    <div className="document-info">

                      <div className="document-icon">
                        📄
                      </div>

                      <div>

                        <h4>
                          {document.originalFileName}
                        </h4>

                        <p>
                          {document.processingStatus ===
                          "completed"
                            ? "Document ready"
                            : document.processingStatus}
                        </p>

                      </div>

                    </div>


                    <button
                      className="delete-document-button"
                      onClick={() =>
                        handleDeleteDocument(
                          document._id
                        )
                      }
                      disabled={deleting}
                    >
                      {deleting
                        ? "Removing..."
                        : "Remove"}
                    </button>

                  </div>

                ))}


                {/* Upload another PDF */}

                <div className="upload-card">

                  <div className="upload-icon">
                    📄
                  </div>

                  <div className="upload-content">

                    <h3>
                      Add More Study Material
                    </h3>

                    <p>
                      Upload another PDF to use
                      multiple study materials.
                    </p>

                  </div>

                  <button
                    className="upload-button"
                    onClick={() =>
                      fileInputRef.current.click()
                    }
                    disabled={uploading}
                  >
                    {uploading
                      ? "Uploading..."
                      : "Upload PDF"}
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    hidden
                    onChange={handleUpload}
                  />

                </div>

              </>

            ) : (

              /* No document */

              <div className="upload-card">

                <div className="upload-icon">
                  📄
                </div>

                <div className="upload-content">

                  <h3>
                    Upload Study Material
                  </h3>

                  <p>
                    Upload a PDF to start asking
                    questions about it.
                  </p>

                </div>

                <button
                  className="upload-button"
                  onClick={() =>
                    fileInputRef.current.click()
                  }
                  disabled={uploading}
                >
                  {uploading
                    ? "Uploading..."
                    : "Upload PDF"}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={handleUpload}
                />

              </div>

            )}

          </div>


          {/* Messages */}

          <div className="messages-area">

            {messages.length === 0 && !asking ? (

              <div className="empty-chat">

                <div className="empty-chat-icon">
                  🤖
                </div>

                <h3>
                  Start learning with Graspify AI
                </h3>

                <p>
                  Upload your study material and
                  ask questions about it.
                </p>

              </div>

            ) : (

              messages.map((message) => (

                <div
                  key={message._id}
                  className={`chat-message ${
                    message.role === "user"
                      ? "user-message"
                      : "assistant-message"
                  }`}
                >

                  <div className="message-avatar">

                    {message.role === "user"
                      ? "Y"
                      : "G"}

                  </div>

                  <div className="message-content">

                    <div className="message-role">

                      {message.role === "user"
                        ? "You"
                        : "Graspify AI"}

                    </div>

                    <p>
                      {message.content}
                    </p>

                  </div>

                </div>

              ))

            )}


            {/* AI Loading */}

            {asking && (

              <div className="chat-message assistant-message">

                <div className="message-avatar">
                  G
                </div>

                <div className="message-content">

                  <div className="message-role">
                    Graspify AI
                  </div>

                  <div className="thinking">

                    <span></span>
                    <span></span>
                    <span></span>

                    <span className="thinking-text">
                      Thinking...
                    </span>

                  </div>

                </div>

              </div>

            )}


            <div ref={messagesEndRef}></div>

          </div>


          {/* Question Input */}

          <div className="question-area">

            <div className="question-box">

              <input
                type="text"
                placeholder={
                  documents.length > 0
                    ? "Ask anything about your study materials..."
                    : "Upload a PDF first..."
                }
                value={question}
                onChange={(e) =>
                  setQuestion(e.target.value)
                }
                onKeyDown={handleKeyDown}
                disabled={
                  documents.length === 0 ||
                  asking
                }
              />

              <button
                onClick={handleSend}
                disabled={
                  documents.length === 0 ||
                  !question.trim() ||
                  asking
                }
              >
                {asking ? "..." : "↑"}
              </button>

            </div>

            <p className="input-note">
              Graspify AI answers using your uploaded
              study material.
            </p>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Chat;