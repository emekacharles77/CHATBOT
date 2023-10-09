const sendbtn=document.querySelectorAll("button")[1]
const chatInput=document.querySelector("textarea");
const chatbox=document.querySelector(".chatbox")
const chatbotToggler=document.querySelector(".chatbot-toggler")
const closebtn=document.querySelector(".close-btn")
// console.log(sendbtn,chatinput)


let userMessage=""
const API_KEY="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";
const inputHeight=chatInput.scrollHeight;

sendbtn.addEventListener("click", generate)
    function generate(){
        userMessage=chatInput.value.trim()
        if(!userMessage)return;
        // chatInput.style.height=`${inputHeight}px`
        chatInput.style.height= inputHeight + "px";
       

        function createChatLi(message, className){
            const chatLi=document.createElement("li");
            chatLi.classList.add("chat", className);
            let chatContent= className==="outgoing" ? `<p></p>` : `<span><i class="fa-solid fa-comments"></i></span><p>${message}</p>`;
            chatLi.innerHTML=chatContent;
            chatLi.querySelector("p").textContent= message;
            return chatLi;
           
        }
        chatbox.appendChild(createChatLi(userMessage, "outgoing"));
        chatbox.scrollTo(0, chatbox.scrollHeight),
        setTimeout(()=>{
            const incomingChatLi=createChatLi("responding......", "incoming")
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
            generateResponse(incomingChatLi)
        }, 600)

        function generateResponse(incomingChatLi){
            const API_URL="https://api.openai.com/v1/chat/completions";
            const messageElement=incomingChatLi.querySelector("p")
            const requestOptions={
                method: "POST",
                headers: {
                    "Content-Type": "application/json" ,
                    "Authorization": `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                   messages: [ {"role": "user",  "content": userMessage}] 
                     
                })
            }
            fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
                messageElement.textContent=data.choice[0].message.content;
            }).catch((error)=>{
                messageElement.classList.add("error");
                messageElement.textContent="oops! something went wrong. please try again.";
                
            })
            .finally(()=>chatbox.scrollTo(0, chatbox.scrollHeight));
        }
       
        chatInput.value=""
    }
// })

chatbotToggler.addEventListener("click", ()=>{
    document.body.classList.toggle("show-chatbot")
})
closebtn.addEventListener("click", ()=>{
    document.body.classList.remove("show-chatbot")
})

chatInput.addEventListener("input", ()=>{
    // chatInput.style.height=`${inputHeight}px`
    chatInput.style.height=`${chatInput.scrollHeight}px`
})
 

chatInput.addEventListener("keydown", (e)=>{
    if(e.key==="Enter" && !e.shiftKey && window.innerWidth>800){
        e.preventDefault();
        generate()
    }     
 })