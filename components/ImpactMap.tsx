import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { geoMercator, geoPath } from "d3-geo";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import type { ImpactStory } from "@/types";

// Import your local GeoJSON (accurate, no CORS, no network dependency)
import lkGeo from "@/data/lk.json";

interface ImpactMapProps {
  stories: ImpactStory[];
  className?: string;
}

export const ImpactMap: React.FC<ImpactMapProps> = ({ stories, className = "" }) => {
  const navigate = useNavigate();
  const [hoveredStory, setHoveredStory] = useState<ImpactStory | null>(null);

  // SVG Dimensions
  const WIDTH = 600;
  const HEIGHT = 900;
  const PADDING = 16;

  // 1) One projection for everything (district/province boundaries + points)
  const projection = useMemo(() => {
    return geoMercator().fitExtent(
      [
        [PADDING, PADDING],
        [WIDTH - PADDING, HEIGHT - PADDING],
      ],
      lkGeo as any
    );
  }, []);

  // 2) Path generator for boundaries
  const pathGenerator = useMemo(() => {
    return geoPath().projection(projection);
  }, [projection]);

  // 3) Project story points using the SAME projection
  const mappedStories = useMemo(() => {
    const valid = (stories || []).filter((s) => s.latitude && s.longitude);

    const points = valid
      .map((s) => {
        const coords = projection([s.longitude as number, s.latitude as number]); // [lng, lat]
        if (!coords) return null;

        return {
          ...s,
          cx: coords[0],
          cy: coords[1],
        };
      })
      .filter(Boolean) as Array<ImpactStory & { cx: number; cy: number }>;

    // Group overlapping points (same pixel area)
    const groups: Record<string, typeof points> = {};
    points.forEach((p) => {
      const key = `${Math.round(p.cx)},${Math.round(p.cy)}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    });

    const finalPoints: typeof points = [];
    Object.values(groups).forEach((group) => {
      if (group.length === 1) {
        finalPoints.push(group[0]);
        return;
      }

      const radius = 16;
      const angleStep = (2 * Math.PI) / group.length;

      group.forEach((p, i) => {
        const angle = i * angleStep - Math.PI / 2;
        finalPoints.push({
          ...p,
          cx: p.cx + Math.cos(angle) * radius,
          cy: p.cy + Math.sin(angle) * radius,
        });
      });
    });

    return finalPoints;
  }, [stories, projection]);

  return (
    <div className={`w-full h-full relative flex flex-col items-center justify-center p-4 ${className}`}>
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="max-h-full w-auto drop-shadow-2xl overflow-visible"
            style={{ filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.15))" }}
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* MAP LAYER */}
            <g className="fill-white dark:fill-slate-800 stroke-gray-300 dark:stroke-slate-600 stroke-[1]">
              {(lkGeo as any).features?.map((feature: any, i: number) => (
                <path
                  key={i}
                  d={pathGenerator(feature) || undefined}
                  className="transition-colors hover:fill-blue-50 dark:hover:fill-slate-700"
                />
              ))}
            </g>

            {/* PIN LAYER */}
            {mappedStories.map((story) => {
              const isHovered = hoveredStory?.id === story.id;

              return (
                <g
                  key={story.id}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredStory(story)}
                  onMouseLeave={() => setHoveredStory(null)}
                  onClick={() => navigate(`/impact/${story.slug}`)}
                >
                  {/* Subtle Radar Ripple Effect (Small Size) */}
                  <circle
                    cx={(story as any).cx}
                    cy={(story as any).cy}
                    r={3}
                    className="fill-[#00629B] animate-ping opacity-20 origin-center pointer-events-none"
                    style={{ animationDuration: "2.5s" }}
                  />

                  {/* Main Pin Point */}
                  <circle
                    cx={(story as any).cx}
                    cy={(story as any).cy}
                    r={isHovered ? 8 : 4}
                    className={`transition-all duration-300 drop-shadow-sm ${
                      isHovered
                        ? "fill-[#00629B] dark:fill-blue-400 stroke-white dark:stroke-slate-900 stroke-2"
                        : "fill-[#00629B] stroke-white stroke-[1.5px]"
                    }`}
                  />

                  {isHovered && (
                    <foreignObject
                      x={(story as any).cx + 10}
                      y={(story as any).cy - 35}
                      width="220"
                      height="60"
                      className="overflow-visible pointer-events-none"
                    >
                      <div className="inline-block bg-white dark:bg-slate-900 text-[10px] font-bold px-2 py-1 rounded shadow-lg border border-gray-100 dark:border-slate-700 whitespace-nowrap text-gray-800 dark:text-gray-200">
                        {story.location}
                      </div>
                    </foreignObject>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Bottom detail card */}
        {hoveredStory && (
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-100 dark:border-slate-700 p-4 z-30 pointer-events-none animate-in slide-in-from-bottom-2 fade-in">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1 text-[10px] font-bold text-[#00629B] dark:text-blue-400 uppercase tracking-widest">
                  <MapPin className="w-3 h-3" />
                  {hoveredStory.location}
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">
                  {hoveredStory.title}
                </h3>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(hoveredStory.date).toLocaleDateString()}
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
