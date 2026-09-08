import { Link } from "react-router-dom";
import "./Hero.css";

function Hero() {
  return (
    <div className="hero-page">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">G</span>
          <span>Graspify AI</span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
        </div>

        <div className="nav-buttons">
          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/register" className="register-btn">
            Get Started
          </Link>
        </div>
      </nav>


      {/* Hero Section */}
      <section className="hero-section" id="home">

        <div className="hero-content">

          <div className="hero-badge">
            ✨ AI-Powered Study Companion
          </div>

          <h1>
            Study Smarter.
            <br />
            <span>Learn Better.</span>
          </h1>

          <p className="hero-description">
            Upload your study material, ask questions, and let AI help
            you understand your content faster and more effectively.
          </p>

          <div className="hero-buttons">

            <Link to="/register" className="primary-btn">
              Get Started →
            </Link>

            <a href="#features" className="secondary-btn">
              Explore Features
            </a>

          </div>

          <p className="hero-note">
            Upload PDFs • Ask Questions • Learn with AI
          </p>

        </div>


        {/* Dashboard Preview */}
        <div className="hero-preview">

          <div className="preview-window">

            {/* Preview Header */}
            <div className="preview-header">

              <div className="preview-logo">
                <span>G</span>
                Graspify AI
              </div>

              <div className="preview-user">
                <div className="user-circle">
                  Y
                </div>
              </div>

            </div>


            {/* Preview Body */}
            <div className="preview-body">

              {/* Sidebar */}
              <aside className="preview-sidebar">

                <button className="new-chat">
                  + New Chat
                </button>

                <p className="sidebar-title">
                  Recent Chats
                </p>

                <div className="preview-chat active">
                  📘 Machine Learning
                </div>

                <div className="preview-chat">
                  📗 Data Structures
                </div>

                <div className="preview-chat">
                  📙 Computer Networks
                </div>

              </aside>


              {/* Chat */}
              <div className="preview-chat-area">

                <div className="preview-chat-title">
                  <h3>Machine Learning</h3>
                  <span>AI Study Assistant</span>
                </div>


                <div className="message hero-user-message">
                  Explain supervised learning in simple terms.
                </div>

                <div className="message ai-message">

                  <strong>AI Assistant</strong>

                  <p>
                    Supervised learning is a type of machine learning
                    where a model learns from labeled examples.
                  </p>

                  <p>
                    Think of it like teaching a student using questions
                    where the correct answers are already provided.
                  </p>

                </div>


                <div className="preview-input">

                  <span>
                    Ask anything about your study material...
                  </span>

                  <button>
                    ↑
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* Features */}
      <section className="features-section" id="features">

        <div className="section-heading">

          <span className="section-label">
            FEATURES
          </span>

          <h2>
            Everything you need to study smarter
          </h2>

          <p>
            Graspify AI turns your study material into an interactive
            learning experience.
          </p>

        </div>


        <div className="features-grid">

          <div className="feature-card">

            <div className="feature-icon">
              📄
            </div>

            <h3>PDF Analysis</h3>

            <p>
              Upload your study PDFs and let Graspify AI understand
              their content.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🤖
            </div>

            <h3>AI Question Answering</h3>

            <p>
              Ask questions about your study material and receive
              context-aware answers.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              📝
            </div>

            <h3>Smart Summaries</h3>

            <p>
              Turn lengthy study material into concise and useful
              summaries.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🧠
            </div>

            <h3>Flashcards</h3>

            <p>
              Create quick revision material from your learning
              content.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              ❓
            </div>

            <h3>Quizzes</h3>

            <p>
              Test your understanding with AI-generated questions.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🔍
            </div>

            <h3>Semantic Search</h3>

            <p>
              Find relevant information based on meaning, not just
              exact keywords.
            </p>

          </div>

        </div>

      </section>


      {/* How It Works */}
      <section
        className="how-section"
        id="how-it-works"
      >

        <div className="section-heading">

          <span className="section-label">
            HOW IT WORKS
          </span>

          <h2>
            Learn in three simple steps
          </h2>

        </div>


        <div className="steps">

          <div className="step">

            <div className="step-number">
              01
            </div>

            <h3>Upload</h3>

            <p>
              Upload your study material in PDF format.
            </p>

          </div>


          <div className="step-line"></div>


          <div className="step">

            <div className="step-number">
              02
            </div>

            <h3>Ask</h3>

            <p>
              Ask questions about the content you uploaded.
            </p>

          </div>


          <div className="step-line"></div>


          <div className="step">

            <div className="step-number">
              03
            </div>

            <h3>Learn</h3>

            <p>
              Get AI-powered answers and study more effectively.
            </p>

          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="cta-section">

        <h2>
          Ready to study smarter?
        </h2>

        <p>
          Start turning your study material into an interactive
          learning experience.
        </p>

        <Link to="/register" className="primary-btn">
          Get Started →
        </Link>

      </section>


      {/* Footer */}
      <footer className="footer">

        <div className="footer-logo">
          <span className="logo-icon">G</span>
          Graspify AI
        </div>

        <p>
          AI-powered study companion for smarter learning.
        </p>

        <p className="copyright">
          © 2026 Graspify AI. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default Hero;