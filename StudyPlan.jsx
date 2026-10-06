import { useState } from "react";

function StudyPlan() {
  const [subject, setSubject] = useState("");
  const [examDate, setExamDate] = useState("");
  const [hours, setHours] = useState("");
  const [topics, setTopics] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const createPlan = async () => {
    const token = localStorage.getItem("token");

    if (!subject || !examDate || !hours || !topics) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai/study-plan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            subject,
            examDate,
            hoursPerDay: hours,
            topics,
          }),
        }
      );

      const data = await response.json();

      setResult(
        response.ok
          ? data.studyPlan
          : data.message
      );
    } catch {
      setResult("Backend server is not running.");
    }

    setLoading(false);
  };

  return (
    <div style={boxStyle}>
      <h2>📅 AI Study Plan</h2>

      <input
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        style={inputStyle}
      />

      <input
        type="date"
        value={examDate}
        onChange={(e) => setExamDate(e.target.value)}
        style={inputStyle}
      />

      <input
        type="number"
        placeholder="Hours per day"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
        style={inputStyle}
      />

      <textarea
        placeholder="Enter topics"
        value={topics}
        onChange={(e) => setTopics(e.target.value)}
        style={{
          ...inputStyle,
          minHeight: "100px",
        }}
      />

      <button onClick={createPlan} style={buttonStyle}>
        {loading ? "Creating..." : "Create Study Plan"}
      </button>

      {result && (
        <div style={resultStyle}>
          <h3>Your Study Plan</h3>
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

export default StudyPlan;