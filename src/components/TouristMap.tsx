import React, { useState, useEffect } from 'react';
import {
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { Place } from '../types/tourist';
import { formatDistance, formatTransitTime } from '../utils/distance';
import { Navigation, Star, Volume2, Bookmark, Check, Plus } from 'lucide-react';

interface TouristMapProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place | null) => void;
  userLocation: { lat: number; lng: number } | null;
  center: { lat: number; lng: number };
  zoom: number;
  isArabic: boolean;
  distances: Record<string, number>;
  bookmarkedIds: Set<string>;
  itineraryIds: Set<string>;
  onToggleBookmark: (placeId: string) => void;
  onToggleItinerary: (placeId: string) => void;
  onPlayAudio?: (text: string) => void;
}

// Controller to smoothly re-center map when city or selected place changes
const MapRecenterController: React.FC<{
  center: { lat: number; lng: number };
  zoom: number;
  selectedPlace: Place | null;
}> = ({ center, zoom, selectedPlace }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (selectedPlace) {
      map.panTo({ lat: selectedPlace.lat, lng: selectedPlace.lng });
      map.setZoom(15);
    } else {
      map.panTo(center);
      map.setZoom(zoom);
    }
  }, [map, center, zoom, selectedPlace]);

  return null;
};

export const TouristMap: React.FC<TouristMapProps> = ({
  places,
  selectedPlace,
  onSelectPlace,
  userLocation,
  center,
  zoom,
  isArabic,
  distances,
  bookmarkedIds,
  itineraryIds,
  onToggleBookmark,
  onToggleItinerary,
  onPlayAudio,
}) => {
  const [activeInfoWindow, setActiveInfoWindow] = useState<Place | null>(null);

  // Sync activeInfoWindow with selectedPlace
  useEffect(() => {
    setActiveInfoWindow(selectedPlace);
  }, [selectedPlace]);

  const getPinTheme = (place: Place) => {
    if (place.type === 'service') {
      switch (place.category) {
        case 'atm':
          return { bg: '#0d9488', border: '#115e59', glyph: '🏧' };
        case 'pharmacy':
          return { bg: '#e11d48', border: '#9f1239', glyph: '💊' };
        case 'mosque':
          return { bg: '#059669', border: '#065f46', glyph: '🕌' };
        case 'transport':
          return { bg: '#4f46e5', border: '#3730a3', glyph: '🚆' };
        default:
          return { bg: '#0284c7', border: '#0369a1', glyph: '📍' };
      }
    }
    switch (place.category) {
      case 'landmarks':
        return { bg: '#9333ea', border: '#6b21a8', glyph: '🏛️' };
      case 'museums':
        return { bg: '#0284c7', border: '#0369a1', glyph: '🎨' };
      case 'nature':
        return { bg: '#10b981', border: '#047857', glyph: '🌿' };
      case 'shopping':
        return { bg: '#f59e0b', border: '#b45309', glyph: '🛍️' };
      default:
        return { bg: '#059669', border: '#047857', glyph: '📍' };
    }
  };

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
      <Map
        mapId="DEMO_MAP_ID"
        defaultCenter={center}
        defaultZoom={zoom}
        gestureHandling="greedy"
        disableDefaultUI={false}
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        className="w-full h-full min-h-[420px]"
      >
        <MapRecenterController
          center={center}
          zoom={zoom}
          selectedPlace={selectedPlace}
        />

        {/* User GPS Live Location Marker */}
        {userLocation && (
          <AdvancedMarker
            position={userLocation}
            title={isArabic ? 'موقعك الحالي' : 'Your Location'}
          >
            <div className="relative flex items-center justify-center">
              <span className="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping" />
              <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px]">
                📍
              </div>
            </div>
          </AdvancedMarker>
        )}

        {/* Place Markers */}
        {places.map((place) => {
          const theme = getPinTheme(place);
          const isTarget = selectedPlace?.id === place.id;

          return (
            <AdvancedMarker
              key={place.id}
              position={{ lat: place.lat, lng: place.lng }}
              title={isArabic ? place.nameAr : place.nameEn}
              onClick={() => {
                onSelectPlace(place);
                setActiveInfoWindow(place);
              }}
            >
              <Pin
                background={isTarget ? '#10b981' : theme.bg}
                borderColor={isTarget ? '#047857' : theme.border}
                glyphColor="#ffffff"
                scale={isTarget ? 1.3 : 1.05}
              >
                <span className="text-xs">{theme.glyph}</span>
              </Pin>
            </AdvancedMarker>
          );
        })}

        {/* InfoWindow for selected place */}
        {activeInfoWindow && (
          <InfoWindow
            position={{ lat: activeInfoWindow.lat, lng: activeInfoWindow.lng }}
            onCloseClick={() => {
              setActiveInfoWindow(null);
              onSelectPlace(null);
            }}
          >
            <div className="max-w-[280px] p-1 font-sans text-right" dir={isArabic ? 'rtl' : 'ltr'}>
              <div className="relative h-28 w-full rounded-xl overflow-hidden mb-2">
                <img
                  src={activeInfoWindow.imageUrl}
                  alt={isArabic ? activeInfoWindow.nameAr : activeInfoWindow.nameEn}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-1.5 right-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/70 text-white backdrop-blur-xs">
                  {isArabic ? activeInfoWindow.priceLevel : activeInfoWindow.priceLevel}
                </span>
              </div>

              <div className="flex items-center justify-between gap-1 mb-1">
                <h4 className="font-bold text-slate-900 text-sm leading-tight">
                  {isArabic ? activeInfoWindow.nameAr : activeInfoWindow.nameEn}
                </h4>
                <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-slate-800">
                    {activeInfoWindow.rating}
                  </span>
                </div>
              </div>

              {/* Distance badge */}
              {distances[activeInfoWindow.id] !== undefined && (
                <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mb-2 flex items-center justify-between">
                  <span>
                    {isArabic ? 'المسافة:' : 'Distance:'}{' '}
                    {formatDistance(distances[activeInfoWindow.id], isArabic)}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {formatTransitTime(distances[activeInfoWindow.id], isArabic).walkText}
                  </span>
                </div>
              )}

              <p className="text-xs text-slate-600 line-clamp-2 mb-2.5">
                {isArabic ? activeInfoWindow.descriptionAr : activeInfoWindow.descriptionEn}
              </p>

              {/* Actions row inside info window */}
              <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${activeInfoWindow.lat},${activeInfoWindow.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1 text-xs font-bold py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                  <Navigation className="w-3 h-3" />
                  <span>{isArabic ? 'الملاحة' : 'Navigate'}</span>
                </a>

                {onPlayAudio && activeInfoWindow.audioGuideScriptAr && (
                  <button
                    onClick={() =>
                      onPlayAudio(
                        isArabic
                          ? activeInfoWindow.audioGuideScriptAr || activeInfoWindow.descriptionAr
                          : activeInfoWindow.audioGuideScriptEn || activeInfoWindow.descriptionEn
                      )
                    }
                    title={isArabic ? 'استمع للمرشد' : 'Audio Guide'}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                  </button>
                )}

                <button
                  onClick={() => onToggleBookmark(activeInfoWindow.id)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    bookmarkedIds.has(activeInfoWindow.id)
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onToggleItinerary(activeInfoWindow.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    itineraryIds.has(activeInfoWindow.id)
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                  title={isArabic ? 'إضافة إلى خطة اليوم' : 'Add to itinerary'}
                >
                  {itineraryIds.has(activeInfoWindow.id) ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </InfoWindow>
        )}
      </Map>
    </div>
  );
};
