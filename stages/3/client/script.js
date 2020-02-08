const el = {};

/* Remove all child elements from a given element */ 
function removeContentFrom(what) {
  while (what.firstElementChild) {
    what.firstElementChild.remove();
  }
}

/* Add an array of messages to the page */
function showMessages(messages, where) {
  for (const message of messages) {
    const li = document.createElement('li');
    li.textContent = message; 
    where.appendChild(li);
  }
}

async function loadMessages() {
  const response = await fetch("messages");
  let messages;
  if (response.ok) {
    messages = await response.json()
  } else {
    messages = [ "failed to load messages :-("];
  }
  removeContentFrom(el.messagelist);
  showMessages(messages, el.messagelist);
}

/* add a message if enter pressed */
function checkKeys(e) {
 if (e.target == el.message) {
   if (e.key == "Enter") {
     sendMessage();
   }
 }
}

/** Use fetch to post a JSON message to the server */
async function sendMessage() {
  const payload = { msg: el.message.value };
  console.log("Payload", payload);
  
  const response = await fetch("messages", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (response.ok) {
    el.message.value="";
    const updatedMessages = await response.json();
    removeContentFrom(el.messagelist);
    showMessages(updatedMessages, el.messagelist);
  } else {
    console.log("failed to send message", response);
  }

}

/** 
 * Page elements used in the program are
 * setup here for convenience.
 */
function prepareHandles() {
  el.messagelist = document.querySelector("#messagelist");
  el.message = document.querySelector("#message");
  el.send = document.querySelector("#send");  
}


function addEventListeners() {
  el.send.addEventListener("click", sendMessage);
  el.message.addEventListener("keyup", checkKeys);  
}

function pageLoaded() {
  prepareHandles();
  addEventListeners();
  loadMessages();
}

window.addEventListener("load", pageLoaded);
