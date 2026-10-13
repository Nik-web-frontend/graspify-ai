import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import { getMessages, askQuestion } from "../services/chat";
import {
  uploadDocument,
  getDocuments,
  deleteDocument,
  generateSummary,
  generateNotes,
  generateFlashcards,
  generateQuiz
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

  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryOption, setSummaryOption] = useState("all");
  const [selectedDocumentId, setSelectedDocumentId] = useState("");
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notesOption, setNotesOption] = useState("all");
  const [selectedNotesDocumentId, setSelectedNotesDocumentId] = useState("");
  const [generatingNotes, setGeneratingNotes] = useState(false);


  const [showFlashcardsModal, setShowFlashcardsModal] = useState(false);
  const [flashcardsOption, setFlashcardsOption] = useState("all");
  const [selectedFlashcardDocumentId, setSelectedFlashcardDocumentId] = useState("");
  const [generatingFlashcards, setGeneratingFlashcards] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});


  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizOption, setQuizOption] = useState("all");
  const [selectedQuizDocumentId, setSelectedQuizDocumentId] = useState("");
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  const [quizAnswers, setQuizAnswers] = useState({});
  const [submittedQuizzes, setSubmittedQuizzes] = useState({});


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
  // Generate Summary
  // =========================

  const handleGenerateSummary = async () => {
    let documentIds = [];

    if (summaryOption === "all") {
      documentIds = documents.map(
        (document) => document._id
      );
    } else {
      if (!selectedDocumentId) {
        alert("Please select a document.");
        return;
      }

      documentIds = [selectedDocumentId];
    }

    try {
      setGeneratingSummary(true);

      await generateSummary(
        chatId,
        documentIds
      );

      await fetchMessages();

      setShowSummaryModal(false);
      setSummaryOption("all");
      setSelectedDocumentId("");

    } catch (error) {
      console.error(
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        "Failed to generate summary."
      );

    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleGenerateNotes = async () => {
    let documentIds = [];

    if (notesOption === "all") {
      documentIds = documents.map(
        (document) => document._id
      );
    } else {
      if (!selectedNotesDocumentId) {
        alert("Please select a document.");
        return;
      }

      documentIds = [selectedNotesDocumentId];
    }

    try {
      setGeneratingNotes(true);

      await generateNotes(
        chatId,
        documentIds
      );

      await fetchMessages();

      setShowNotesModal(false);
      setNotesOption("all");
      setSelectedNotesDocumentId("");

    } catch (error) {
      console.error(
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        "Failed to generate study notes."
      );

    } finally {
      setGeneratingNotes(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    let documentIds = [];

    if (flashcardsOption === "all") {
      documentIds = documents.map(
        (document) => document._id
      );
    } else {
      if (!selectedFlashcardDocumentId) {
        alert("Please select a document.");
        return;
      }

      documentIds = [selectedFlashcardDocumentId];
    }

    try {
      setGeneratingFlashcards(true);

      await generateFlashcards(
        chatId,
        documentIds
      );

      await fetchMessages();

      setShowFlashcardsModal(false);
      setFlashcardsOption("all");
      setSelectedFlashcardDocumentId("");

    } catch (error) {
      console.error(
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        "Failed to generate flashcards."
      );

    } finally {
      setGeneratingFlashcards(false);
    }
  };


  const handleGenerateQuiz = async () => {
    let documentIds = [];

    if (quizOption === "all") {
      documentIds = documents.map(
        (document) => document._id
      );
    } else {
      if (!selectedQuizDocumentId) {
        alert("Please select a document.");
        return;
      }

      documentIds = [selectedQuizDocumentId];
    }

    if (documentIds.length === 0) {
      alert("Please upload a document first.");
      return;
    }

    try {
      setGeneratingQuiz(true);

      await generateQuiz(chatId, documentIds);

      await fetchMessages();

      setShowQuizModal(false);
      setQuizOption("all");
      setSelectedQuizDocumentId("");
    } catch (error) {
      console.error(
        "Quiz generation error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
        "Failed to generate quiz."
      );
    } finally {
      setGeneratingQuiz(false);
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

  const isFlashcardMessage = (content) => {
    return (
      content.includes("### Flashcard 1") &&
      content.includes("**Question:**") &&
      content.includes("**Answer:**")
    );
  };

  const parseFlashcards = (content) => {
    const cards = content
      .split(/### Flashcard \d+/)
      .slice(1);

    return cards
      .map((card) => {
        const questionMatch = card.match(
          /\*\*Question:\*\*\s*(.*)/
        );

        const answerMatch = card.match(
          /\*\*Answer:\*\*\s*([\s\S]*?)(?=\n###|\s*$)/
        );

        return {
          question: questionMatch
            ? questionMatch[1].trim()
            : "",
          answer: answerMatch
            ? answerMatch[1].trim()
            : "",
        };
      })
      .filter(
        (card) =>
          card.question &&
          card.answer
      );
  };


  const parseQuiz = (content) => {
    try {
      const parsed = JSON.parse(content);

      if (!Array.isArray(parsed) || parsed.length === 0) {
        return null;
      }

      const isValidQuiz = parsed.every(
        (item) =>
          item &&
          typeof item.question === "string" &&
          Array.isArray(item.options) &&
          item.options.length === 4 &&
          typeof item.correct_answer === "string" &&
          typeof item.explanation === "string"
      );

      return isValidQuiz ? parsed : null;
    } catch {
      return null;
    }
  };

  const isQuizMessage = (message) => {
    if (message.role !== "assistant") {
      return false;
    }

    return parseQuiz(message.content) !== null;
  };


  const getCorrectOption = (item) => {
    const correctAnswer = String(
      item.correct_answer || ""
    ).trim();

    // Case 1: The correct answer is the complete option text.
    const exactOption = item.options.find(
      (option) =>
        option.trim().toLowerCase() ===
        correctAnswer.toLowerCase()
    );

    if (exactOption) {
      return exactOption;
    }

    // Case 2: The correct answer is A, B, C, or D.
    const letterMatch = correctAnswer.match(
      /^(?:option\s*)?([A-D])(?:[\s).:-]|$)/i
    );

    if (letterMatch) {
      return item.options[
        letterMatch[1].toUpperCase().charCodeAt(0) - 65
      ];
    }

    // Case 3: The correct answer is option 1, 2, 3, or 4.
    const numberMatch = correctAnswer.match(
      /^(?:option\s*)?([1-4])(?:[\s).:-]|$)/i
    );

    if (numberMatch) {
      return item.options[Number(numberMatch[1]) - 1];
    }

    return null;
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
          hasDocuments={documents.length > 0}
          onSummaryClick={() => setShowSummaryModal(true)}
          onNotesClick={() => setShowNotesModal(true)}
          onFlashcardsClick={() => setShowFlashcardsModal(true)}
          onQuizClick={() => setShowQuizModal(true)}
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


              messages.map((message) => {
                const isFlashcard =
                  message.role === "assistant" &&
                  isFlashcardMessage(message.content);

                const quiz = isQuizMessage(message)
                  ? parseQuiz(message.content)
                  : null;

                if (isFlashcard) {
                  return (
                    <div
                      key={message._id}
                      className="chat-message assistant-message flashcard-message"
                    >
                      <div className="message-avatar">G</div>

                      <div className="flashcard-message-body">
                        <div className="message-role">Graspify AI</div>

                        <div className="flashcards-container">
                          {parseFlashcards(message.content).map(
                            (card, index) => {
                              const cardKey = `${message._id}-${index}`;
                              const isFlipped = flippedCards[cardKey];

                              return (
                                <div
                                  key={cardKey}
                                  className={`flashcard ${isFlipped ? "flipped" : ""
                                    }`}
                                  onClick={() => {
                                    setFlippedCards((prev) => ({
                                      ...prev,
                                      [cardKey]: !prev[cardKey],
                                    }));
                                  }}
                                >
                                  <div className="flashcard-inner">
                                    <div className="flashcard-front">
                                      <span className="flashcard-label">
                                        Question
                                      </span>
                                      <p>{card.question}</p>
                                      <span className="flashcard-hint">
                                        Click to reveal answer
                                      </span>
                                    </div>

                                    <div className="flashcard-back">
                                      <span className="flashcard-label">
                                        Answer
                                      </span>
                                      <p>{card.answer}</p>
                                      <span className="flashcard-hint">
                                        Click to see question
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                if (quiz) {
                  const questionIndex = quizAnswers[message._id]?.currentIndex || 0;
                  const selectedAnswers = quizAnswers[message._id]?.answers || {};
                  const question = quiz[questionIndex];

                  const submitted = submittedQuizzes[message._id];

                  const isQuizComplete = quiz.every(
                    (_, index) => selectedAnswers[index] !== undefined
                  );

                  return (
                    <div
                      key={message._id}
                      className="chat-message assistant-message quiz-message"
                    >
                      <div className="message-avatar">G</div>

                      <div className="quiz-message-body">
                        <div className="message-role">Graspify AI</div>

                        <div className="quiz-card">
                          <div className="quiz-header">
                            <div>
                              <h3>Knowledge Quiz</h3>
                              <p>Test your understanding of the study material.</p>
                            </div>

                            <span className="quiz-count">
                              {quiz.length} questions
                            </span>
                          </div>

                          <div className="quiz-progress-info">
                            <span>
                              Question {questionIndex + 1} of {quiz.length}
                            </span>
                            <span>
                              {Math.round(
                                ((questionIndex + 1) / quiz.length) * 100
                              )}%
                            </span>
                          </div>

                          <div className="quiz-progress-track">
                            <div
                              className="quiz-progress-fill"
                              style={{
                                width: `${((questionIndex + 1) / quiz.length) * 100
                                  }%`,
                              }}
                            />
                          </div>

                          <h4 className="quiz-question">
                            {question.question}
                          </h4>


                          <div className="quiz-options">
                            {question.options.map((option, optionIndex) => {
                              const correctOption = getCorrectOption(question);
                              const isSelected =
                                selectedAnswers[questionIndex] === option;
                              const isCorrect = option === correctOption;

                              let answerClass = "";

                              if (submitted) {
                                if (isCorrect) {
                                  answerClass = "correct";
                                } else if (isSelected) {
                                  answerClass = "wrong";
                                }
                              } else if (isSelected) {
                                answerClass = "selected";
                              }

                              return (
                                <button
                                  key={optionIndex}
                                  type="button"
                                  className={`quiz-option ${answerClass}`}
                                  disabled={Boolean(submitted)}
                                  onClick={() => {
                                    setQuizAnswers((prev) => ({
                                      ...prev,
                                      [message._id]: {
                                        currentIndex: questionIndex,
                                        answers: {
                                          ...(prev[message._id]?.answers || {}),
                                          [questionIndex]: option,
                                        },
                                      },
                                    }));
                                  }}
                                >
                                  <span className="quiz-option-letter">
                                    {String.fromCharCode(65 + optionIndex)}
                                  </span>

                                  <span>{option}</span>

                                  {submitted && isCorrect && (
                                    <span className="quiz-answer-indicator">✓</span>
                                  )}

                                  {submitted && isSelected && !isCorrect && (
                                    <span className="quiz-answer-indicator">✕</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>


                          <div className="quiz-navigation">
                            <button
                              type="button"
                              className="quiz-nav-button"
                              disabled={questionIndex === 0}
                              onClick={() => {
                                setQuizAnswers((prev) => ({
                                  ...prev,
                                  [message._id]: {
                                    ...prev[message._id],
                                    currentIndex: questionIndex - 1,
                                  },
                                }));
                              }}
                            >
                              Previous
                            </button>

                            <button
                              type="button"
                              className="quiz-nav-button quiz-next-button"
                              disabled={questionIndex === quiz.length - 1}
                              onClick={() => {
                                setQuizAnswers((prev) => ({
                                  ...prev,
                                  [message._id]: {
                                    ...prev[message._id],
                                    currentIndex: questionIndex + 1,
                                  },
                                }));
                              }}
                            >
                              Next
                            </button>
                          </div>

                          <button
                            type="button"
                            className="quiz-submit-button"
                            disabled={!isQuizComplete || Boolean(submitted)}
                            onClick={() => {
                              const score = quiz.reduce(
                                (total, item, index) => {
                                  const correctOption = getCorrectOption(item);

                                  return total +
                                    (selectedAnswers[index] === correctOption ? 1 : 0);
                                },
                                0
                              );

                              setSubmittedQuizzes((prev) => ({
                                ...prev,
                                [message._id]: {
                                  score,
                                  answers: { ...selectedAnswers },
                                },
                              }));
                            }}
                          >
                            {submitted ? "Quiz Submitted" : "Submit Quiz"}
                          </button>


                          {submitted && (
                            <div className="quiz-results">
                              <div className="quiz-score">
                                <h3>Quiz Completed!</h3>
                                <p>
                                  Your score: <strong>{submitted.score} / {quiz.length}</strong>
                                </p>
                                <p>
                                  Percentage:{" "}
                                  <strong>
                                    {Math.round((submitted.score / quiz.length) * 100)}%
                                  </strong>
                                </p>
                              </div>

                              <h3 className="quiz-review-heading">
                                Answer Review
                              </h3>

                              {quiz.map((item, index) => {
                                const correctOption = getCorrectOption(item);
                                const userAnswer = submitted.answers[index];

                                return (

                                  <div
                                    key={index}
                                    className="quiz-review-item"
                                  >
                                    <h4>
                                      {index + 1}. {item.question}
                                    </h4>

                                    <p
                                      className={`quiz-review-answer ${userAnswer === correctOption ? "review-correct" : "review-wrong"
                                        }`}
                                    >
                                      <strong>Your answer:</strong>{" "}
                                      {userAnswer || "Not answered"}
                                      {userAnswer === correctOption ? " ✓" : " ✕"}
                                    </p>

                                    <p className="quiz-review-answer review-correct">
                                      <strong>Correct answer:</strong>{" "}
                                      {correctOption || "Could not identify the correct option"}
                                    </p>

                                    <p className="quiz-review-explanation">
                                      <strong>Explanation:</strong>{" "}
                                      {item.explanation}
                                    </p>
                                  </div>

                                );
                              })}
                            </div>
                          )}


                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={message._id}
                    className={`chat-message ${message.role === "user"
                      ? "user-message"
                      : "assistant-message"
                      }`}
                  >
                    <div className="message-avatar">
                      {message.role === "user" ? "Y" : "G"}
                    </div>

                    <div className="message-content">
                      <div className="message-role">
                        {message.role === "user" ? "You" : "Graspify AI"}
                      </div>

                      {message.role === "assistant" ? (
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      ) : (
                        <p>{message.content}</p>
                      )}
                    </div>
                  </div>
                );
              })



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
          {/* Summary Modal */}

          {showSummaryModal && (
            <div className="summary-modal-overlay">

              <div className="summary-modal">

                <h3>
                  Generate Summary
                </h3>

                <p>
                  Choose which study material you want to summarize.
                </p>

                <label className="summary-option">
                  <input
                    type="radio"
                    name="summaryOption"
                    value="all"
                    checked={summaryOption === "all"}
                    onChange={() => {
                      setSummaryOption("all");
                      setSelectedDocumentId("");
                    }}
                  />

                  <span>
                    All Documents
                  </span>
                </label>

                <label className="summary-option">
                  <input
                    type="radio"
                    name="summaryOption"
                    value="single"
                    checked={summaryOption === "single"}
                    onChange={() =>
                      setSummaryOption("single")
                    }
                  />

                  <span>
                    Select a Document
                  </span>
                </label>

                {summaryOption === "single" && (
                  <select
                    className="summary-document-select"
                    value={selectedDocumentId}
                    onChange={(e) =>
                      setSelectedDocumentId(e.target.value)
                    }
                  >
                    <option value="">
                      Select a document
                    </option>

                    {documents.map((document) => (
                      <option
                        key={document._id}
                        value={document._id}
                      >
                        {document.originalFileName}
                      </option>
                    ))}
                  </select>
                )}

                <div className="summary-modal-actions">

                  <button
                    className="summary-cancel-button"
                    onClick={() => {
                      setShowSummaryModal(false);
                      setSummaryOption("all");
                      setSelectedDocumentId("");
                    }}
                    disabled={generatingSummary}
                  >
                    Cancel
                  </button>

                  <button
                    className="summary-generate-button"
                    onClick={handleGenerateSummary}
                    disabled={
                      generatingSummary ||
                      (
                        summaryOption === "single" &&
                        !selectedDocumentId
                      )
                    }
                  >
                    {generatingSummary
                      ? "Generating..."
                      : "Generate"}
                  </button>

                </div>

              </div>

            </div>
          )}

          {showNotesModal && (
            <div className="summary-modal-overlay">

              <div className="summary-modal">

                <h3>
                  Generate Study Notes
                </h3>

                <p>
                  Choose which study material you want to turn into structured notes.
                </p>

                <label className="summary-option">
                  <input
                    type="radio"
                    name="notesOption"
                    value="all"
                    checked={notesOption === "all"}
                    onChange={() => {
                      setNotesOption("all");
                      setSelectedNotesDocumentId("");
                    }}
                  />
                  <span>All Documents</span>
                </label>

                <label className="summary-option">
                  <input
                    type="radio"
                    name="notesOption"
                    value="single"
                    checked={notesOption === "single"}
                    onChange={() =>
                      setNotesOption("single")
                    }
                  />
                  <span>Select a Document</span>
                </label>

                {notesOption === "single" && (
                  <select
                    className="summary-document-select"
                    value={selectedNotesDocumentId}
                    onChange={(e) =>
                      setSelectedNotesDocumentId(e.target.value)
                    }
                  >
                    <option value="">
                      Select a document
                    </option>

                    {documents.map((document) => (
                      <option
                        key={document._id}
                        value={document._id}
                      >
                        {document.originalFileName}
                      </option>
                    ))}
                  </select>
                )}

                <div className="summary-modal-actions">

                  <button
                    className="summary-cancel-button"
                    onClick={() => {
                      setShowNotesModal(false);
                      setNotesOption("all");
                      setSelectedNotesDocumentId("");
                    }}
                    disabled={generatingNotes}
                  >
                    Cancel
                  </button>

                  <button
                    className="summary-generate-button"
                    onClick={handleGenerateNotes}
                    disabled={
                      generatingNotes ||
                      (
                        notesOption === "single" &&
                        !selectedNotesDocumentId
                      )
                    }
                  >
                    {generatingNotes
                      ? "Generating..."
                      : "Generate"}
                  </button>

                </div>

              </div>

            </div>
          )}

          {showFlashcardsModal && (
            <div className="summary-modal-overlay">

              <div className="summary-modal">

                <h3>
                  Generate Flashcards
                </h3>

                <p>
                  Choose which study material you want to turn into flashcards.
                </p>

                <label className="summary-option">
                  <input
                    type="radio"
                    name="flashcardsOption"
                    value="all"
                    checked={flashcardsOption === "all"}
                    onChange={() => {
                      setFlashcardsOption("all");
                      setSelectedFlashcardDocumentId("");
                    }}
                  />
                  <span>All Documents</span>
                </label>

                <label className="summary-option">
                  <input
                    type="radio"
                    name="flashcardsOption"
                    value="single"
                    checked={flashcardsOption === "single"}
                    onChange={() =>
                      setFlashcardsOption("single")
                    }
                  />
                  <span>Select a Document</span>
                </label>

                {flashcardsOption === "single" && (
                  <select
                    className="summary-document-select"
                    value={selectedFlashcardDocumentId}
                    onChange={(e) =>
                      setSelectedFlashcardDocumentId(e.target.value)
                    }
                  >
                    <option value="">
                      Select a document
                    </option>

                    {documents.map((document) => (
                      <option
                        key={document._id}
                        value={document._id}
                      >
                        {document.originalFileName}
                      </option>
                    ))}
                  </select>
                )}

                <div className="summary-modal-actions">

                  <button
                    className="summary-cancel-button"
                    onClick={() => {
                      setShowFlashcardsModal(false);
                      setFlashcardsOption("all");
                      setSelectedFlashcardDocumentId("");
                    }}
                    disabled={generatingFlashcards}
                  >
                    Cancel
                  </button>

                  <button
                    className="summary-generate-button"
                    onClick={handleGenerateFlashcards}
                    disabled={
                      generatingFlashcards ||
                      (
                        flashcardsOption === "single" &&
                        !selectedFlashcardDocumentId
                      )
                    }
                  >
                    {generatingFlashcards
                      ? "Generating..."
                      : "Generate"}
                  </button>

                </div>

              </div>

            </div>
          )}


          {/* Quiz Modal */}
          {showQuizModal && (
            <div className="summary-modal-overlay">
              <div className="summary-modal">
                <div className="summary-modal-header">
                  <h2>Generate Quiz</h2>

                  <p>
                    Choose which study material you want to
                    use for the quiz.
                  </p>
                </div>

                <div className="summary-modal-options">
                  <label className="summary-option">
                    <input
                      type="radio"
                      name="quizOption"
                      value="all"
                      checked={quizOption === "all"}
                      onChange={() => {
                        setQuizOption("all");
                        setSelectedQuizDocumentId("");
                      }}
                    />

                    <span>All Documents</span>
                  </label>

                  <label className="summary-option">
                    <input
                      type="radio"
                      name="quizOption"
                      value="single"
                      checked={quizOption === "single"}
                      onChange={() => setQuizOption("single")}
                    />

                    <span>Select a Document</span>
                  </label>
                </div>

                {quizOption === "single" && (
                  <div className="summary-document-select">
                    <label htmlFor="quizDocument">
                      Choose Document
                    </label>

                    <select
                      id="quizDocument"
                      value={selectedQuizDocumentId}
                      onChange={(event) =>
                        setSelectedQuizDocumentId(event.target.value)
                      }
                    >
                      <option value="">
                        Select a document
                      </option>

                      {documents.map((document) => (
                        <option
                          key={document._id}
                          value={document._id}
                        >
                          {document.originalFileName ||
                            document.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="summary-modal-actions">
                  <button
                    className="summary-cancel-button"
                    onClick={() => {
                      setShowQuizModal(false);
                      setQuizOption("all");
                      setSelectedQuizDocumentId("");
                    }}
                    disabled={generatingQuiz}
                  >
                    Cancel
                  </button>

                  <button
                    className="summary-generate-button"
                    onClick={handleGenerateQuiz}
                    disabled={
                      generatingQuiz ||
                      documents.length === 0 ||
                      (
                        quizOption === "single" &&
                        !selectedQuizDocumentId
                      )
                    }
                  >
                    {generatingQuiz
                      ? "Generating..."
                      : "Generate Quiz"}
                  </button>
                </div>
              </div>
            </div>
          )}


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