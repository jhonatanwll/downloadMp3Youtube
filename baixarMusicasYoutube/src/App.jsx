import { useState } from "react";
import "./App.css";

function App() {
  const [videoURL, setVideoURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    if (!videoURL) {
      setError("Por favor, insira uma URL do YouTube.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:4000/download?url=${videoURL}`
      );
      if (!response.ok) {
        throw new Error("Erro ao baixar o vídeo");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${videoURL}.mp3`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Baixar Músicas do Youtube Online</h1>
      <input
        type="text"
        placeholder="Insira a URL do vídeo do YouTube"
        value={videoURL}
        onChange={(e) => setVideoURL(e.target.value)}
      />
      <button onClick={handleDownload} disabled={loading}>
        {loading ? "Baixando..." : "Baixar MP3"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;
