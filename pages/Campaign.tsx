import React, { useEffect } from 'react';
import { ImpactFeed } from '@/components/ImpactFeed';
import { ImpactMap } from '@/components/ImpactMap';
import { ImpactStory } from '@/types';
import { Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CampaignProps {
  stories: ImpactStory[];
}

export const Campaign: React.FC<CampaignProps> = ({ stories }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 md:pt-36 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-appear">
        
        <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#00629B] transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Sophisticated Header for Campaign Detail */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 pb-8 border-b border-gray-100 dark:border-slate-800">
            <div className="max-w-3xl">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-[#00629B] dark:text-blue-400 text-sm font-bold mb-6">
                    <Heart className="w-4 h-4 mr-2 fill-current" />
                    Cyclone Ditwah Relief 2025
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-heading text-gray-900 dark:text-white leading-tight">
                  Impact in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00629B] to-blue-500">Focus</span>
                </h1>
                <p className="mt-6 text-base text-gray-500 dark:text-gray-400 leading-relaxed font-normal max-w-2xl">
                  A comprehensive archive of our relief operations. Explore the stories, videos, and proof of aid delivery from the field.
                </p>
            </div>
            
            <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Total Updates</p>
                <p className="text-4xl font-mono font-bold text-[#00629B] dark:text-blue-400">{stories.length}</p>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 reveal">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 <div className="flex flex-col justify-center">
                     <h2 className="text-2xl md:text-3xl font-bold font-heading text-gray-900 dark:text-white mb-6">Operations Map</h2>
                     <p className="text-base text-gray-600 dark:text-gray-400 mb-8 leading-relaxed font-normal">
                         We believe in visual accountability. Explore the interactive map to see exactly where your donations were deployed. 
                         Click on any pinpoint to view detailed reports, photos, and video evidence from that specific location.
                     </p>
                 </div>
                 <div className="flex items-center justify-center min-h-[400px] md:min-h-[500px] relative">
                    <div className="absolute inset-0 bg-[#00629B]/5 dark:bg-blue-900/10 blur-3xl rounded-full opacity-50 pointer-events-none"></div>
                    <ImpactMap stories={stories} />
                 </div>
          </div>
      </div>

      {/* Force Expanded Grid View */}
      <ImpactFeed stories={stories} forceExpanded={true} />
    </div>
  );
};