
//'npm run client' to start browser client

// required dom elements
const buttonEl = document.getElementById('button');
const messageEl = document.getElementById('message');
const titleEl = document.getElementById('real-time-title');

import { testOtherScript } from './languageProcessing.js'
testOtherScript()

// set initial state of application variables
messageEl.style.display = 'none';
let isRecording = false;
let socket;
let recorder;
let readingPrompt = ["the", "fat", "cat", "ran", "fast"];
let maxWords = readingPrompt.length;
let userResponse;
let msg = '';


/** *********  FUNCTIONS ************ */

    let checkForMaxWords = (arr, maxWords) => {
      if (arr.length >= maxWords) {
        console.log('MAX WORDS REACHED');
        console.log(`max word arr length: ${arr.length}`)
        terminateAssemblySession();
        closeSocket();
        return true
      } 
      return false
    }
    

    //compare strings index and return t/f for match
  
    const compareStrings = (a,b) => {
        let result
        result = JSON.stringify(a) === JSON.stringify(b)
        if (result === true) {
            console.log(`compared true`)
        }
        else {
            console.log(`compared false`)
        }
        return result
    }


    //this function creates an empty array of objects to store transcribed utterances
    let pushResponsesToArray = (preProcessedArray, readingPrompt) => {

      let arr = []
      for (const [index, name] of readingPrompt.entries()) {
        let match = ""
        let cue = readingPrompt[index]
        let response = preProcessedArray[index].text

        console.log(`RESPONSE: ${JSON.stringify(response)}`)

        let evaluation = compareStrings(cue, response)
        evaluation ? match = 'true' : match = 'false'

          arr.push({
            cue: readingPrompt[index],
            response: preProcessedArray[index].text,
            match: match
          })
                }
      // console.log(`object array!: ${JSON.stringify(arr)}`)
      return arr
    }


    const showResponse = (arr) => {
       
      for (const [index, name] of arr.entries()) {
        console.log(`ENTRIES ${arr[index].response}`)
        // console.log(`ENTRIES`)
        msg+= arr[index].response + ' '

          
      }
  }



    const terminateAssemblySession = async () => {
      socket.send(JSON.stringify({terminate_session: true}))
    }

    const closeSocket = () => {
      socket.close();
      console.log(socket.readyState);
      socket = null;
    }
    
        /** *********  END FUNCTIONS ************ */




