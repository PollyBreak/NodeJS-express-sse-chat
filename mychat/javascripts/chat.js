document.addEventListener('DOMContentLoaded', function () {
    const chatWindow = document.getElementById("chat-window");
    const inputWindow = document.getElementById("new-message");
    const sendMessageForm = document.getElementById("input-window");
    const changeNameButton = document.getElementById("change-name");
    const name = document.getElementById("name");

    //EventSource opens a persistent connection to an HTTP server which will send events
    const sse = new EventSource('http://localhost:3000/sse');

    sendMessageForm.addEventListener('submit', (event)=>{
        event.preventDefault();
        const message = inputWindow.value.trim();
        console.log("Send button was clicked")
        if (message === "") {
            
        } else {
            inputWindow.value = ""
            sendMessage(message);
        }
    })

    function addMessage(message) { //adding message to the screen (div)
        console.log("creating a message paragraph")
        const messageParagraph = document.createElement('p');
        messageParagraph.textContent = message;
        chatWindow.appendChild(messageParagraph);
        messageParagraph.classList.add("message-paragraph");
    }

    function sendMessage(message) {
        console.log('send message: "'+message +'" from: '+name.value)
        //fetch is used to send requests
        fetch('http://localhost:3000/chat?message=' + encodeURIComponent(message) + '&name=' + encodeURIComponent(name.value), {method: 'GET'})
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to send message to the server');
                }
            })
            .catch(error => console.error(error));
    }

    sse.onopen =function (){
        console.log("sse opened");
    }

    sse.onmessage = function (event) { //then the message from the client is received
        const data = JSON.parse(event.data);
        console.log('get message: "'+data.message +'" from: '+data.name)
        addMessage(data.name + ": " + data.message);
    };


    changeNameButton.addEventListener('click', (event)=>{
        event.preventDefault();
        if (name.hasAttribute('disabled')){
            name.removeAttribute('disabled');
        } else {
            name.setAttribute("disabled", "true");
        }
    })

})
