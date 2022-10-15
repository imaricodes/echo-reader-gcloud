


let showResult = document.getElementById('displayResult')
let showCue = document.getElementById('displayCue')

//Create elements and display responses

let displayResponses = (sessionResults) => {
    
    const length = sessionResults[0].length


    for (let i = 0; i < length; i++) {
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
    
    const cueArray = processedCue.display.map(item => item)

    // console.dir(`HAM ${cueArray}`)

    const length = cueArray.length

    for (let i = 0; i < length; i++) {
        const newDiv = document.createElement("div")
      
        //add general class to new div (this works)
        newDiv.classList.add('word-cue')

        const word = document.createTextNode(processedCue.display[i]);
    
        newDiv.appendChild(word);

        const parentDiv = document.getElementById("cue-container")

        //append div that contains word
        parentDiv.appendChild(newDiv)
    }

}