// runs real-time transcription and handles global variables
//main entry point
const run = async () => {

  if (isRecording) { 
    if (socket) {
      socket.send(JSON.stringify({terminate_session: true}));
      socket.close();
      socket = null;
    }

    if (recorder) {
      recorder.pauseRecording();
      recorder = null;
    }
  } else {
      const response = await fetch('http://localhost:8000'); // get temp session token from server.js (backend)
      const data = await response.json();

    if(data.error){
      alert(data.error)}

    const { token } = data;

    // establish wss with AssemblyAI (AAI) at 16000 sample rate
    socket = await new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`);
    

    // handle incoming messages to display transcription to the DOM
    // this is the message returned from assembly.ai
    const texts = {};
    socket.onmessage = (message) => {
      console.log("BACK AT THE TOP")
     
      const res = JSON.parse(message.data);
      console.log('res: ', res);

      let preProcessedArray = res.words
      console.log(`intermediate array: ${JSON.stringify(preProcessedArray)}`)

      if (!Array.isArray(res.words) || !res.words.length) {
        console.log(`no array yet`)
        // array does not exist, is not an array, or is empty
        // ⇒ do not attempt to process array

      } else {
          // checkForMaxWords(preProcessedArray, maxWords) ? pushResponsesToArray(preProcessedArray, readingPrompt) : console.log(`max words false ${preProcessedArray.length}`)

          if (checkForMaxWords(preProcessedArray, maxWords)) {
            userResponse = pushResponsesToArray(preProcessedArray, readingPrompt)
            console.log(`FINISHED MAKING OBJECT ARRAY ${JSON.stringify(userResponse)}`)
            showResponse(userResponse)
          }

          //truncate res array if length greather than maxWords
          if (preProcessedArray.length > 5) {
            console.log(`array length greater than 5`)
            console.log(`over 5 length ${preProcessedArray.length}`)
            let trimmedArray = preProcessedArray.splice(4, 1) //needs work for number of elements to delete
            console.log(`trimmed array: ${trimmedArray}`)
          }
             
      }

      
 
      //this takes the value of audio_start from res object (which is 0). Zero then becmoes the key in the destructurin process. This is why in the new 'text' object,  res.text is at index 0. I still am not clear why it looks why res.text is being destructured to an object according to the cl, but looks like an array in the syntax. It is not in array format until Object.keys is applied to 'texts' object. Object.keys returns an array.. but the keys array object below does not have the text! 
      

      //TODO: evaluate utterances before showing on screen

      

      //print utterances
      // texts[res.audio_start] = res.text;
      
      // const keys = Object.keys(texts);
        

      // keys.sort((a, b) => a - b);

      // // console.log('Keys sorted', keys);
      

      // for (const key of keys) {
      //   //need to decipher this 
      //   if (texts[key]) {

      //     msg += ` ${texts[key]}`;
      //   }
      // }

      messageEl.innerText = msg;
    }; //end 'on message' block

    socket.onerror = (event) => {
      console.error(event);
      socket.close();
    }
    
    socket.onclose = event => {
      console.log('CLOSING SOCKET: ', event);
      socket = null;
    }

    socket.onopen = () => {
      // once socket is open, begin recording
      messageEl.style.display = '';
      navigator.mediaDevices.getUserMedia({ audio: true }) //this opens client media (asks permission first)
        //pass the media stream to RecordRTC object
        .then((stream) => {
          recorder = new RecordRTC(stream, {
            type: 'audio',
            mimeType: 'audio/webm;codecs=pcm', // endpoint requires 16bit PCM audio
            recorderType: StereoAudioRecorder,
            timeSlice: 250, // set 250 ms intervals of data that sends to AAI, data sent to 'ondataavailableblob' every 250 ms
            desiredSampRate: 16000,
            numberOfAudioChannels: 1, // real-time requires only one channel
            bufferSize: 4096,
            audioBitsPerSecond: 128000,
            //read about ondataavailable here: https://www.w3.org/TR/mediastream-recording/
            //ondataavailable is a method of the webRTC api, but is being used by recordRTC
            ondataavailable: (blob) => {
              //FileReader() reads incoming stream.  https://developer.mozilla.org/en-US/docs/Web/API/FileReader
              //QUESTION: How does FileReader do this continuously? How does it know when to stop?
              const reader = new FileReader();

              //.onload is called when the file has been successfully loaded, so when audio is received, this happens
              //data is sent to assembly ai when onload happens
              //QUESTION: how does reader know to receive the blob? I don't see it passed in.. Answer: below, the blob is passed to the FileReader() object named 'reader' which declared above. reader.readAsDataURL(blob); can actually be set right after 'reader' is declared. The location appears to be agnostic
              reader.onload = () => {
                //convert sream data (blob) audio to base64
                const base64data = reader.result;

              

                // if socket is open, send data to socket endpoint
                if (socket) {
                  //what's happenong with the split... the blog starts with 'base64,'. split returns an array which in this case will have 'base64' at index 0. Since the data we want (the data after 'base64,') is at index [1], we indicate that with [1] after the string to split on
                  socket.send(JSON.stringify(
                    { audio_data: base64data.split('base64,')[1]}
                    ));
                }
              };
              //this is how blob is passed to reader
              reader.readAsDataURL(blob);
            },
          });

          recorder.startRecording();
        })
        .catch((err) => console.error(err));
    };
  }



  isRecording = !isRecording; //return isRecording value to false
  console.log('is recording end of script: ', isRecording);
  buttonEl.innerText = isRecording ? 'Stop' : 'Record';
  titleEl.innerText = isRecording ? 'Click stop to end recording!' : 'Click start to begin recording!';
};

buttonEl.addEventListener('click', () => run());
