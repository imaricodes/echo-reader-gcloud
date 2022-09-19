



//pass in array
function processCue (readingPrompts) {
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

//pass in string
function processResponse (response) {
    
    const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
    let sentenceToDisplay = response.split(' ')

    let sentenceNoPunctuation = response.replace(regex, '')

    let sentenceToEvaluateArray = sentenceNoPunctuation.split(' ')

    return {
        display: sentenceToDisplay, //array
        
        evaluate: sentenceToEvaluateArray //array

    }
}

