import React, { useState } from 'react';
import axios from 'axios';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hi! Ask me what the family has been up to lately.' }
    ]);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!query.trim()) return;

        // Add user message to chat immediately
        const userMsg = { sender: 'user', text: query };
        setMessages((prev) => [...prev, userMsg]);
        setQuery('');
        setLoading(true);

        try {
            const endpoint = process.env.REACT_APP_RAG_URL || "http://localhost:8000";
            const response = await axios.post(`${endpoint}/ask`, {
                question: userMsg.text
            });

            // Add bot response to chat
            const botMsg = { sender: 'bot', text: response.data.answer };
            setMessages((prev) => [...prev, botMsg]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [...prev, { sender: 'bot', text: 'Error connecting to the AI. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Chat Bubble Toggle */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-transform hover:scale-105"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white rounded-lg shadow-xl border w-80 h-96 flex flex-col overflow-hidden">
                    <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center rounded-t-lg">
                        <h3 className="font-bold">Ask AI Bot</h3>
                        <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
                            ✕
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col space-y-3">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`px-4 py-2 max-w-[85%] text-sm rounded-lg ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none text-sm animate-pulse">
                                    Thinking...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="border-t p-3 bg-white flex items-center">
                        <input 
                            type="text" 
                            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                            placeholder="Ask a question..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button 
                            onClick={handleSend}
                            disabled={loading || !query.trim()}
                            className="ml-2 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 disabled:opacity-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
