let io = require('socket.io')(3000, {
  cors: {origin: ['http://localhost:8080']},
})

const fs = require("fs");
// const readable = fs.createReadStream(obj)
// const writable = fs.createWriteStream(obj);



const speech = require('@google-cloud/speech');
  
// Create a speech client
const client = new speech.SpeechClient();


const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US';

//speech client request header
const request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
    enableAutomaticPunctuation: true,
  },
  audio: {
    content: "THIS IS A PLACHOLDER, DOES THE INCOMING STREAM GO HERE SOMEHOW?"
  },
  interimResults: false, // If you want interim results, set this to true
};

  // Create a recognize stream, this makes a request and waits for response (transcription)
    const recognizeStream = client
    .streamingRecognize(request) //send request passed to streamingRecognize method
    .on('error', console.error) //throw error if error returned
    .on('data', data =>
    {
      console.log(data.results[0].alternatives[0].words)
      process.stdout.write(
          
        data.results[0] && data.results[0].alternatives[0]
          ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
          : '\n\nReached transcription time limit, press Ctrl+C\n'
      )
    }
    );

    



//Create socket and listen for audio stream from webRTC

io.on('connection', socket => {
  console.log(socket.id)

  //TODO: how to send this stream to google speech?
  socket.on('audioStream', (audio64) => {
      //obj is a JSON object structured like this: {"audio_data": base64 string....}
    //  fs.createReadStream(obj)
    //   .pipe(recognizeStream)


      //verified here that stream is being received continuously
      console.log('from server: ', audio64)
      
  })
 
})

console.log('socket server running')