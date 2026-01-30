import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatWidget.module.css';
import { sendMessage } from '../../api/chatService';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            role: 'assistant',
            content: 'Hi there! I\'m your Gebeta dining assistant. How can I help you find food today? 🍔',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState(null);

    const messagesEndRef = useRef(null);
    const chatInputRef = useRef(null);

    // Suggestions for quick replies
    const suggestions = [
        "Find cafes near my dorm",
        "Best rated food",
        "Vegetarian options",
        "What's open now?"
    ];

    // Auto-scroll to bottom when messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, isOpen]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && chatInputRef.current) {
            setTimeout(() => {
                chatInputRef.current.focus();
            }, 300);
        }
    }, [isOpen]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSendMessage = async (content = inputValue) => {
        if (!content.trim()) return;

        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: content,
            timestamp: new Date()
        };

        // Add user message to state
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);
        setError(null);

        // Prepare history for API (last 10 messages, simplified)
        const history = messages.slice(-10).map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        try {
            const response = await sendMessage(content, history);

            const assistantMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.data || "I'm not sure how to respond to that, but I'm learning!",
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (err) {
            console.error(err);
            setError("Unable to connect to Gebeta Assistant. Please try again later.");

            // Add a visual error message from system if needed
            // setMessages(prev => [...prev, {
            //   id: Date.now().toString(),
            //   role: 'assistant',
            //   content: "Sorry, I'm having trouble connecting right now. 😓"
            // }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleSuggestionClick = (suggestion) => {
        handleSendMessage(suggestion);
    };

    return (
        <div className={styles.chatWidget}>
            {/* Chat Panel */}
            <div className={`${styles.chatPanel} ${isOpen ? styles.open : ''}`}>

                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerTitle}>
                        <div className={styles.statusDot}></div>
                        Gebeta Assistant
                    </div>
                    <button
                        className={styles.closeButton}
                        onClick={toggleChat}
                        aria-label="Close chat"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Messages */}
                <div className={styles.messagesContainer}>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.assistantMessage}`}
                        >
                            {msg.content}
                            <span className={styles.messageTime}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))}

                    {isTyping && (
                        <div className={styles.typingIndicator}>
                            <div className={styles.dot}></div>
                            <div className={styles.dot}></div>
                            <div className={styles.dot}></div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Error Display */}
                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}

                {/* Quick Replies */}
                <div className={styles.quickReplies}>
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            className={styles.suggestionBtn}
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>

                {/* Input Area */}
                <div className={styles.inputArea}>
                    <input
                        ref={chatInputRef}
                        type="text"
                        className={styles.chatInput}
                        placeholder="Ask about food..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isTyping}
                    />
                    <button
                        className={styles.sendButton}
                        onClick={() => handleSendMessage()}
                        disabled={!inputValue.trim() || isTyping}
                        aria-label="Send message"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Floating Action Button */}
            <button
                className={`${styles.fab} ${isOpen ? styles.open : ''}`}
                onClick={toggleChat}
                aria-label={isOpen ? "Close chat" : "Open chat"}
            >
                {isOpen ? (
                    <svg className={styles.fabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                ) : (
                    <svg className={styles.fabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                )}
            </button>
        </div>
    );
};

export default ChatWidget;
