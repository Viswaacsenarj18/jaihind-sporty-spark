import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send } from "lucide-react";

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      "Hi Jaihind Sports! I need assistance. 👋"
    );
    const phoneNumber = "918637450696";
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <>
      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-96 max-w-full">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6 rounded-t-lg flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Jaihind Sports Support</h3>
                <p className="text-xs text-green-100">🟢 Online & Ready to Help</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1 rounded transition"
                title="Close chat"
                aria-label="Close chat window"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 bg-gray-50 dark:bg-slate-800">
              <div className="text-center space-y-3">
                <p className="text-foreground font-semibold">
                  Connect with us on WhatsApp
                </p>
                <p className="text-sm text-muted-foreground">
                  Get instant support for your orders, product inquiries, and more!
                </p>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-left space-y-2">
                  <p className="text-sm font-semibold text-foreground">✨ Why WhatsApp?</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>✓ Instant responses from our team</li>
                    <li>✓ Share images and product details</li>
                    <li>✓ Track your order in real-time</li>
                    <li>✓ Available 9 AM - 8 PM (Mon-Sat)</li>
                  </ul>
                </div>

                <Button
                  onClick={handleWhatsApp}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat via WhatsApp
                </Button>

                <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p>📞 Call: +91-86374 50696</p>
                  <p>📧 Email: sethupathi51469@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
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
