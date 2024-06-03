import React, { useState } from 'react';

function App() {
  const [videoURL, setVideoURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    if (!videoURL) {
      setError('Por favor, insira uma URL do YouTube.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/.netlify/functions/download?url=${videoURL}`);
      if (!response.ok) {
        throw new Error('Erro ao baixar o vídeo');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'audio.mp3';
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
      <header className="App-header">
        <h1>Download de MP3 do YouTube</h1>
        <input
          type="text"
          placeholder="Insira a URL do YouTube"
          value={videoURL}
          onChange={(e) => setVideoURL(e.target.value)}
        />
        <button onClick={handleDownload} disabled={loading}>
          {loading ? 'Baixando...' : 'Baixar MP3'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>
    </div>
  );
}

export default App;
