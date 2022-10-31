import {socket} from "./index"


export let startWebMic = () => {

    // messageEl.style.display = '';
    navigator.mediaDevices.getUserMedia({ audio: true }) //this opens client media (asks permission first)
    //pass the media stream to RecordRTC object
    .then((stream) => {
      let recorder = new RecordRTC(stream, {
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
            const base64data = reader.result.split('base64,')[1];
            // console.log('stream base62', JSON.stringify(base64data))
            // console.log('stream base62', base64data.split('base64,')[1])
            console.log('stream base62',  typeof base64data)

          

            // if socket is open, send data to socket endpoint
          //   if (socket) {
          //     //what's happenong with the split... the blog starts with 'base64,'. split returns an array which in this case will have 'base64' at index 0. Since the data we want (the data after 'base64,') is at index [1], we indicate that with [1] after the string to split on

          //TODO: Route stream to socket io

          //     socket.send(JSON.stringify(
          //       { audio_data: base64data.split('base64,')[1]}
          //       ));
          //   }
          // let {audioData} = base64data.split('base64,')[1]
          //   console.log('AUDIO DATA ', typeof audioData)

            socket.emit('audioStream', base64data)
              
                            
                // socket.emit('audioStream', 
            //     {audio_data: base64data.split('base64,')[1]}
            //         )
          };
          //this is how blob is passed to reader
          reader.readAsDataURL(blob);

        },
      });

      recorder.startRecording();
    })
    
    .catch((err) => console.error(err));
    
  }