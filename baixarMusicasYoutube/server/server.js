const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');

const app = express();
const PORT = 4000;

app.use(cors());

app.get('/download', async (req, res) => {
  const videoURL = req.query.url;
  if (!ytdl.validateURL(videoURL)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const info = await ytdl.getInfo(videoURL);
  const title = info.videoDetails.title.replace(/[^a-zA-Z0-9 ]/g, '');
  res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);

  ytdl(videoURL, { filter: 'audioonly', quality: 'highestaudio' })
    .pipe(res)
    .on('error', (err) => {
      res.status(500).json({ error: 'Error downloading video' });
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
