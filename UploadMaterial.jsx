import { useState } from "react";

function UploadMaterial() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setMessage("❌ Please enter material title.");
      return;
    }

    if (!file) {
      setMessage("❌ Please select a file.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("❌ Please login again.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        "http://127.0.0.1:5000/api/material/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setMessage("✅ Material uploaded successfully!");

      setTitle("");
      setFile(null);

      document.getElementById("materialFile").value = "";
    } catch (error) {
      console.error("Upload Error:", error);
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "30px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      }}
    >
      <h2>📤 Upload Study Material</h2>

      <p>Upload your study material for AI-powered learning.</p>

      <form onSubmit={handleUpload}>
        <label>
          <strong>Material Title</strong>
        </label>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter material title"
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            marginBottom: "20px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />

        <label>
          <strong>Select File</strong>
        </label>

        <input
          id="materialFile"
          type="file"
          accept=".pdf,.txt,.docx"
          onChange={handleFileChange}
          style={{
            width: "100%",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        />

        {file && (
          <p>
            Selected file: <strong>{file.name}</strong>
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "20px",
            backgroundColor: loading ? "#999" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
          }}
        >
          {loading ? "Uploading..." : "📤 Upload Material"}
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: "20px",
            fontWeight: "bold",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default UploadMaterial;