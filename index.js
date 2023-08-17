import { process } from '/env.js'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
    apiKey: process["env"]["OPENAI_API_KEY"]
})

const openai = new OpenAIApi(configuration)
const conversationArr = [
    {
        role: 'system',
        content: 'You are a useful assistant.'
    }
]
const chatbotConversation = document.getElementById('chatbot-conversation')
document.addEventListener('submit', (e) => {
    e.preventDefault()
    const userInput = document.getElementById('user-input')
    const newSpeechBubble = document.createElement('div')
    newSpeechBubble.classList.add('speech', 'speech-human')
    chatbotConversation.appendChild(newSpeechBubble)
    newSpeechBubble.textContent = userInput.value
    conversationArr.push({
        role: 'user',
        content: userInput.value
    })
    userInput.value = ''
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight
    fetchReply()
})
async function fetchReply(){
    var x = document.getElementById("thinging");
    x.style.display = "block";
    const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: conversationArr,
    })
    x.style.display = "none";
    conversationArr.push(response.data.choices[0].message)
    renderTypewriterText(response.data.choices[0].message.content)
}
function renderTypewriterText(text) {
    const newSpeechBubble = document.createElement('div')
    newSpeechBubble.classList.add('speech', 'speech-ai', 'blinking-cursor')
    chatbotConversation.appendChild(newSpeechBubble)
    let i = 0
    const interval = setInterval(() => {
        newSpeechBubble.textContent += text.slice(i-1, i)
        if (text.length === i) {
            clearInterval(interval)
            newSpeechBubble.classList.remove('blinking-cursor')
        }
        i++
        chatbotConversation.scrollTop = chatbotConversation.scrollHeight
    }, 50)
}