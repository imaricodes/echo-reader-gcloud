



//pass in array
function processCue (readingPrompts) {
    let arr = []
    
    const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
    let sentenceToDisplay = readingPrompts[1].split(' ')
    // console.log(`DISPLAY ARRAY: ${sentenceToDisplay}`)
    // arr.push({display: sentenceToDisplay})

    let sentenceNoPunctuation = readingPrompts[1].replace(regex, '')
    // console.log(`SENTENCE NO PUCTUATION ${sentenceNoPunctuation}`)

    let sentenceToEvaluateArray = sentenceNoPunctuation.split(' ')
    // console.log(`SENTENCE TO EVALUATE ARRAY ${sentenceToEvaluateArray}`)
    // console.log(`success`)

    // arr.push({evaluate: sentenceToEvaluateArray})
    // console.log(`INSIDE PROCESS CUE ARRAY ${JSON.stringify(arr)}`)
    return{
        display: sentenceToDisplay, //array  
        evaluate: sentenceToEvaluateArray //array
    }
}

//pass in string
function processResponse (response) {
    
    const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
    let sentenceToDisplay = response.split(' ')
    // console.log(`DISPLAY ARRAY: ${sentenceToDisplay}`)

    let sentenceNoPunctuation = response.replace(regex, '')
    // console.log(`SENTENCE NO PUCTUATION ${sentenceNoPunctuation}`)

    let sentenceToEvaluateArray = sentenceNoPunctuation.split(' ')
    // console.log(`SENTENCE TO EVALUATE ARRAY ${sentenceToEvaluateArray}`)
    // console.log(`success`)
    return {
        display: sentenceToDisplay, //array
        
        evaluate: sentenceToEvaluateArray //array

    }
}

