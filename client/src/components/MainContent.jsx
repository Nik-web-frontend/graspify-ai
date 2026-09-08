function MainContent() {
  return (
    <main className="dashboard-main">

      {/* Welcome */}
      <section className="dashboard-welcome">

        <div>
          <span className="dashboard-label">
            AI-POWERED STUDY COMPANION
          </span>

          <h1>
            Welcome back, Yash 👋
          </h1>

          <p>
            Upload your study material and start learning
            smarter with Graspify AI.
          </p>
        </div>

      </section>


      {/* Quick Actions */}
      <section className="quick-actions">

        <div className="dashboard-card">

          <div className="card-icon">
            📄
          </div>

          <h3>
            Upload Study Material
          </h3>

          <p>
            Upload a PDF and let Graspify AI understand
            your study material.
          </p>

          <button className="card-button">
            Upload PDF →
          </button>

        </div>


        <div className="dashboard-card">

          <div className="card-icon">
            💬
          </div>

          <h3>
            Ask AI
          </h3>

          <p>
            Start a conversation and ask questions about
            your study material.
          </p>

          <button className="card-button">
            Start Chat →
          </button>

        </div>


        <div className="dashboard-card">

          <div className="card-icon">
            🧠
          </div>

          <h3>
            Study Tools
          </h3>

          <p>
            Create summaries, flashcards and quizzes
            from your learning content.
          </p>

          <button className="card-button">
            Explore Tools →
          </button>

        </div>

      </section>


      {/* Recent Documents */}
      <section className="recent-section">

        <div className="section-title-row">

          <div>
            <span className="dashboard-label">
              YOUR MATERIAL
            </span>

            <h2>
              Recent Documents
            </h2>
          </div>

        </div>


        <div className="empty-documents">

          <div className="empty-icon">
            📚
          </div>

          <h3>
            No documents yet
          </h3>

          <p>
            Upload your first study PDF to start
            learning with Graspify AI.
          </p>

          <button className="upload-button">
            Upload Your First PDF →
          </button>

        </div>

      </section>

    </main>
  );
}

export default MainContent;