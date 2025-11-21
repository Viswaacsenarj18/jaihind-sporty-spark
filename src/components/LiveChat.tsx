import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: string;
}

const LiveChat = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "👋 Hello! Welcome to Jaihind Sports. How can we help you today?",
      sender: "support",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate support response after 1 second
    setTimeout(() => {
      const responses = [
        "Thanks for reaching out! Our team will get back to you shortly. 🙌",
        "I'm here to help! What specific product or order are you asking about? 🛍️",
        "We appreciate your inquiry. For faster support, please message us on WhatsApp! 📱",
        "Is there anything else I can help you with? 😊",
        "Feel free to visit us in-store or call us at +91-86374 50696! 📞",
      ];

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: "support",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, supportMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleWhatsApp = () => {
    window.open(
      "https://wa.me/918637450696?text=Hi%20Jaihind%20Sports!%20I%20need%20assistance.",
      "_blank"
    );
  };

  return (
    <>
      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-96 max-w-full animate-in slide-in-from-bottom-5">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col h-96 md:h-[500px]">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 rounded-t-lg flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Jaihind Sports Support</h3>
                <p className="text-xs text-green-100">🟢 Online & Ready to Help</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1 rounded transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-slate-800">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-white dark:bg-slate-700 text-foreground rounded-bl-none border border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === "user"
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-700 text-foreground rounded-lg rounded-bl-none px-4 py-3 border border-gray-200 dark:border-gray-600">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-3 space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                  disabled={isLoading}
                  className="text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs"
                onClick={handleWhatsApp}
              >
                💬 Chat via WhatsApp
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-primary to-primary/80 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 animate-pulse"
        title="Live Chat Support"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </>
  );
};

export default LiveChat;
