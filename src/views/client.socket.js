const socket = io()

//Obtenemos fecha del servidor
let date = new Date()

//Capturamos elementos del catalogo del DOM:
const newProductForm = document.getElementById('newProductForm')
const titleInput = document.getElementById('titleInput')
const priceInput = document.getElementById('priceInput')
const thumbnailInput = document.getElementById('thumbnailInput')

//capturamos elementos del chat del DOM:
const messageForm = document.getElementById('messageForm')
const emailInput = document.getElementById('emailInput')
const nameInput = document.getElementById('nameInput')
const lastNameInput = document.getElementById('lastNameInput')
const ageInput = document.getElementById('ageInput')
const aliasInput = document.getElementById('aliasInput')
const avatarInput = document.getElementById('avatarInput')
const messageInput = document.getElementById('messageInput')
const messagesPool = document.getElementById('messagesPool')

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
function getTimesTamp(){
    let [date, time] = new Date().toLocaleString('en-GB').split(', ');
    const messageDateTime = date + ' - ' + time;
    return messageDateTime
}

const submitChatHandler = (event) => {
    event.preventDefault()

    const messageInfo = {
        author: {
            userEmail: emailInput.value,
            name: nameInput.value,
            lastName: lastNameInput.value,
            age: ageInput.value,
            alias: aliasInput.value,
            avatar: avatarInput.value,
        },
        message: {
            message:messageInput.value,
            timestamp: getTimesTamp()
        }
    }

    console.log('messageInfo on Submit',messageInfo)
    sendMessage(messageInfo)
}



const renderMessage = (messageInfo) => {
    //NORMALIZACION

    //MessageAuthor Schema:
    const author = new normalizr.schema.Entity("author", {}, { idAttribute: "userEmail" })
    //Message Schema:
    const message = new normalizr.schema.Entity(
    "message",
    { author: author },
    { idAttribute: "_id" }
    );
    const schemaMessages = new normalizr.schema.Entity("messages", { messages: [message], messageTimestamp: String });



    //Denormalizo mensajes
    const denormalizedMessages = normalizr.denormalize(messageInfo.result, schemaMessages, messageInfo.entities )

    const html = denormalizedMessages.messages.map( msginfo => {
        console.log('msginfo',msginfo)
        const msg = msginfo._doc
        return(
            `<div>
                <img src=${msg.author.avatar} style="width:25px;">
                <strong style="color:blue">${msg.author.userEmail} </strong>
                <span style="color:brown">[${msg.message.timestamp}]: </span>
                <em style="color:green">${msg.message.message}</em>
            </div>`
    )
}).join(" ")
    messagesPool.innerHTML = html
}

const sendMessage = (messageInfo) => {
    socket.emit('client:newMessage', messageInfo)
}

socket.on('server:renderMessages', renderMessage)

messageForm.addEventListener('submit', submitChatHandler)