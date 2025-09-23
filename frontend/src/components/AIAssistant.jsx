import { useState, useEffect, useRef } from "react";
import { 
  sendChatMessage, 
  getContentIdeas, 
  getWritingTips,
  getSEOSuggestions 
} from "../api/blog";
import "./AIAssistant.css";

const AIAssistant = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened and add welcome message
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      
      // Welcome message - only add if no messages exist
      if (messages.length === 0) {
        setMessages([{
          role: "assistant",
          content: "Hi! I'm BELLE AI, your beauty and lifestyle assistant. I can help you with:\n\n• Writing amazing blog posts\n• Beauty tips and advice\n• Content ideas\n• SEO optimization\n• Platform features\n\nWhat would you like to know?",
          timestamp: new Date().toISOString()
        }]);
      }
    }
  }, [isOpen]); // Fixed dependency array

  const sendMessage = async () => {
    const message = inputMessage.trim();
    if (!message || isTyping) return;

    const userMessage = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // Get conversation history for context
      const history = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await sendChatMessage(message, history);
      
      if (response.success) {
        const assistantMessage = {
          role: "assistant",
          content: response.response,
          timestamp: response.timestamp || new Date().toISOString()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(response.error || "Unknown error");
      }
    } catch (error) {
      const errorMessage = {
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getQuickReply = async (type) => {
    setIsTyping(true);
    try {
      let response;
      let message;
      
      switch (type) {
        case "ideas":
          response = await getContentIdeas("beauty", "trendy");
          if (response.success) {
            message = {
              role: "assistant",
              content: `Here are some trending blog post ideas:\n\n${response.ideas}`,
              timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, message]);
          }
          break;

        case "tips":
          response = await getWritingTips("general");
          if (response.success) {
            message = {
              role: "assistant",
              content: `Here are essential writing tips for your blog:\n\n${response.tips}`,
              timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, message]);
          }
          break;

        case "seo":
          message = {
            role: "assistant",
            content: "Here are key SEO tips for your beauty blog:\n\n• Use relevant keywords in your title\n• Write compelling meta descriptions (150-160 chars)\n• Include alt text for all images\n• Use header tags (H1, H2, H3) properly\n• Add internal and external links\n• Optimize for mobile devices\n• Include schema markup\n• Focus on page loading speed",
            timestamp: new Date().toISOString()
          };
          setMessages(prev => [...prev, message]);
          break;

        case "makeup":
          response = await getContentIdeas("makeup", "trendy");
          if (response.success) {
            message = {
              role: "assistant",
              content: `Here are trending makeup blog ideas:\n\n${response.ideas}`,
              timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, message]);
          }
          break;

        case "skincare":
          response = await getWritingTips("skincare");
          if (response.success) {
            message = {
              role: "assistant",
              content: `Skincare blogging tips:\n\n${response.tips}`,
              timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, message]);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.error("Quick reply error:", error);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error getting that information. Please try asking me directly!",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      role: "assistant",
      content: "Chat cleared! How can I help you with your beauty blogging today?",
      timestamp: new Date().toISOString()
    }]);
  };

  const getMoreSuggestions = () => {
    const suggestions = [
      "How do I write engaging blog introductions?",
      "What are trending beauty topics right now?",
      "Help me optimize my blog for SEO",
      "Give me makeup tutorial ideas",
      "What skincare ingredients should I write about?",
      "How do I take better blog photos?",
      "Help me plan a content calendar",
      "What are good calls-to-action for blogs?"
    ];
    
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  if (!isOpen) return null;

  const containerClass = isMobile ? "ai-assistant mobile" : "ai-assistant desktop";

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && (
        <div className="ai-backdrop" onClick={onClose} />
      )}
      
      <div className={containerClass}>
        {/* Header */}
        <div className="ai-header">
          <div className="ai-header-info">
            <div className="ai-avatar">🤖</div>
            <div>
              <h3>BELLE AI</h3>
              <span className="ai-status">Online</span>
            </div>
          </div>
          <div className="ai-header-actions">
            <button onClick={clearChat} className="ai-clear-btn" title="Clear chat">
              🗑️
            </button>
            <button onClick={onClose} className="ai-close-btn" title="Close">
              ✕
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="ai-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`ai-message ${msg.role}`}>
              <div className="ai-message-content">
                {msg.content.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < msg.content.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </div>
              <div className="ai-message-time">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="ai-message assistant">
              <div className="ai-message-content">
                <div className="ai-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick replies */}
        <div className="ai-quick-replies">
          <button onClick={() => getQuickReply("ideas")} className="quick-reply">
            💡 Content Ideas
          </button>
          <button onClick={() => getQuickReply("tips")} className="quick-reply">
            ✍️ Writing Tips
          </button>
          <button onClick={() => getQuickReply("seo")} className="quick-reply">
            🔍 SEO Tips
          </button>
          <button onClick={() => getQuickReply("makeup")} className="quick-reply">
            💄 Makeup Ideas
          </button>
        </div>

        {/* Suggestion prompt */}
        {messages.length > 6 && (
          <div className="ai-suggestion-prompt">
            <button 
              onClick={() => setInputMessage(getMoreSuggestions())}
              className="suggestion-button"
            >
              💭 Get suggestion
            </button>
          </div>
        )}

        {/* Input */}
        <div className="ai-input-container">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about beauty blogging, writing tips, or anything else..."
            maxLength={500}
            disabled={isTyping}
            className="ai-input"
          />
          <button 
            onClick={sendMessage} 
            disabled={!inputMessage.trim() || isTyping}
            className="ai-send-btn"
            title="Send message"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path 
                d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;
