import React from 'react';
import { ImpactStory } from '../types';
import { Calendar, Heart } from 'lucide-react';

interface Props {
  stories: ImpactStory[];
}

export const ImpactFeed: React.FC<Props> = ({ stories }) => {
  if (stories.length === 0) return null;

  return (
    <div id="impact" className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 reveal">
           <h2 className="text-3xl font-bold text-gray-900">Relief in Action</h2>
           <p className="mt-4 text-lg text-gray-500">Real stories from the ground showing how your contribution helps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           {stories.map((story, index) => (
             <div key={story.id} className={`flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group reveal ${index % 2 === 0 ? '' : 'delay-100'}`}>
                {/* Image Section or Default Fallback */}
                <div className="h-64 w-full overflow-hidden bg-gray-50 relative">
                  {story.imageUrl ? (
                    <img 
                      src={story.imageUrl} 
                      alt={story.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
                       {/* Decorative Circles */}
                       <div className="absolute top-10 right-10 w-20 h-20 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
                       <div className="absolute bottom-10 left-10 w-20 h-20 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
                       
                       <div className="relative z-10 flex flex-col items-center">
                          <div className="bg-white p-4 rounded-full shadow-sm mb-3">
                             <Heart className="w-8 h-8 text-rose-400 fill-rose-400" />
                          </div>
                          <span className="text-sm font-bold tracking-widest text-gray-400 uppercase">Hope in Action</span>
                       </div>
                    </div>
                  )}
                </div>

                <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center text-sm text-[#00629B] font-medium mb-3">
                        <Calendar className="w-4 h-4 mr-2" />
                        {story.date}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{story.title}</h3>
                    <p className="text-gray-600 leading-relaxed flex-1">
                        {story.description}
                    </p>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};