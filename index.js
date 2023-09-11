import { process } from "/env.js";

const apiUrl = process["env"]["API_URL"];
var chat_id = false

const chatbotConversation = document.getElementById("chatbot-conversation");
const form = document.getElementById("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const userInput = document.getElementById("user-input");
  const newSpeechBubble = document.createElement("div");
  newSpeechBubble.classList.add("speech", "speech-human");
  chatbotConversation.appendChild(newSpeechBubble);
  var question = userInput.value;
  userInput.value = "";
  newSpeechBubble.textContent = question;
  chatbotConversation.scrollTop = chatbotConversation.scrollHeight;

  fetchReply(question);
});

const form2 = document.getElementById("form2");
form2.addEventListener("submit", (e) => {
  e.preventDefault();
  const userInput = document.getElementById("url_page");
  var url_page = userInput.value;
  userInput.value = "";

  const btn = document.getElementById("submit-btn2");
  btn.textContent = "Processing..."

  fetch(apiUrl+"load_url", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: url_page,
    }),
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    btn.textContent = "Process"
    alert(data.message)
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });

});

async function fetchReply(question) {
  var thinging = document.getElementById("thinging");
  thinging.style.display = "block";
  const postData = {
    question: question,
  };
  if(chat_id){
    postData['chat_id'] = chat_id
  }
  fetch(apiUrl+"prompt_route", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  })
  .then((response) => {
    if (!response.ok) {
      thinging.style.display = "none";
      alert("There an exception occur in the API, please try again!");
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    chat_id = data.chat_id
    thinging.style.display = "none";
    renderTypewriterText(data);
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });

}
function renderTypewriterText(data) {
  var text = data.response.content;
  const newSpeechBubble = document.createElement("div");
  newSpeechBubble.classList.add("speech", "speech-ai", "blinking-cursor");
  chatbotConversation.appendChild(newSpeechBubble);
  newSpeechBubble.textContent += text;

  newSpeechBubble.classList.remove("blinking-cursor");
  const reportA = document.createElement("a");
  reportA.textContent = "Report";
  reportA.setAttribute("href", "javascript:;");
  reportA.setAttribute("message-id", data.message_id);

  reportA.addEventListener("click", (e) => {
    e.preventDefault();

    fetch(apiUrl+"report_answer", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chat_id,
        message_id: data.message_id,
      }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      console.log("response.json()", response.json());
      return response.json();
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
  
  });

  chatbotConversation.appendChild(reportA);

  chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
}

