
let showResult = document.getElementById('displayResult')
let showCue = document.getElementById('displayCue')


let displaySessionResults = (sessionResults) => {
    let resultArray = []
    sessionResults[0].map(item => resultArray.push(item))

    for (const [index] of resultArray.entries()){
        showResult.innerText+= `${resultArray[index]}\u00A0`
    }

    let cueArray = []
    sessionResults[1].map(item => cueArray.push(item))

    for (const [index] of cueArray.entries()){
        showCue.innerText+= `${cueArray[index]}\u00A0`
    }
}