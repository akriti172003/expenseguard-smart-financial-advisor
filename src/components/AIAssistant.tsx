import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

interface AIAssistantProps {
  expenses: any[];
  budget: number;
}

export default function AIAssistant({ expenses, budget }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Hello! I'm your ExpenseGuard assistant. How can I help you save money today?" }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    // Mock AI Logic
    setTimeout(() => {
      let response = "I'm analyzing your spending patterns...";
      
      const total = expenses.reduce((sum, e) => sum + e.amount, 0);
      const foodSpending = expenses.filter(e => e.category === 'Food').reduce((sum, e) => sum + e.amount, 0);
      
      if (userMsg.toLowerCase().includes('save')) {
        if (foodSpending > total * 0.3) {
          response = `You're spending ${(foodSpending/total*100).toFixed(0)}% on food. Reducing dining out could save you around ₹2,000 this month!`;
        } else if (total > budget) {
          response = "You've exceeded your budget. Try to limit non-essential shopping for the rest of the month.";
        } else {
          response = "Your spending looks healthy! Consider moving ₹5,000 to your savings goal this week.";
        }
      } else if (userMsg.toLowerCase().includes('status')) {
        response = `Total expenses: ₹${total}. Remaining budget: ₹${Math.max(0, budget - total)}.`;
      } else {
        response = "I can help you with saving tips, budget status, and spending analysis. Just ask!";
      }

      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    }, 600);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/40 hover:scale-110 transition-transform z-50"
      >
        <MessageSquare className="text-white w-8 h-8" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-28 right-8 w-[350px] h-[500px] glass border-white/20 rounded-3xl flex flex-col overflow-hidden z-50 shadow-2xl"
          >
            <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-bold text-white block leading-none">Smart Assistant</span>
                  <span className="text-[10px] text-indigo-100 uppercase tracking-widest font-bold">Online</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0a0a0f]">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white/5 text-gray-200 border border-white/5 rounded-tl-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 bg-[#0a0a0f] border-t border-white/5 flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask your finance buddy..."
                className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm"
              />
              <button 
                onClick={handleSend}
                className="p-3 bg-indigo-600 rounded-2xl hover:bg-indigo-500 transition-all active:scale-90 shadow-lg shadow-indigo-500/20"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
