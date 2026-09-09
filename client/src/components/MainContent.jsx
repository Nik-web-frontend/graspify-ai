import { useEffect, useState } from "react";
import axios from "axios";

function MainContent() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const response = await axios.get(
          "http://localhost:5000/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(response.data.user);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <main className="dashboard-main">

      {/* Welcome */}
      <section className="dashboard-welcome">

        <div>
          <span className="dashboard-label">
            AI-POWERED STUDY COMPANION
          </span>

          <h1>
            Welcome back, {user?.name || "User"} 👋
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

    </main>
  );
}

export default MainContent;