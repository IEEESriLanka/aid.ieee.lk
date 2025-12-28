import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ImpactStory } from '@/types';
import { ArrowLeft, Calendar, MapPin, Share2, ImageIcon, Image as ImageIconSmall } from 'lucide-react';

interface ImpactDetailProps {
  stories: ImpactStory[];
}

const DefaultImpactThumbnail = () => (
    <div className="w-full h-full bg-blue-50 dark:bg-slate-800 flex flex-col items-center justify-center p-6 text-center border border-gray-100 dark:border-slate-700 rounded-3xl">
      <div className="w-20 h-20 bg-white dark:bg-slate-700 rounded-2xl shadow-sm flex items-center justify-center mb-4">
         <ImageIcon className="w-10 h-10 text-[#00629B] dark:text-blue-400" />
      </div>
      <h3 className="text-[#00629B] dark:text-blue-400 font-bold tracking-widest uppercase text-lg mb-2">
        Impact Update
      </h3>
      <div className="w-16 h-1.5 bg-[#00629B] rounded-full"></div>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-3xl" 
           style={{ backgroundImage: 'radial-gradient(#00629B 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>
    </div>
);

// Helper to clean up image URLs
// Handles direct hosting (like file.garden) AND Google Drive links
const getCleanImageUrl = (url: string | undefined) => {
    if (!url) return undefined;
    
    // Check for Google Drive links and convert to thumbnail
    if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
        const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
        if (idMatch && idMatch[1]) {
            return `https://drive.google.com/thumbnail?sz=w1200&id=${idMatch[1]}`;
        }
    }
    
    // For all other links (file.garden, etc.), return as is
    return url;
};

export const ImpactDetail: React.FC<ImpactDetailProps> = ({ stories }) => {
  const { slug } = useParams<{ slug: string }>();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (stories.length === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center pt-20">
            <div className="w-8 h-8 border-4 border-[#00629B] border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
  }

  const story = stories.find(s => s.slug === slug);

  if (!story) {
    return <Navigate to="/impact" replace />;
  }

  // Format date range
  const formatDate = (dateStr: string) => {
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    } catch {
        return dateStr;
    }
  };

  const startDisplay = formatDate(story.date);
  const endDisplay = story.endDate ? formatDate(story.endDate) : null;
  
  const dateDisplay = (endDisplay && endDisplay !== startDisplay)
    ? `${startDisplay} - ${endDisplay}`
    : startDisplay;

  // Helper to get YouTube ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const mainImageUrl = getCleanImageUrl(story.imageUrl);

  return (
    <div className="pt-24 md:pt-32 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-appear">
        
        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
            <Link to="/impact" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#00629B] transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Impact Stories
            </Link>
        </div>

        {/* Header & Main Thumbnail Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-start">
            <div className="order-2 lg:order-1 flex flex-col justify-center">
                <div className="flex flex-wrap gap-4 mb-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-[#00629B] dark:text-blue-400 text-sm font-medium border border-blue-100 dark:border-blue-900">
                        <Calendar className="w-4 h-4 mr-2" />
                        {dateDisplay}
                    </span>
                    {story.location && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-medium border border-green-100 dark:border-green-900">
                            <MapPin className="w-4 h-4 mr-2" />
                            {story.location}
                        </span>
                    )}
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-extrabold font-heading text-gray-900 dark:text-white mb-6 leading-tight">
                    {story.title}
                </h1>
                
                <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line border-l-4 border-[#00629B] pl-6 bg-gray-50/50 dark:bg-slate-800/20 py-2 rounded-r-xl">
                    {story.description}
                </div>
            </div>

            {/* Main Thumbnail Image */}
            <div className="order-1 lg:order-2">
                {/* Changed to aspect-video (16:9) from aspect-[4/3] */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl group aspect-video ring-1 ring-gray-200 dark:ring-gray-800 bg-gray-100 dark:bg-slate-800">
                {mainImageUrl ? (
                    <>
                        <img 
                            src={mainImageUrl} 
                            alt={story.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement?.querySelector('.fallback-thumb')?.classList.remove('hidden');
                            }}
                            referrerPolicy="no-referrer"
                        />
                        <div className="fallback-thumb hidden absolute inset-0 w-full h-full">
                             <DefaultImpactThumbnail />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                        <div className="absolute bottom-6 left-6">
                             <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-md uppercase tracking-wider shadow-sm flex items-center gap-2">
                                <ImageIcon className="w-3 h-3" /> Featured Image
                             </span>
                        </div>
                    </>
                ) : (
                    <DefaultImpactThumbnail />
                )}
                </div>
            </div>
        </div>

        {/* Gallery Grid */}
        {story.gallery && story.gallery.length > 0 && (
            <div className="mb-20 animate-appear delay-100">
                <div className="flex items-center mb-8">
                     <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-heading mr-4 flex items-center gap-2">
                        <ImageIconSmall className="w-6 h-6 text-[#00629B] dark:text-blue-400" />
                        Project Gallery
                    </h3>
                    <div className="h-px bg-gray-200 dark:bg-slate-800 flex-grow"></div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {story.gallery.map((img, idx) => {
                        const cleanGalleryImg = getCleanImageUrl(img);
                        return (
                            <div key={idx} className="relative rounded-2xl overflow-hidden aspect-video shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer ring-1 ring-gray-100 dark:ring-slate-800 bg-gray-100 dark:bg-slate-800">
                                <img 
                                    src={cleanGalleryImg} 
                                    alt={`Gallery ${idx + 1}`} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                    loading="lazy"
                                    onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.parentElement!.style.display = 'none'; // Hide broken images in gallery
                                    }}
                                    referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">View</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}

        {/* Video Grid */}
        {story.videoLinks && story.videoLinks.length > 0 && (
            <div className="mb-20 animate-appear delay-200">
                <div className="flex items-center mb-8">
                     <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-heading mr-4 flex items-center gap-2">
                        <Share2 className="w-6 h-6 text-red-500" />
                        Video Documentation
                    </h3>
                    <div className="h-px bg-gray-200 dark:bg-slate-800 flex-grow"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {story.videoLinks.map((link, idx) => {
                        const ytId = getYouTubeId(link);
                        if (ytId) {
                            return (
                                <div key={idx} className="rounded-2xl overflow-hidden shadow-xl aspect-video ring-4 ring-white dark:ring-slate-800">
                                    <iframe 
                                        width="100%" 
                                        height="100%" 
                                        src={`https://www.youtube.com/embed/${ytId}`} 
                                        title="YouTube video player" 
                                        frameBorder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            );
                        }
                        return (
                            <a key={idx} href={link} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center aspect-video bg-gray-100 dark:bg-slate-800 rounded-2xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors group border-2 border-dashed border-gray-300 dark:border-slate-600">
                                <div className="p-4 bg-white dark:bg-slate-900 rounded-full mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                   <Share2 className="w-6 h-6 text-[#00629B]" />
                                </div>
                                <p className="text-gray-900 dark:text-white font-semibold">View External Video</p>
                                <p className="text-xs text-gray-500 mt-1">Opens in new tab</p>
                            </a>
                        );
                    })}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};