import React, { useState, useRef, useEffect } from 'react';
import { BsSendFill, BsCameraFill } from 'react-icons/bs';
import { RxCross2 } from 'react-icons/rx';
import MathInput from "react-math-keyboard";
import Tesseract from 'tesseract.js';
import axios from 'axios';
import { evaluate } from 'mathjs';
const key = process.env.OPENAI_API_KEY || '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'; 


const userAvatar = require('../assets/user.png');
const botAvatar =  require('../assets/logo.png');


const transformLatex = (text) => {
    if (!text.includes('\\')) return text;
    return text.replace(/\\frac{([^}]+)}{([^}]+)}/g, '($1/$2)')
        .replace(/\\times/g, '*')
        .replace(/\\div/g, '/');
};


function Modal({ isOpen, close, handleUserMessage, extractedText, setExtractedText, theme }) {
    
    return (
        <div
            style={{
                display: isOpen ? 'block' : 'none',
                margin: '10px auto',
                zIndex: 1,
                backgroundColor: theme === 'light' ? '#f9fafc' : '#111',
                padding: '50px 20px',
                boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
                width: '100%',
             
                overflowY: 'auto',
                borderRadius: '10px',
                border: '1px solid #dce0e6'

            }}
            className="chat"
        >
            <div style={{ display: 'flex', alignItems: 'center', width: '100%',position:'relative' }}>
                <MathInput  initialLatex={extractedText} style={{ width: "100%", borderRadius: '5px', padding: '10px' }} />
                <div style={{  margin: '0px', marginBottom: 'auto', marginTop: '25px',display:'none' }} className="buttons">
                    <button onClick={() => {
                        handleUserMessage(extractedText);
                        close();
                    }} className="rounded-none" style={{ margin: '0px 15px' }}><BsSendFill size={30} /></button>

                    <button onClick={close} ><RxCross2 size={30} /></button>

                </div>
                <div style={{ display: 'flex', margin: '0px', left:'1%',top:'-60px',marginBottom: 'auto', marginTop: '25px' }} className="buttons-mobile">
                    <button onClick={() => {
                        handleUserMessage(extractedText);
                        close();
                    }} className="rounded-none" style={{ margin: '0px 15px' }}><BsSendFill size={30} /></button>

                    <button onClick={close} ><RxCross2 size={30} /></button>

                </div>

            </div>
        </div>
    );
}


