import { motion } from 'framer-motion';
import { Check, Crown, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function UpgradeModal() {
  const { setUser, user, setShowUpgradeModal } = useAppContext();

  const handleUpgrade = () => {
    // Logic to switch plan to premium
    setUser({ ...user, plan: 'premium' });
    setShowUpgradeModal(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#0d0d12] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        <div className="p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-amber-500/20 rounded-3xl flex items-center justify-center mx-auto border border-amber-500/20">
            <Crown className="w-10 h-10 text-amber-500" />
          </div>
          
          <div>
            <h2 className="text-3xl font-black text-white">Unlock Pro Features</h2>
            <p className="text-gray-500 text-sm mt-2 font-medium">Get advanced AI strategies and unlimited history.</p>
          </div>

          <div className="space-y-4 text-left">
            {['Advanced AI Analysis', 'Strategy Engine Access', 'Custom Budget Goals', 'Priority Support'].map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-gray-300 text-sm font-bold">
                <Check className="w-5 h-5 text-emerald-500" /> {feature}
              </div>
            ))}
          </div>

          <button 
            onClick={handleUpgrade}
            className="w-full py-5 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-black rounded-2xl hover:scale-[1.02] transition-transform active:scale-95 shadow-xl shadow-amber-500/20"
          >
            Upgrade Now - ₹999/mo
          </button>

          <button 
            onClick={() => setShowUpgradeModal(false)}
            className="text-gray-600 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </motion.div>
    </div>
  );
}