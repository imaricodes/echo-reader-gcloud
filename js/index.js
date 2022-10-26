
//'npm run client' to start browser client

// required dom elements
const buttonEl = document.getElementById('start-button');



const titleEl = document.getElementById('real-time-title');

let studentReadImg = document.querySelector('.student-read-img')

// set initial state of application variables
// messageEl.style.display = 'none';
let isRecording = false;
let socket;
let recorder;
let sessionResults;
let sessionButton;
// let msg = '';

let maxSessionTime = 5;

let readingPrompts = [
  'I like apples, oranges, and feet.',
  'My bees do not sting.'
  
]


let processedCue;
processedCue = processCue(readingPrompts);

let maxWords = processedCue.display.length;
console.log('set maxwords to', maxWords)


console.log(`INITAL PROCESSED CUE: ${JSON.stringify(processedCue)}`)


let goButton = createGoButton()
// const goButton = document.getElementById('goButton')

/** *********  FUNCTIONS ************ */

    let checkForMaxWords = (arr, maxWords) => {
      if (arr.length > maxWords) {
        console.log('MAX WORDS REACHED');
        console.log(`current array length: ${arr.length}`)
        
        // terminateAssemblySession();
        // closeSocket();
        return true
      } else {
        console.log('MAX WORDS NOT REACHED')
        return false
      }
    }
    

    //compare strings index and return t/f for match
    //TODO: compare lower case strings, remove punctuation before comparison.. comparision happens after final transcript
    const compareStrings = (a,b) => {
        let result

        result = a === b 

        if (result === true) {
            console.log(`compared true`)
        }
        else {
            console.log(`compared false`)
        }
        return result
    }


    //this function returns an array of objects
    let evaluateSession = (cueObj, responseObj) => {
      
      let cueEvaluate = cueObj.evaluate.map( (item => item))
      let cueDisplay = cueObj.display.map( (item => item))
      
      let responseEvaluate = responseObj.evaluate.map( (item => item))
      let responseDisplay = responseObj.display.map( (item => item))
      

 
      let arr = []
      arr.push(responseDisplay)
      arr.push(cueDisplay)

      for (const [index, name] of cueEvaluate.entries()) {
        console.log(`cue evaulate array index:  ${cueEvaluate[index]} , ${responseEvaluate[index]}`)
        let cue = cueEvaluate[index]
        let response = responseEvaluate[index]
        let match = ""

        let evaluation = compareStrings(cue, response)
        evaluation ? match = 'true' : match = 'false'

          arr.push({
            cueWord: cue,
            responseWord: response,
            match: match,
            responseDisplayWord: responseDisplay[index]
          })
                }
      console.log(`evaluated array of objects!: ${JSON.stringify(arr)}`)
      return arr
    }


    const terminateAssemblySession = async () => {
      console.log('assembly session terminated')
      socket.send(JSON.stringify({terminate_session: true}))
    }

    const closeSocket = () => {
      socket.close();
      console.log(`socket state: ${socket.readyState}`);
      socket = null;
    }
    


    const calculateTimeOut = (startSessionTime, maxSessionTime) => {
      let endTime = Date.now();
      let elapsedSessionTime = (endTime - startSessionTime)/1000;
      let result = false;  
      console.log('elapsed session time' , elapsedSessionTime)
        
      if (elapsedSessionTime >= maxSessionTime) {
        result = true;
        console.log('TIMED OUT!, close session and socket', result)
        // terminateAssemblySession();
        // closeSocket();
        return result
      } else { 
        return result;
      }
      

    }



        /** *********  END FUNCTIONS ************ */


// runs real-time transcription and handles global variables
//main entry point
const run = async () => {
  
  //display selected cue, fixed to index 1 of reading Prompts for now, dynamic later
  displayCue(processedCue)

  if (isRecording) { 
    //if socket is open, close it
    if (socket) {
      socket.send(JSON.stringify({terminate_session: true}));
      socket.close();
      socket = null;
    }
    //if instance of recorder, pause recording and null recorder instance
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
    
    let startSessionTime = Date.now(); 
    // handle incoming messages to display transcription to the DOM
    // this is the message returned from assembly.ai
    const texts = {};
    socket.onmessage = (message) => {
      console.log("BACK AT THE TOP")
    
      const res = JSON.parse(message.data);
      
      console.log('On message mesage type: ', JSON.stringify(res.message_type))
      if (res.message_type == "SessionBegins") {
          console.log('first beer on me')
          console.log('is there an array? ', res.words)
      }
      
      // calculateTimeOut(startSessionTime, maxSessionTime)
      /** process returned data */
      if (typeof res.words == "undefined") {
        console.log('array undefined return to top, checking for new message')
        calculateTimeOut(startSessionTime, maxSessionTime)
        return
      } else {
          if (!res.words.length) {
            calculateTimeOut(startSessionTime, maxSessionTime)
            console.log('no length')
          }
          //if array exists:
          if (res.words.length) {
            console.log('partial array 202: ', JSON.stringify(res.words))
            console.log('array has length of: ', res.words.length)

            
            //if array exists, less than max words, but time is out:
            if (checkForMaxWords(res.words, maxWords)) {
              // terminateAssemblySession();
              // recorder.pauseRecording();
              if (res.message_type == "FinalTranscript") {
                console.log('isRecording state during final transscipt execution', isRecording)
                terminateAssemblySession();
                closeSocket();
                recorder.stopRecording()
                console.log(`FINAL TRANSCRIPT received, session terminated`)
                
                // console.log('new array length ', res.words)
                let processedResponse = processResponse(res.text, maxWords)
                sessionResults = evaluateSession(processedCue, processedResponse)
                console.log(`SESSION RESULTS:`,JSON.stringify(sessionResults) )  
                displayResponses(sessionResults)
              } //TODO: why not getting to this time out block?
            } else if (calculateTimeOut(startSessionTime, maxSessionTime)) {
              console.log('array is present, but time is up, proceed with processing')
              console.log('EVALUATE NOW')
            }
          }
   
      }
    

    }; //end 'on message' block

    socket.onerror = (event) => {
      console.error(event);
      socket.close();
    }
    
    socket.onclose = event => {
      console.log('CLOSING SOCKET: ', event);
      socket = null;
    }

    // once socket is open, , create instance of recordRTC, begin recording
    socket.onopen = () => {
      
      // messageEl.style.display = '';
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
    console.log('end of else block, isRecording State=', isRecording)

  }


  isRecording = !isRecording; 
  // buttonEl.innerText = isRecording ? 'Cancel' : 'Record';
  // titleEl.innerText = isRecording ? 'Click stop to end recording!' : 'Click start to begin recording!';
};


// sessionButton.addEventListener('click', () => {
//   run()
// });

console.log(goButton)

let cardStageMessage = createCardStageMessage('Echo Reader uses AI technology to improve reading skills.')
// let createControlsMessage = createControlsMessage('')

goButton.addEventListener('click', () => {
  goButton.remove();
  // createCardStageMessage('Click the start button. Read the sentence presented here when the countdown completes')
  createControlsMessage('Click the start button. Read the sentence presented below when the countdown completes')
  sessionButton = createSessionButton();
  cardStageMessage.remove()
  studentReadImg.remove()
  // cardStage.remove()
  
  console.log('go button removed');
})