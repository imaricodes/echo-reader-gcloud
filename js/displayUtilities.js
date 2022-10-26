

let cardStage = document.getElementById('card-stage')
let showResult = document.getElementById('displayResult')
let showCue = document.getElementById('displayCue')
let controls = document.querySelector('.controls')
let controlsMessage = document.querySelector('controls__message')


//Create elements and display responses

let displayResponses = (sessionResults) => {
    
    //this is length of the cue array
    const length = sessionResults[0].length

        //create response container
    let responseContainer = document.createElement("div")
    responseContainer.classList.add('response-container')
    responseContainer.setAttribute('id', 'response-container')
    cardStage.append(responseContainer)

    for (let i = 0; i < length; i++) {

        console.log('LOOPED ', i + 1)
        const newDiv = document.createElement("div")
      
        //add general class to new div (this works)
        newDiv.classList.add('word-res')

        if (sessionResults[i + 2].match == 'false') {
            newDiv.classList.add('false')
        } 

        //add id to new div, is this necessary? Probably not
        newDiv.id = `res-${i}`
        
        //this will be content from sessionResults
        const word = document.createTextNode(sessionResults[i + 2].responseDisplayWord);
    
        newDiv.appendChild(word);

        const parentDiv = document.getElementById("response-container")

        //append div that contains word
        parentDiv.appendChild(newDiv)
    }
}


//Create elements and display cue words

let displayCue = (processedCue) => {


    console.log('running display cue')
    const cueArray = processedCue.display.map(item => item)

    // console.dir(`HAM ${cueArray}`)

    const length = cueArray.length



    //create cue container
    let cueContainer = document.createElement("div")
    cueContainer.classList.add('cue-container')
    cueContainer.setAttribute('id', 'cue-container')
    cardStage.append(cueContainer)

    // cueContainer.setAttribute('id', 'cue-container')

    for (let i = 0; i < length; i++) {
        const newDiv = document.createElement("div")
      
        //add general class to new div (this works)
        newDiv.classList.add('word-cue')

        const word = document.createTextNode(processedCue.display[i]);
    
        newDiv.appendChild(word);

        const parentDiv = document.getElementById("cue-container")

        //append div that contains word
        parentDiv.appendChild(newDiv)

        // cardStage.appendChild(parentDiv)
    }
}


let displayInstructions = () => {
    let instructions = document.createElement("p")
    instructions.classList.add('instructions')
    cueContainer.setAttribute('id', 'instructions')
    instructions.innerText="After clicking start, wait for the countdown and read the sentence shown here."
    cardStage.append(instructions)

}

let createGoButton = () => {
    let goButton = document.createElement("button")
    goButton.classList.add('btn', 'btn--circle', 'btn--green', 'btn--text')
    goButton.setAttribute('id', 'goButton')
    goButton.innerText='Go'
    controls.append(goButton)

    return goButton
}

let createSessionButton = () => {
    let sessionButton = document.createElement("button")
    sessionButton.classList.add('btn', 'btn--circle', 'btn--green', 'btn--text')
    sessionButton.setAttribute('id', 'sessionButton')
    sessionButton.innerText='Start'
   

    controls.append(sessionButton)
    sessionButton.addEventListener('click', () => {
        console.log('session button clicked')
        run()
    })

    return sessionButton
}


let createCardStageMessage = (message) => {
    let cardStageMessage = document.createElement("p")
    cardStageMessage.classList.add('card-stage__message')
    cardStageMessage.setAttribute('id', 'card-stage__message')
    cardStageMessage.innerText = message;
    cardStage.append(cardStageMessage)
    
    return cardStageMessage
}

let createControlsMessage = (message) => {
    let controlsMessage = document.querySelector('.controls__message')
    controlsMessage.innerText = message;
    
}