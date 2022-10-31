import  {displayCue, createGoButton, createSessionButton, createCardStageMessage, createControlsMessage} from "./displayUtilities.js"

import {processCue, processResponse} from "./languageProcessing.js"

import {io} from 'socket.io-client'

const socket = io('http://localhost:3000')


socket.on('connect', () => {
    console.log(`you connected with id: ${socket.id}`)
    
})


// required dom elements
const buttonEl = document.getElementById('start-button');



const titleEl = document.getElementById('real-time-title');

let studentReadImg = document.querySelector('.student-read-img')

// set initial state of application variables
// messageEl.style.display = 'none';
let isRecording = false;

let recorder;
let sessionResults;
let sessionButton;
// let msg = '';

let maxSessionTime = 6;
console.log('MAX TIME ', maxSessionTime)

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
        // console.log('TIMED OUT!, close session and socket', result)
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
export const run = async () => {
  
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
   
      

    //TODO: CREATE SOCKET IO
    const socket = io('http://localhost:3000')

    socket.on('connect', () => {
        console.log(`you connected with id: ${socket.id}`)   
    })
    
    //start timer
    let startSessionTime = Date.now(); 

// 

    console.log('end of else block, isRecording State=', isRecording)
  }




  //END SOCKET IO LOGIC

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
