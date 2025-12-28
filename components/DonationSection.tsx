import React, { useState } from 'react';
import { Copy, Check, Phone, AlertTriangle, ArrowRight } from 'lucide-react';

export const DonationSection: React.FC = React.memo(() => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="donate" className="py-24 bg-[#0B1120] text-white scroll-mt-20 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-600/10 blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-600/10 blur-[100px]"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_0%,_transparent_70%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Appeal Text */}
          <div className="flex flex-col justify-center space-y-8 reveal">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold tracking-wider uppercase mb-6 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Emergency Appeal
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-extrabold leading-[1.15] font-heading">
                Help Sri Lanka Flood & <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  Landslide Victims Now
                </span>
              </h2>
            </div>
            
            <p className="text-gray-300 text-lg leading-relaxed font-light">
              As the IEEE Sri Lanka Section, we are mobilizing our efforts to provide immediate and essential relief to the most vulnerable communities. Your contribution supports emergency aid, rehabilitation, and recovery.
            </p>

            {/* Enhanced Contacts */}
            <div className="pt-8 border-t border-gray-800/50">
              <h3 className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-6 font-heading">For More Details Please Contact</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a href="tel:+94716487689" className="group flex items-center p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:scale-[1.02]">
                  <div className="w-10 h-10 rounded-full bg-[#00629B] flex items-center justify-center text-white mr-4 shadow-lg group-hover:bg-blue-500 transition-colors flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-300 font-bold uppercase mb-0.5">Kavinga Upul Ekanayaka</p>
                    <p className="font-mono text-sm font-medium text-white tracking-wide group-hover:text-blue-200 transition-colors">+94 71 648 7689</p>
                  </div>
                </a>
                
                <a href="tel:+94712462986" className="group flex items-center p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:scale-[1.02]">
                  <div className="w-10 h-10 rounded-full bg-[#00629B] flex items-center justify-center text-white mr-4 shadow-lg group-hover:bg-blue-500 transition-colors flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-300 font-bold uppercase mb-0.5">Heshan Mallawaarachchi</p>
                    <p className="font-mono text-sm font-medium text-white tracking-wide group-hover:text-blue-200 transition-colors">+94 71 246 2986</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Bank Card */}
          <div className="relative w-full max-w-md mx-auto lg:ml-auto reveal delay-200">
            {/* Glow behind card */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-[2rem] blur-2xl opacity-20 transform rotate-3 scale-105"></div>
            
            <div className="relative backdrop-blur-xl bg-gradient-to-b from-gray-900/90 to-gray-900/95 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
               
               {/* Card Header */}
               <div className="px-8 py-8 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex justify-between items-center">
                    <div>
                        <p className="text-blue-400 font-semibold text-xs uppercase tracking-wider mb-1">Official Donation Account</p>
                        <h3 className="text-2xl font-bold text-white font-heading">Commercial Bank PLC</h3>
                    </div>
                    {/* Bank Logo Placeholder / Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-900/50">
                        <span className="font-heading">$</span>
                    </div>
                  </div>
               </div>
            
              <div className="p-8 space-y-8">
                {/* Account Name */}
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Beneficiary Name</label>
                  <p className="text-lg font-medium text-white font-heading tracking-wide">IEEE Sri Lanka Section</p>
                </div>

                {/* Account Number Display */}
                <div className="bg-black/40 p-5 rounded-2xl border border-white/10 relative group/input transition-colors hover:border-blue-500/30">
                  <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2 block">Account Number</label>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-widest tabular-nums">1100022595</p>
                    <button 
                      onClick={() => copyToClipboard('1100022595')}
                      className="p-2.5 text-gray-400 hover:text-white bg-white/5 hover:bg-[#00629B] rounded-xl transition-all focus:outline-none active:scale-90"
                      title="Copy Account Number"
                    >
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Branch</label>
                    <p className="text-base font-medium text-white">Wellawatta</p>
                    <div className="flex gap-2 mt-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded font-mono text-gray-300">7056</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded font-mono text-gray-300">010</span>
                    </div>
                  </div>
                  <div>
                     <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">SWIFT Code</label>
                     <p className="text-base font-medium text-white">CCEYLKLX</p>
                  </div>
                </div>

                {/* Important Reference Instruction */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                   <div className="flex items-start gap-3">
                     <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                     <div className="space-y-2">
                        <p className="text-yellow-200 font-bold uppercase text-[10px] tracking-widest">Mandatory Reference</p>
                        <p className="text-gray-300 text-xs leading-relaxed">
                          Please use exactly <span className="text-white font-mono bg-white/10 px-1 rounded">DRF &lt;Your Name&gt;</span> in the transaction remarks to ensure funds are allocated correctly.
                        </p>
                     </div>
                   </div>
                </div>

                {/* Action Button */}
                <a 
                  href="https://forms.gle/54Jp83rSnxZFgE4w7" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center w-full py-4 px-6 bg-gradient-to-r from-[#00629B] to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white font-bold text-sm tracking-wide rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Submit Donation Proof <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[25deg] group-hover:animate-shine" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
