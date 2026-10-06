import { useState } from "react";

function Quiz() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const createQuiz = async () => {
    const token = localStorage.getItem("token");

    if (!topic) {
      alert("Please enter a topic.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai/quiz",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ topic }),
        }
      );

      const data = await response.json();

      setResult(
        response.ok
          ? data.quiz
          : data.message
      );
    } catch {
      setResult("Backend server is not running.");
    }

    setLoading(false);
  };

  return (
    <div style={boxStyle}>
      <h2>🧠 AI Quiz</h2>

      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter topic"
        style={inputStyle}
      />

      <button onClick={createQuiz} style={buttonStyle}>
        {loading ? "Generating..." : "Start Quiz"}
      </button>

      {result && (
        <div style={resultStyle}>
          <h3>Generated Quiz</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

const boxStyle = {
  maxWidth: "800px",
  margin: "40px auto",
  background: "white",
  padding: "30px",
  borderRadius: "15px",
  boxShadow: "0 3px 15px rgba(0,0,0,0.1)",
};

const inputStyle = {
  width: "100%",
  padding: "13px",
  boxSizing: "border-box",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  width: "100%",
  padding: "13px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
};

const resultStyle = {
  marginTop: "25px",
  padding: "20px",
  background: "#f4f7fb",
  borderRadius: "10px",
  whiteSpace: "pre-wrap",
  lineHeight: "1.6",
};

export default Quiz;