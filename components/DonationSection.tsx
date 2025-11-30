import React, { useState } from 'react';
import { Copy, Check, Phone, Info, AlertTriangle } from 'lucide-react';

export const DonationSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="donate" className="py-20 bg-[#0B1120] text-white scroll-mt-20 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left Column: Appeal Text */}
          <div className="flex-1 space-y-8 reveal">
            <div className="inline-flex items-center bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 text-sm font-bold text-red-400 mb-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <span className="relative flex h-2 w-2 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              EMERGENCY APPEAL
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
              Help Sri Lanka Flood & <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                Landslide Victims Now
              </span>
            </h2>
            
            <p className="text-gray-300 text-lg leading-relaxed max-w-xl">
              As the IEEE Sri Lanka Section, we are mobilizing our efforts to provide immediate and essential relief to the most vulnerable communities. Your contribution supports emergency aid, rehabilitation, and recovery.
            </p>

            {/* Enhanced Contacts - Balanced Typography */}
            <div className="pt-8 border-t border-gray-800">
              <h3 className="text-sm uppercase tracking-wider font-bold text-gray-400 mb-6">For More Details Please Contact</h3>
              <div className="flex flex-col sm:flex-row gap-6">
                <a href="tel:+94716487689" className="flex-1 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl p-4 flex items-center transition-all hover:scale-[1.02] shadow-lg group">
                  <div className="bg-[#00629B] p-3 rounded-full mr-4 text-white shadow-md group-hover:bg-blue-500 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-300 font-bold uppercase mb-0.5">Upul</p>
                    <p className="font-mono text-lg font-medium text-white tracking-wide group-hover:text-blue-200 transition-colors">+94 71 648 7689</p>
                  </div>
                </a>
                
                <a href="tel:+94712462986" className="flex-1 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl p-4 flex items-center transition-all hover:scale-[1.02] shadow-lg group">
                  <div className="bg-[#00629B] p-3 rounded-full mr-4 text-white shadow-md group-hover:bg-blue-500 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-300 font-bold uppercase mb-0.5">Heshan</p>
                    <p className="font-mono text-lg font-medium text-white tracking-wide group-hover:text-blue-200 transition-colors">+94 71 246 2986</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Bank Card */}
          <div className="w-full lg:w-[480px] reveal delay-200">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative group">
               {/* Shine effect */}
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

               <div className="px-8 py-8 bg-gradient-to-b from-white/10 to-transparent border-b border-white/5">
                  <div className="flex justify-between items-start">
                    <div>
                        <p className="text-blue-300 font-medium text-sm mb-1">Bank Transfer</p>
                        <h3 className="text-2xl font-bold text-white tracking-wide">Commercial Bank PLC</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-600/20">
                        $
                    </div>
                  </div>
               </div>
            
              <div className="p-8 space-y-8">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Account Name</label>
                  <p className="text-xl font-semibold text-white">IEEE Sri Lanka Section</p>
                </div>

                <div className="bg-black/30 p-5 rounded-xl border border-white/10 relative group/input">
                  <label className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2 block">Account Number</label>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-mono font-bold text-white tracking-widest tabular-nums">1100022595</p>
                    <button 
                      onClick={() => copyToClipboard('1100022595')}
                      className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all focus:outline-none active:scale-95"
                      title="Copy Account Number"
                    >
                      {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Branch</label>
                    <p className="text-lg font-medium text-white">Wellawatta</p>
                    <div className="flex gap-2 mt-2">
                        <span className="px-2 py-1 bg-white/10 rounded text-xs font-mono text-gray-300 border border-white/5">7056</span>
                        <span className="px-2 py-1 bg-white/10 rounded text-xs font-mono text-gray-300 border border-white/5">010</span>
                    </div>
                  </div>
                  <div>
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">SWIFT</label>
                     <p className="text-lg font-medium text-white">CCEYLKLX</p>
                  </div>
                </div>

                {/* Important Reference Instruction */}
                <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-4 text-sm leading-relaxed">
                   <div className="flex items-center gap-2 mb-2">
                     <AlertTriangle className="w-5 h-5 text-yellow-400" />
                     <p className="text-yellow-200 font-bold uppercase text-xs tracking-wide">Important Instruction</p>
                   </div>
                   
                   <p className="text-gray-300 mb-3">
                     In the "Remarks" or "Reference" field of your bank/online-payment transfer, use the following format exactly:
                   </p>
                   
                   <div className="bg-black/40 border border-white/10 rounded px-3 py-2 text-center mb-3">
                     <code className="text-base font-mono text-white font-bold">DRF &lt;Your Name&gt;</code>
                   </div>
                   
                   <p className="text-gray-400 text-xs mb-4 italic border-l-2 border-white/10 pl-3">
                     This short code helps us quickly identify and match transfers for the relief fund.
                   </p>

                   <div className="flex gap-2 items-start text-xs text-gray-300">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <p>After making the transfer, please come back to this form and fill in the fields below — including the same <span className="font-mono text-white">DRF &lt;Your Name&gt;</span> code — and upload the receipt or payment confirmation as proof of donation.</p>
                   </div>
                </div>

                <a 
                  href="https://forms.gle/54Jp83rSnxZFgE4w7" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-center rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 relative overflow-hidden group/btn"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Submit Verification Form
                  </span>
                  <div className="absolute top-0 -left-full w-1/2 h-full bg-white/20 skew-x-[25deg] group-hover/btn:animate-shine" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};