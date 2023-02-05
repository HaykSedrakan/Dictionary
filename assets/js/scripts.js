// Todo : получить данные по API
// Todo : Вставить слово в контеӣнер (results-word)
// Todo : Вставить функционал для воспроизвидение звука
// Todo : Вставить получение данне вставить в контеинер с резултатами 

let state = {
    word:'',
    meanings:[],
    phonetics:[]
}

const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/'
const input = document.querySelector('#word-input')
const form = document.querySelector('.form')
const containerWord = document.querySelector('.results-word')
const soundButton = document.querySelector('.results-sound')
const resultsWrapper = document.querySelector('.results ')
const resultsList = document.querySelector('.results-list')
const errorContainer = document.querySelector('.error')

const showError = (error) => {
    errorContainer.style.display = 'block'
    resultsWrapper.style.display = 'none'
    errorContainer.textContent = error.message
}

const renderDefinitions = (itemDefinitions) => {
   const example = itemDefinitions.example 
   ? ` <div class = 'results-item__example'>
        <p>Example:  <span>${itemDefinitions.example}</span></p>
   </div>` 
   : ''

   return `
    <div class="results-item__definitions">
         <p>${itemDefinitions.definition}</p>
         ${example}
    </div>
   `
}

const getDefinitions = (definitions) => {
    return definitions.map(renderDefinitions).join("")
}

const renderItem = (item) => {
    console.log(getDefinitions(item.definitions))
    return `
    <div class="results-item">
        <div class="results-item__part">${item.partOfSpeech}</div>
        <div class="results-item__definitions">
        ${getDefinitions(item.definitions)}
        </div>
  </div>`
}

const showResults = () => {
    resultsWrapper.style.display = 'block'
    errorContainer.style.display = 'none'

    resultsList.innerHTML = ''

    state.meanings.forEach(item => (resultsList.innerHTML += renderItem(item))) 
}

const insertMainWord = () => {
    containerWord.innerHTML = state.word
}

const hendleSubmit = async (e) => {
    e.preventDefault();

    if (!state.word.trim()) return;
  
    try {
      const response = await fetch(`${url}${state.word}`)
      const data = await response.json()
  
      if (response.ok && data.length) {

        const item = data[0]

        state = {
            ...state,
            meanings:item.meanings,
            phonetics:item.phonetics
        }

        insertMainWord()
        showResults()
        }else{
            showError(data)
        }
      }catch (err) {
      console.log(err)
    }
}


const hendleKeyup = (e) => {
    const  value = e.target.value

    state.word = value
}

const hendleSound = () => {
    if(state.phonetics.length){
        const sound = state.phonetics[0]

        if(sound.audio){
            new Audio(sound.audio).play()
        }
    }
}

//Events

input.addEventListener('keyup',hendleKeyup)
form.addEventListener('submit',hendleSubmit)
soundButton.addEventListener('click',hendleSound)
