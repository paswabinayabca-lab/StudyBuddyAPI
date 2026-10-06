import { useState } from "react";
import UploadMaterial from "./UploadMaterial.jsx";
import MaterialList from "./MaterialList.jsx";
import Flashcards from "./Flashcards.jsx";
import Quiz from "./Quiz.jsx";
import StudyPlan from "./StudyPlan.jsx";
import AIAssistant from "./AIAssistant.jsx";

function App() {
  const [activePage, setActivePage] = useState("materials");
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setLoggedIn(true);
      setMessage("Login successful! Welcome to StudyBuddy AI.");
      setActivePage("materials");
    } catch (error) {
      console.error("Login error:", error);
      setMessage(error.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setMessage(
        data.message || "Registration successful! Please login."
      );

      setIsRegister(false);
      setName("");
      setPassword("");
    } catch (error) {
      console.error("Registration error:", error);
      setMessage(error.message || "Unable to register.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setEmail("");
    setPassword("");
    setMessage("");
  };

  if (!loggedIn) {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginCard}>
          <h1 style={styles.logo}>StudyBuddy AI</h1>

          <p style={styles.subtitle}>
            Your AI Study Assistant
          </p>

          <h2>
            {isRegister ? "Create Account" : "Login"}
          </h2>

          <form
            onSubmit={
              isRegister ? handleRegister : handleLogin
            }
          >
            {isRegister && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={styles.input}
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />

            <button
              type="submit"
              disabled={loading}
              style={styles.primaryButton}
            >
              {loading
                ? "Please wait..."
                : isRegister
                ? "Register"
                : "Login"}
            </button>
          </form>

          {message && (
            <p style={styles.message}>
              {message}
            </p>
          )}

          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setMessage("");
            }}
            style={styles.linkButton}
          >
            {isRegister
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>
            StudyBuddy AI
          </h1>

          <p style={styles.headerSubtitle}>
            Your AI Study Assistant
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={styles.logoutButton}
        >
          Logout
        </button>
      </header>

      <nav style={styles.nav}>
        <button
          onClick={() => setActivePage("materials")}
          style={
            activePage === "materials"
              ? styles.activeNavButton
              : styles.navButton
          }
        >
          Materials
        </button>

        <button
          onClick={() => setActivePage("upload")}
          style={
            activePage === "upload"
              ? styles.activeNavButton
              : styles.navButton
          }
        >
          Upload Material
        </button>

        <button
          onClick={() => setActivePage("flashcards")}
          style={
            activePage === "flashcards"
              ? styles.activeNavButton
              : styles.navButton
          }
        >
          Flashcards
        </button>

        <button
          onClick={() => setActivePage("quiz")}
          style={
            activePage === "quiz"
              ? styles.activeNavButton
              : styles.navButton
          }
        >
          Quiz
        </button>

        <button
          onClick={() => setActivePage("studyplan")}
          style={
            activePage === "studyplan"
              ? styles.activeNavButton
              : styles.navButton
          }
        >
          Study Plan
        </button>

        <button
          onClick={() => setActivePage("assistant")}
          style={
            activePage === "assistant"
              ? styles.activeNavButton
              : styles.navButton
          }
        >
          AI Assistant
        </button>
      </nav>

      <main style={styles.content}>
        {activePage === "materials" && <MaterialList />}

        {activePage === "upload" && (
          <UploadMaterial />
        )}

        {activePage === "flashcards" && (
          <Flashcards />
        )}

        {activePage === "quiz" && <Quiz />}

        {activePage === "studyplan" && (
          <StudyPlan />
        )}

        {activePage === "assistant" && (
          <AIAssistant />
        )}
      </main>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    backgroundColor: "#f4f6f8",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    backgroundColor: "#4f46e5",
    color: "white",
    padding: "20px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    margin: 0,
    fontSize: "28px",
  },

  headerSubtitle: {
    margin: "5px 0 0",
  },

  logoutButton: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "white",
    color: "#4f46e5",
    fontWeight: "bold",
  },

  nav: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    padding: "15px 20px",
    backgroundColor: "white",
    borderBottom: "1px solid #ddd",
  },

  navButton: {
    padding: "10px 15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "white",
  },

  activeNavButton: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#4f46e5",
    color: "white",
  },

  content: {
    padding: "20px",
  },

  loginPage: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6f8",
    fontFamily: "Arial, sans-serif",
  },

  loginCard: {
    width: "380px",
    maxWidth: "90%",
    padding: "30px",
    backgroundColor: "white",
    borderRadius: "15px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
  },

  logo: {
    color: "#4f46e5",
    marginBottom: "5px",
  },

  subtitle: {
    color: "#666",
    marginBottom: "25px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "15px",
  },

  primaryButton: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#4f46e5",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },

  message: {
    marginTop: "15px",
    color: "#333",
  },

  linkButton: {
    marginTop: "20px",
    border: "none",
    background: "none",
    color: "#4f46e5",
    cursor: "pointer",
  },
};

export default App;

