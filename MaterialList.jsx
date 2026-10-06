import { useEffect, useState } from "react";

function MaterialList() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [summary, setSummary] = useState({});
  const [summaryLoading, setSummaryLoading] = useState({});

  const token = localStorage.getItem("token");

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      setMessage("");

      if (!token) {
        setMessage("Please login first.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:5000/api/material/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load materials");
      }

      setMaterials(Array.isArray(data) ? data : data.materials || []);
    } catch (error) {
      console.error("Material loading error:", error);
      setMessage("Unable to load materials. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const generateSummary = async (materialId) => {
    try {
      setSummaryLoading((prev) => ({
        ...prev,
        [materialId]: true,
      }));

      setMessage("");

      if (!token) {
        setMessage("Please login first.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/ai/summarize/${materialId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "AI summary generation failed");
      }

      setSummary((prev) => ({
        ...prev,
        [materialId]: data.summary || data.message || "Summary generated successfully.",
      }));
    } catch (error) {
      console.error("Summary error:", error);
      setMessage(error.message || "AI summary generation failed.");
    } finally {
      setSummaryLoading((prev) => ({
        ...prev,
        [materialId]: false,
      }));
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2>My Study Materials</h2>
        <p>Loading materials...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Study Materials</h2>

      {message && (
        <div style={styles.message}>
          {message}
        </div>
      )}

      {materials.length === 0 ? (
        <div style={styles.empty}>
          <p>No study materials uploaded yet.</p>
          <p>Upload a PDF, DOCX, or TXT file to get started.</p>
        </div>
      ) : (
        <div>
          {materials.map((material) => (
            <div key={material._id} style={styles.card}>
              <h3 style={styles.title}>
                {material.title || material.fileName || "Untitled Material"}
              </h3>

              {material.fileName && (
                <p style={styles.fileName}>
                  File: {material.fileName}
                </p>
              )}

              {material.summary && (
                <div style={styles.oldSummary}>
                  <strong>Saved Summary:</strong>
                  <p>{material.summary}</p>
                </div>
              )}

              <button
                onClick={() => generateSummary(material._id)}
                disabled={summaryLoading[material._id]}
                style={styles.button}
              >
                {summaryLoading[material._id]
                  ? "Generating..."
                  : "Generate AI Summary"}
              </button>

              {summary[material._id] && (
                <div style={styles.summaryBox}>
                  <h4>AI Summary</h4>
                  <p>{summary[material._id]}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button onClick={fetchMaterials} style={styles.refreshButton}>
        Refresh Materials
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "30px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },

  heading: {
    marginBottom: "20px",
  },

  message: {
    padding: "12px",
    marginBottom: "20px",
    backgroundColor: "#ffe5e5",
    borderRadius: "8px",
    color: "#b00020",
  },

  empty: {
    padding: "30px",
    textAlign: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: "10px",
  },

  card: {
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },

  title: {
    marginTop: "0",
    marginBottom: "10px",
  },

  fileName: {
    color: "#666",
    marginBottom: "15px",
  },

  oldSummary: {
    padding: "12px",
    marginBottom: "15px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
  },

  button: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#4f46e5",
    color: "white",
    fontSize: "14px",
  },

  summaryBox: {
    marginTop: "20px",
    padding: "16px",
    backgroundColor: "#eef6ff",
    borderRadius: "10px",
    lineHeight: "1.6",
  },

  refreshButton: {
    marginTop: "10px",
    padding: "10px 16px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#ffffff",
  },
};

export default MaterialList;

