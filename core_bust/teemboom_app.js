function teemboom_app(config, roomDetails){
    let teemboomClass = new teemboomChatClass({
        config: config,
        roomDetails: roomDetails,
        populate: populate,
        addMessage: addMessage,
        addUserConversation: addUserConversation,
        updateUserConversation: updateUserConversation,
        updateMessage: updateMessage,
        removeMessage: removeMessage,
        messageBoxId: 'teemboom_messages'
    })


    function populate(){

		this.main_div.innerHTML = `
        <div id='teemboom_core_bust'>
            <div id='teemboom_conversations'>
                <header id='teemboom_conversations_header'>Conversations</header>
                <div id="teemboom_convo_rooms">
                </div>
            </div>
            <div id='teemboom_chatMessages'>
                <div id="teemboom_current_room">
                    <div id="teemboom_current_room_pic"></div>
                    <div id="teemboom_current_room_name"></div>
                </div>
                <div id="teemboom_messages"></div>
                <div id="teemboom_sendMessage">
                    <div id="teemboom_smReplyCard">
                        <div style="width: calc(100% - 30px)">
                            <header></header>
                            <p></p>
                        </div>
                        <div id="teemboom_smReplyClose" style="cursor: pointer; width: 30px; height: 100%; display: flex; justify-content: center; align-items: center">
                            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22ZM8.96965 8.96967C9.26254 8.67678 9.73742 8.67678 10.0303 8.96967L12 10.9394L13.9696 8.96969C14.2625 8.6768 14.7374 8.6768 15.0303 8.96969C15.3232 9.26258 15.3232 9.73746 15.0303 10.0303L13.0606 12L15.0303 13.9697C15.3232 14.2625 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2625 15.3232 13.9696 15.0303L12 13.0607L10.0303 15.0303C9.73744 15.3232 9.26256 15.3232 8.96967 15.0303C8.67678 14.7374 8.67678 14.2626 8.96967 13.9697L10.9393 12L8.96965 10.0303C8.67676 9.73744 8.67676 9.26256 8.96965 8.96967Z" fill="#000000"></path> </g></svg>
                        </div>
                        
                    </div>
                    <textarea id="teemboom_sendMessageInput" placeholder="Send a Message"></textarea>
                    <div id="teemboom_sm_attachments"></div>
                    <div id="teemboom_scrollDown">
                     <svg width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.9297 2V22" stroke="#000000" stroke-width="2.256" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M19 16L14 21.1599C13.7437 21.4336 13.434 21.6519 13.0899 21.801C12.7459 21.9502 12.375 22.0271 12 22.0271C11.625 22.0271 11.2541 21.9502 10.9101 21.801C10.566 21.6519 10.2563 21.4336 10 21.1599L5 16" stroke="#000000" stroke-width="2.256" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                    </div>
                </div>
            </div>
        </div>
        `
        let sendMessageInput = document.getElementById("teemboom_sendMessageInput")
        sendMessageInput.addEventListener('keydown', (event)=>{
            if (event.key === 'Enter' && !event.shiftKey){
                event.preventDefault()
                this.sendMessage(sendMessageInput)
                clearReplyToMessage()
            }
        })
        let teeemboomScrollButton = document.getElementById('teemboom_scrollDown')
        teeemboomScrollButton.onclick = ()=>{
            this.scrollToBottom('teemboom_messages', true)
            teeemboomScrollButton.style.display = 'none'
        }
    }

    function addMessage(data){
        const chatMessages = document.getElementById('teemboom_messages')
    
        message_date = this.formatToDate(data.created)
        if (message_date !== this.message_date){
            let date_div = document.createElement('div')
            date_div.className = 'teemboom_msg_dating'
            let date_div_p = document.createElement('p')
            date_div_p.innerHTML = message_date
            console.log(message_date)
            date_div.appendChild(date_div_p)
            date_div.appendChild(document.createElement('div'))
            chatMessages.appendChild(date_div)
            this.message_date = message_date
        }
        let currentUser = this.roomGetUser(data.room_id)
        let messageUser = this.roomGetUser(data.room_id, data.user_id)
        let isUserMessage = data.user_id === currentUser._id
        let message = document.createElement('div')
        message.id = data._id
        message.className = 'teemboom_message'
        if (isUserMessage) message.className += ' teemboom_uM'
        let userProfile = document.createElement('div')
        userProfile.className = 'teemboom_messageUserProfile'

        if (data.deleted){
            message.appendChild(userProfile)
            let messageContent = document.createElement('div')
            messageContent.className = 'teemboom_messageContent'
            let p = document.createElement('p')
            p.className = 'teemboom_messageText'
            p.innerText = 'This message has been deleted'
            p.innerHTML += '<svg width="20px" height="20px" style="margin: 0 0 -4px 5px" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>cancelled</title> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="add" fill="#000000" transform="translate(42.666667, 42.666667)"> <path d="M213.333333,1.42108547e-14 C331.15408,1.42108547e-14 426.666667,95.5125867 426.666667,213.333333 C426.666667,331.15408 331.15408,426.666667 213.333333,426.666667 C95.5125867,426.666667 4.26325641e-14,331.15408 4.26325641e-14,213.333333 C4.26325641e-14,95.5125867 95.5125867,1.42108547e-14 213.333333,1.42108547e-14 Z M42.6666667,213.333333 C42.6666667,307.589931 119.076736,384 213.333333,384 C252.77254,384 289.087204,370.622239 317.987133,348.156908 L78.5096363,108.679691 C56.044379,137.579595 42.6666667,173.894198 42.6666667,213.333333 Z M213.333333,42.6666667 C173.894198,42.6666667 137.579595,56.044379 108.679691,78.5096363 L348.156908,317.987133 C370.622239,289.087204 384,252.77254 384,213.333333 C384,119.076736 307.589931,42.6666667 213.333333,42.6666667 Z" id="Combined-Shape"> </path> </g> </g> </g></svg>'
            messageContent.appendChild(p)
            message.appendChild(messageContent)
            chatMessages.appendChild(message)
            return
        }

        let profile_img = document.createElement('img')
        if (messageUser.profile_pic){
            profile_img.src = messageUser.profile_pic
        }else{
            profile_img.src = 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg'
        }
        userProfile.appendChild(profile_img)
        
        let messageContent = document.createElement('div')
        messageContent.className = 'teemboom_messageContent'
        if (data.reply_to){
            let parent = this.findRoomMessage(data.reply_to)
            if (parent){
                if (parent.deleted){
                    let parent_div = document.createElement('div')
                    parent_div.className = 'teemboom_message_parent'
                    let parentAuthor = document.createElement('header')
                    parentAuthor.innerText = 'This message has been deleted'
                    parentAuthor.innerHTML += '<svg width="15px" height="15px" style="margin: 0 0 -4px 5px" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>cancelled</title> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="add" fill="#000000" transform="translate(42.666667, 42.666667)"> <path d="M213.333333,1.42108547e-14 C331.15408,1.42108547e-14 426.666667,95.5125867 426.666667,213.333333 C426.666667,331.15408 331.15408,426.666667 213.333333,426.666667 C95.5125867,426.666667 4.26325641e-14,331.15408 4.26325641e-14,213.333333 C4.26325641e-14,95.5125867 95.5125867,1.42108547e-14 213.333333,1.42108547e-14 Z M42.6666667,213.333333 C42.6666667,307.589931 119.076736,384 213.333333,384 C252.77254,384 289.087204,370.622239 317.987133,348.156908 L78.5096363,108.679691 C56.044379,137.579595 42.6666667,173.894198 42.6666667,213.333333 Z M213.333333,42.6666667 C173.894198,42.6666667 137.579595,56.044379 108.679691,78.5096363 L348.156908,317.987133 C370.622239,289.087204 384,252.77254 384,213.333333 C384,119.076736 307.589931,42.6666667 213.333333,42.6666667 Z" id="Combined-Shape"> </path> </g> </g> </g></svg>'
                    parent_div.appendChild(parentAuthor)
                    messageContent.appendChild(parent_div)
                }else{
                    let parent_author = this.roomGetUser(data.room_id, parent.user_id)
                    let parent_div = document.createElement('div')
                    parent_div.className = 'teemboom_message_parent'
                    let parentAuthor = document.createElement('header')
                    parentAuthor.innerHTML = parent_author.username
                    let parentContent = document.createElement('p')
                    parentContent.innerHTML = parent.content
                    parent_div.onclick = ()=>{
                        let mm =document.getElementById(data.reply_to)
                        mm.scrollIntoView({ behavior: "smooth", block: "start" });
                        mm.style.filter = "brightness(50%)"
                        setTimeout(() => {
                            mm.style.filter = "brightness(100%)"
                        }, 800);
                    }
                    parent_div.appendChild(parentAuthor)
                    parent_div.appendChild(parentContent)
                    messageContent.appendChild(parent_div)
                }    
            }
        }
        let p = document.createElement('p')
        p.className = 'teemboom_messageText'
        p.innerText = data.content
        messageContent.appendChild(p)

        let span = document.createElement('span')
        span.innerText = this.formatTo12Hour(data.created)
        messageContent.appendChild(span)

        
        let messageOptions = document.createElement('div')
        messageOptions.className = 'teemboom_message_options'

        let replyButton = document.createElement('div')
        replyButton.innerHTML = '<svg viewBox="-0.5 0 28 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>reply</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"> <g id="Icon-Set" sketch:type="MSLayerGroup" transform="translate(-100.000000, -1193.000000)" fill="#000000"> <path d="M113,1208 C112.346,1208 109.98,1208.02 109.98,1208.02 L109.98,1213.39 L102.323,1205 L109.98,1196.6 L109.98,1202.01 C109.98,1202.01 112.48,1201.98 113,1202 C120.062,1202.22 124.966,1210.26 124.998,1214.02 C122.84,1211.25 117.17,1208 113,1208 L113,1208 Z M111.983,1200.01 L111.983,1194.11 C112.017,1193.81 111.936,1193.51 111.708,1193.28 C111.312,1192.89 110.67,1192.89 110.274,1193.28 L100.285,1204.24 C100.074,1204.45 99.984,1204.72 99.998,1205 C99.984,1205.27 100.074,1205.55 100.285,1205.76 L110.219,1216.65 C110.403,1216.88 110.67,1217.03 110.981,1217.03 C111.265,1217.03 111.518,1216.91 111.7,1216.72 C111.702,1216.72 111.706,1216.72 111.708,1216.71 C111.936,1216.49 112.017,1216.18 111.983,1215.89 C111.983,1215.89 112,1210.34 112,1210 C118.6,1210 124.569,1214.75 125.754,1221.01 C126.552,1219.17 127,1217.15 127,1215.02 C127,1206.73 120.276,1200.01 111.983,1200.01 L111.983,1200.01 Z" id="reply" sketch:type="MSShapeGroup"> </path> </g> </g> </g></svg>'
        replyButton.title = "Reply"
        replyButton.onclick = ()=>{
            replyToMessage(data, messageUser)
        }

        messageOptions.appendChild(replyButton)

        
        if (data.user_id === currentUser._id){
            let edit = document.createElement('div')
            edit.innerHTML = '<svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M20.8477 1.87868C19.6761 0.707109 17.7766 0.707105 16.605 1.87868L2.44744 16.0363C2.02864 16.4551 1.74317 16.9885 1.62702 17.5692L1.03995 20.5046C0.760062 21.904 1.9939 23.1379 3.39334 22.858L6.32868 22.2709C6.90945 22.1548 7.44285 21.8693 7.86165 21.4505L22.0192 7.29289C23.1908 6.12132 23.1908 4.22183 22.0192 3.05025L20.8477 1.87868ZM18.0192 3.29289C18.4098 2.90237 19.0429 2.90237 19.4335 3.29289L20.605 4.46447C20.9956 4.85499 20.9956 5.48815 20.605 5.87868L17.9334 8.55027L15.3477 5.96448L18.0192 3.29289ZM13.9334 7.3787L3.86165 17.4505C3.72205 17.5901 3.6269 17.7679 3.58818 17.9615L3.00111 20.8968L5.93645 20.3097C6.13004 20.271 6.30784 20.1759 6.44744 20.0363L16.5192 9.96448L13.9334 7.3787Z" fill="#0F0F0F"></path> </g></svg>'
            edit.title = "Edit"
            edit.onclick = ()=>{
                let editInput = document.createElement('textarea')
                editInput.className = "teemboom_messageEditInput"
                editInput.value = data.content
                editInput.addEventListener('keydown', (event)=>{
                    if (event.key === 'Enter' && !event.shiftKey){
                        event.preventDefault()
                        teemboomClass.editMessage(data._id, editInput.value)
                        editInput.remove()
                        messageOptions.appendChild(edit)
                    }
                })
                let closeEditInput = document.createElement('div')
                closeEditInput.innerHTML = 'X'
                closeEditInput.className = 'teemboom_messageEditClose'
                closeEditInput.onclick = ()=>{
                    editInput.remove()
                    closeEditInput.remove()
                    messageOptions.appendChild(edit)
                }
                messageContent.appendChild(closeEditInput)
                messageContent.appendChild(editInput)
                edit.remove()
            }
            messageOptions.appendChild(edit)

            let deleteButton = document.createElement('div')
            deleteButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 11V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 11V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>'
            deleteButton.title = 'Delete'
            deleteButton.onclick = ()=>{
                this.deleteMessage(data._id)
            }
            messageOptions.appendChild(deleteButton)
        }

        message.appendChild(userProfile)
        message.appendChild(messageContent)
        message.appendChild(messageOptions)
        chatMessages.appendChild(message)
        let at_bottom = this.scrollToBottom('teemboom_messages')
        if (!at_bottom){
            document.getElementById('teemboom_scrollDown').style.display = 'block'
        }
    }

    function replyToMessage(data, user){
        let reply_card = document.getElementById('teemboom_smReplyCard')
        let sendInput = document.getElementById('teemboom_sendMessageInput')
        
        if (!data && !user) {
            reply_card.style.display = 'none'
            sendInput.removeAttribute('data-reply_to')
            return
        }
        sendInput.setAttribute('data-reply_to', data._id)
        reply_card.style.display = 'flex'
        let author = reply_card.querySelector('header')
        author.innerText = user.username
        let message = reply_card.querySelector('p')
        message.innerText = data.content
        document.getElementById('teemboom_smReplyClose').onclick = ()=>{
            clearReplyToMessage()
        }
        sendInput.focus()
    }
    function clearReplyToMessage(){
        let reply_card = document.getElementById('teemboom_smReplyCard')
        let sendInput = document.getElementById('teemboom_sendMessageInput')
        reply_card.style.display = 'none'
        sendInput.removeAttribute('data-reply_to')
        return
    }



    function addUserConversation(data, prepend=false){
        let reciepent = this.roomGetOtherUser(data._id)
        const convo_div = document.getElementById('teemboom_convo_rooms')
        let room = document.createElement('div')
        room.className = "teemboom_convo_room"
        room.id = `teemboom_ur_${data._id}`

        let profile_img_cover = document.createElement('span')
        let profile_img = document.createElement('img')
        if (reciepent.profile_pic){
            profile_img.src = reciepent.profile_pic
        }else{
            profile_img.src = 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg'
        }
        profile_img_cover.appendChild(profile_img)
        room.appendChild(profile_img_cover)


        let content = document.createElement('div')
        content.className = "teemboom_cr_content"
        let content_header = document.createElement('header')
        content_header.innerText = reciepent.username
        content.appendChild(content_header)
        
        let last_message = document.createElement('p')
        if (data.recent_message){
            last_message.innerText += data.recent_message.content ? data.recent_message.content : '.'
        }else{last_message.innerText = '.'}
        content.appendChild(last_message)
        
        room.appendChild(content)

        let messageAlert = document.createElement('div')
        messageAlert.className = 'teemboom_ur_alert'
        if (data.unread_messages && data.unread_messages !== 0){
            messageAlert.style.display = 'flex'
            messageAlert.innerHTML = data.unread_messages
        
        }else {
            messageAlert.innerHTML = 0
        }
        room.appendChild(messageAlert)
        room.onclick = ()=>{
            this.loadRoomMessages(data._id)
            clearReplyToMessage()
        }
        if (prepend) convo_div.prepend(room)
        else convo_div.appendChild(room)
    }

    function updateUserConversation(data, clear=false, show_alert=true){
        convoDiv = document.getElementById(`teemboom_ur_${data.room_id}`)
        let alert=convoDiv.querySelector('.teemboom_ur_alert')
        if (clear){
            alert.innerHTML = 0;
            alert.style.display = 'none'
            this.clearUnreadMessaeges(data.room_id)
            updateCurrentRoom(this.roomGetOtherUser(data.room_id))
            for (let room of document.getElementsByClassName('teemboom_convo_room')){
                room.classList.remove('teemboom_convo_room_active')
            }
            convoDiv.classList.add('teemboom_convo_room_active')
            return
        }
        if (show_alert){
            alert.style.display = 'flex'
            alert.innerHTML = Number(alert.innerHTML) + 1  
            this.newUnreadMessage(data.room_id)          
        }
        let content = convoDiv.querySelector('.teemboom_cr_content').querySelector('p')
        content.innerText = data.content
    }

    function updateMessage(message_id, content){
        let message = ''
        if (document.getElementById(message_id)){
            message = document.getElementById(message_id)
        }else return
        message.querySelector('.teemboom_messageText').innerText = content
    }
    function removeMessage(message_id){
        let message = ''
        if (document.getElementById(message_id)){
            message = document.getElementById(message_id)
        }else return
        let messageContent = message.querySelector('.teemboom_messageContent')
        messageContent.innerHTML = ''
        let p = document.createElement('p')
        p.className = 'teemboom_messageText'
        p.innerText = 'This message has been deleted'
        p.innerHTML += '<svg width="20px" height="20px" style="margin: 0 0 -4px 5px" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>cancelled</title> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="add" fill="#000000" transform="translate(42.666667, 42.666667)"> <path d="M213.333333,1.42108547e-14 C331.15408,1.42108547e-14 426.666667,95.5125867 426.666667,213.333333 C426.666667,331.15408 331.15408,426.666667 213.333333,426.666667 C95.5125867,426.666667 4.26325641e-14,331.15408 4.26325641e-14,213.333333 C4.26325641e-14,95.5125867 95.5125867,1.42108547e-14 213.333333,1.42108547e-14 Z M42.6666667,213.333333 C42.6666667,307.589931 119.076736,384 213.333333,384 C252.77254,384 289.087204,370.622239 317.987133,348.156908 L78.5096363,108.679691 C56.044379,137.579595 42.6666667,173.894198 42.6666667,213.333333 Z M213.333333,42.6666667 C173.894198,42.6666667 137.579595,56.044379 108.679691,78.5096363 L348.156908,317.987133 C370.622239,289.087204 384,252.77254 384,213.333333 C384,119.076736 307.589931,42.6666667 213.333333,42.6666667 Z" id="Combined-Shape"> </path> </g> </g> </g></svg>'
        messageContent.appendChild(p)
        let profileImage = message.querySelector('.teemboom_messageUserProfile')
        profileImage.innerHTML = ''
    }
    function updateCurrentRoom(user){
        let img = document.getElementById('teemboom_current_room_pic')
        img.innerHTML = ''
        let image = document.createElement('img')
        image.src = user.profile_pic
        img.appendChild(image)

        let text = document.getElementById('teemboom_current_room_name')
        text.innerHTML = user.username
    }
}