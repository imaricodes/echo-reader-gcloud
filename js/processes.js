



//pass in array
export function processCue (readingPrompts) {
    let arr = []
    
    const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
    let sentenceToDisplay = readingPrompts[1].split(' ')

    let sentenceNoPunctuation = readingPrompts[1].replace(regex, '')

    let sentenceToEvaluateArray = sentenceNoPunctuation.split(' ')

    return{
        display: sentenceToDisplay, //array  
        evaluate: sentenceToEvaluateArray //array
    }
}



let normalizeArrayLength = (maxWords, responseArray) => {
    if (maxWords === responseArray.length) {
        return responseArray
    } else if (maxWords > responseArray.length) {
        //response is shorter than cue, add empty strings
        let difference = maxWords-responseArray.length
        console.log('dif  ', difference)
        let index = 0
        for (index; index < difference; index++) {
            responseArray.push(" ")   
        }
      return responseArray
    } else if (maxWords < responseArray.length) {
        //response is longer than cue, truncate
        let difference = responseArray.length - maxWords
        let slicedArray = responseArray.slice(0, -(difference))
        console.log('SLICED ARRAY:', slicedArray)
        return slicedArray
    }    
}



export function processResponse (response, maxWords) {
    console.log('PROCESSING RESPONSE...')
    //response is passed in as a string
    
    let sentenceToDisplayArray = response.split(' ')

    console.log('SENTENCE TO DISPLAY ARRAY PROCESS RESPONSE', sentenceToDisplayArray)

    let sentenceToDisplay = normalizeArrayLength(maxWords, sentenceToDisplayArray)
    
    
    console.log('SENTENCE TO DISPLAY INSIDE PROCESS RESPONSE', sentenceToDisplay)
    console.log('SENTENCE TO DISPLAY INSIDE PROCESS RESPONSE TYPE', typeof sentenceToDisplay)
    
    
    // let sentenceNoPunctuation = response.replace(regex, '')
    // let sentenceToEvaluateArray = sentenceNoPunctuation.split(' ')
    
    const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
    let responseEvaluateArray = response.replace(regex, '').split(' ')
    
    //normalize sentence to display length match cue array length
    let sentenceToEvaluateArray = normalizeArrayLength(maxWords, responseEvaluateArray)




    return {
        display: sentenceToDisplay, //array
        
        evaluate: sentenceToEvaluateArray //array

    }
}

