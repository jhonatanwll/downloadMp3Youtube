const ytdl = require('ytdl-core');
const { PassThrough } = require('stream');

exports.handler = async function(event, context) {
  const videoURL = event.queryStringParameters.url;

  if (!ytdl.validateURL(videoURL)) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ error: 'Invalid URL' })
    };
  }

  try {
    const info = await ytdl.getInfo(videoURL);
    const title = info.videoDetails.title.replace(/[^a-zA-Z0-9 ]/g, '');

    const stream = ytdl(videoURL, { filter: 'audioonly', quality: 'highestaudio' });
    const passthrough = new PassThrough();

    stream.pipe(passthrough);

    const chunks = [];
    for await (const chunk of passthrough) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${title}.mp3"`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: buffer.toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