const ChatBotPage = (props) => {
    const [messages, setMessages] = useState([{ from: 'bot', msg: 'Hello! How can I assist you today?' }]);
    const [input, setInput] = useState('');
    const [extractedText, setExtractedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isMobile  = window.innerWidth < 992;
    const lastMessageRef = useRef(null);
    const mathInputRef = useRef(null);
    const clearMathInputRef = useRef(null);
    const chatContainerRef = useRef(null);
    const [loading, setLoading] = useState(false); 
    
    const handleSend = async () => {
        if (!input || isLoading) return;
        sendDataToAPI(input);
    };
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const sendDataToAPI = async (text) => {
        setIsLoading(true);
        
        try {
            const transformedInput = transformLatex(text);
            setMessages([...messages, { from: 'user', msg: transformedInput }]);

        
            let answer;
        
            // First, try solving with mathjs
            try {
                const evaluationResult = evaluate(transformedInput);
                answer = `The answer to ${transformedInput} is ${evaluationResult}.`;
            } catch (error) {
                // If mathjs can't solve it, call OpenAI API
                const openAIData = {
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            "role": "system",
                            "content": "You are a helpful assistant."
                        },
                        {
                            "role": "user",
                            "content": "solve this " + props.current + " problem " + transformedInput
                        }
                    ],
                    "temperature": 0,
                };
        
                const headers = {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${key}`  // Use the key from environment variable
                };
        
                const openAIResponse = await axios.post("https://api.openai.com/v1/chat/completions", openAIData, { headers: headers });
                answer = openAIResponse.data.choices[0].message.content;
            }
        
            setMessages(oldMessages => [...oldMessages, { from: 'bot', msg: answer }]);
            if (lastMessageRef.current) {
                lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
            }
        } catch (error) {
            alert('Check input data. Something went wrong.');
        } finally {
            setIsLoading(false);
            setInput('');
            clearMathInputRef.current && clearMathInputRef.current();
        }
    }


    const imagetotext = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        console.log(file)
        const formData = new FormData();
        formData.append("file", file);
    
        setLoading(true);  // Start the loading state
        
        try {
            const response = await axios.post("https://sargaharrey.pythonanywhere.com/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setExtractedText(response.data.results);
            setIsModalOpen(true);
        } catch (error) {
            alert(error)
            console.error("Error during file upload:", error);
        } finally {
            alert('yess')
            setLoading(false);  // End the loading state
        }

    }
    const handleUserMessageFromModal = (text) => {
        sendDataToAPI(text);
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
              justifyContent:'space-between',
            fontFamily: "'Noto Sans', sans-serif",
            color: '#333',
            width:  '100%',
           

        }}

            className={props.theme}
        >
            <div style={{
                flex: 1,
                
                padding: '1rem',
                backgroundColor: props.theme === 'light' ? '#f9fafc' : '#111',
                padding: '60px 0px'

            }}
                id='chats'
                ref={chatContainerRef}
            >
             
                {messages.map((message, index) => (
                    <div key={index}
                        ref={index === messages.length - 1 ? lastMessageRef : null} style={{ display: 'flex', justifyContent: message.from === 'bot' ? 'flex-start' : 'flex-end', alignItems: 'center', padding: '15px' }}>
                        {message.from === 'bot' &&
                            <img src={botAvatar} alt={`${message.from} avatar`} style={{ height: 40, width: 40, borderRadius: '50%', marginRight: '0.5rem' }} />
                        }
                        <div style={{ display: 'inline-block', borderRadius: '5px', backgroundColor: 'lightgrey', padding: '10px', maxWidth: '500px', wordWrap: 'break-word' }}>
                            <p>{message.msg}</p>
                        </div>
                        {message.from === 'user' &&
                            <img src={userAvatar} alt={`${message.from} avatar`} style={{ height: 40, width: 40, borderRadius: '50%', marginLeft: '0.5rem' }} />
                        }
                    </div>
                ))}
                {isLoading && <div className='loading-modal'>
                    <div className='loading-content'>
                        Loading...
                    </div>
                </div>}
            </div>
            {loading && (
                <div className='loading-modal'>
                    <div className='loading-content'>
                        Loading...
                    </div>
                </div>
            )}
            {/* The Modal */}
            <Modal
                isOpen={isModalOpen}
                close={() => setIsModalOpen(false)}
                handleUserMessage={handleUserMessageFromModal}
                extractedText={extractedText}
                setExtractedText={setExtractedText}
                theme={props.theme}
            />
            {/* The input section */}
            <div style={{
                padding: '1rem',
                borderTop: props.theme === 'light' ? '0.5px solid #fff' : '0.5px solid rgba(0, 0, 0, 0.1)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position:'relative',
                backgroundColor: props.theme === 'light' ? '#f9fafc' : '#111',
              

            }} className='chatInput'>
                <MathInput ref={mathInputRef} setValue={value => setInput(value)} setClearRef={clearFunc => clearMathInputRef.current = clearFunc} disabled={isLoading} style={{ width: '90%', marginRight: '1rem' }} />
                <div className="flex flex-row space-x-5 buttons" style={{ marginBottom: 'auto', marginTop: '15px' }}>
                    <button onClick={handleSend} disabled={!input || isLoading} className="rounded-none"><BsSendFill size={30} /></button>
                    <label className="cursor-pointer">
                        <input type="file" accept="image/*" onChange={imagetotext} style={{ display: 'none' }} />
                        <BsCameraFill size={30} />
                    </label>
                </div>
                <div className="flex flex-row space-x-5 buttons-mobile" style={{ marginBottom: 'auto', marginTop: '15px' }}>
                    <button onClick={handleSend} disabled={!input || isLoading} className="rounded-none"><BsSendFill size={30} /></button>
                    <label className="cursor-pointer">
                        <input type="file" accept="image/*" onChange={imagetotext} style={{ display: 'none' }} />
                        <BsCameraFill size={30} />
                    </label>
                </div>
            </div>

        </div>
    );
};

export default ChatBotPage;
