import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';

interface AIAssistantProps {
  expenses: any[];
  budget: number;
}

export default function AIAssistant({ expenses, budget }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: `Hello! I'm your ExpenseGuard assistant. I can see your monthly budget is ₹${budget.toLocaleString()}. How can I help you save today?` }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    // AI Logic Simulation
    setTimeout(() => {
      let response = "";
      const query = userMsg.toLowerCase();
      
      // Real-time Data Calculations
      const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
      const foodSpent = expenses.filter(e => e.category === 'Food').reduce((sum, e) => sum + e.amount, 0);
      const shoppingSpent = expenses.filter(e => e.category === 'Shopping').reduce((sum, e) => sum + e.amount, 0);
      const balance = budget - totalSpent;
      const savingsGoal = 10000; // Based on your set goal

      // Logic Gates
      if (query.includes('save') || query.includes('tips') || query.includes('saving')) {
        if (shoppingSpent > 1500) {
          response = `I see you've spent ₹${shoppingSpent} on shopping. Limiting non-essential purchases this week could help you secure your ₹${savingsGoal} goal faster!`;
        } else if (totalSpent < budget * 0.3) {
          response = "Your spending is very controlled! This is a great time to move an extra ₹2,000 into a high-interest savings account.";
        } else {
          response = "Tip: Try the 50/30/20 rule. Allocate 50% to needs, 30% to wants, and 20% to savings. Currently, you have ₹" + balance.toLocaleString() + " remaining.";
        }
      } 
      else if (query.includes('status') || query.includes('budget') || query.includes('balance')) {
        response = `Current Status: You've spent ₹${totalSpent.toLocaleString()}. Your remaining balance is ₹${balance.toLocaleString()}. You are ${totalSpent > budget ? 'over budget!' : 'within your limits.'}`;
      }
      else if (query.includes('food')) {
        response = `You've spent ₹${foodSpent} on food. ${foodSpent > 2000 ? 'Cooking at home more often could save you a lot this month!' : 'Your food spending looks very reasonable.'}`;
      }
      else if (query.includes('hello') || query.includes('hi')) {
        response = "Hi there! Ready to crush your financial goals today?";
      }
      else {
        response = "I'm specialized in your expenses. Ask me: 'Give me saving tips', 'What is my budget status?', or 'How much did I spend on food?'";
      }

      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/40 hover:scale-110 active:scale-95 transition-all z-50"
      >
        <Sparkles className="text-white w-7 h-7" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-28 right-8 w-[380px] h-[550px] bg-[#0d0d12] border border-white/10 rounded-[2.5rem] flex flex-col overflow-hidden z-50 shadow-2xl shadow-black"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-white text-sm tracking-tight leading-none">AI Finance Buddy</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] text-indigo-100 uppercase tracking-widest font-bold">Always Active</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Chat Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-xs font-medium leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-500/10' 
                      : 'bg-white/5 text-gray-300 border border-white/5 rounded-tl-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Field */}
            <div className="p-5 bg-white/[0.02] border-t border-white/5 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="E.g. How can I save more?"
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-xs text-white placeholder:text-gray-600"
              />
              <button 
                onClick={handleSend}
                className="p-3 bg-indigo-600 rounded-2xl hover:bg-indigo-500 transition-all active:scale-90 shadow-lg shadow-indigo-500/20"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}