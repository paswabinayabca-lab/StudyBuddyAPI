import { useState } from "react";

function AIAssistant() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    const token = localStorage.getItem("token");

    if (!question) {
      alert("Please enter your question.");
      return;
    }

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai/assistant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ question }),
        }
      );

      const data = await response.json();

      setAnswer(
        response.ok
          ? data.answer
          : data.message
      );
    } catch {
      setAnswer("Backend server is not running.");
    }

    setLoading(false);
  };

  return (
    <div style={boxStyle}>
      <h2>🤖 AI Assistant</h2>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask your study question..."
        style={{
          width: "100%",
          minHeight: "130px",
          padding: "13px",
          boxSizing: "border-box",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      <button onClick={askAI} style={buttonStyle}>
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {answer && (
        <div style={resultStyle}>
          <h3>🤖 AI Answer</h3>
          <p>{answer}</p>
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

const buttonStyle = {
  width: "100%",
  padding: "13px",
  marginTop: "15px",
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

export default AIAssistant;