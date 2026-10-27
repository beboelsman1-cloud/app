import React from 'react';
import {
  Star,
  MapPin,
  Clock,
  Bookmark,
  Plus,
  Check,
  Navigation,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { Place } from '../types/tourist';
import { formatDistance, formatTransitTime } from '../utils/distance';

interface PlaceCardProps {
  place: Place;
  distanceKm: number;
  isSelected: boolean;
  isBookmarked: boolean;
  isInItinerary: boolean;
  isArabic: boolean;
  onSelect: (place: Place) => void;
  onToggleBookmark: (placeId: string) => void;
  onToggleItinerary: (placeId: string) => void;
  onPlayAudio?: (text: string) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  distanceKm,
  isSelected,
  isBookmarked,
  isInItinerary,
  isArabic,
  onSelect,
  onToggleBookmark,
  onToggleItinerary,
  onPlayAudio,
}) => {
  const { walkText } = formatTransitTime(distanceKm, isArabic);
  const formattedDistance = formatDistance(distanceKm, isArabic);

  return (
    <div
      onClick={() => onSelect(place)}
      className={`group cursor-pointer bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col ${
        isSelected
          ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20 translate-y-[-2px]'
          : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {/* Image Thumbnail & Overlay */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        <img
          src={place.imageUrl}
          alt={isArabic ? place.nameAr : place.nameEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between">
          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md shadow-xs ${
              place.type === 'attraction'
                ? 'bg-emerald-600/90 text-white'
                : 'bg-teal-600/90 text-white'
            }`}
          >
            {place.type === 'attraction'
              ? isArabic ? 'معلم سياحي' : 'Attraction'
              : isArabic ? 'خدمة سياحية' : 'Tourist Service'}
          </span>

          <div className="flex items-center gap-1.5">
            {place.audioGuideScriptAr && onPlayAudio && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayAudio(
                    isArabic
                      ? place.audioGuideScriptAr || place.descriptionAr
                      : place.audioGuideScriptEn || place.descriptionEn
                  );
                }}
                title={isArabic ? 'استمع للمرشد الصوتي الذكي' : 'Listen to audio guide'}
                className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 backdrop-blur-md flex items-center justify-center shadow-xs transition-transform active:scale-95"
              >
                <Volume2 className="w-4 h-4 text-emerald-600" />
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(place.id);
              }}
              title={isArabic ? 'حفظ المكان' : 'Bookmark place'}
              className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center shadow-xs transition-transform active:scale-95 ${
                isBookmarked
                  ? 'bg-amber-500 text-white'
                  : 'bg-white/90 hover:bg-white text-slate-700'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>

        {/* Bottom Distance & Open status */}
        <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold">{formattedDistance}</span>
            <span className="text-[10px] text-slate-300">({walkText})</span>
          </div>

          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold backdrop-blur-md ${
              place.isOpen
                ? 'bg-emerald-500/80 text-white'
                : 'bg-rose-500/80 text-white'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>{place.isOpen ? (isArabic ? 'مفتوح' : 'Open') : (isArabic ? 'مغلق' : 'Closed')}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Rating */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-emerald-700 transition-colors">
              {isArabic ? place.nameAr : place.nameEn}
            </h3>
            <div className="flex items-center gap-1 text-amber-500 shrink-0 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200/60">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-slate-800">{place.rating}</span>
            </div>
          </div>

          {/* Subtitle / Address */}
          <p className="text-xs text-slate-500 line-clamp-1 mb-2">
            {isArabic ? place.addressAr : place.addressEn}
          </p>

          {/* Tourist Tip Box */}
          <div className="bg-emerald-50/80 border border-emerald-100 rounded-xl p-2 mb-3 flex items-start gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-emerald-950 font-medium line-clamp-2 leading-relaxed">
              <strong className="text-emerald-800">{isArabic ? 'نصيحة سياحية:' : 'Tip:'} </strong>
              {isArabic ? place.touristTipAr : place.touristTipEn}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div className="text-xs font-semibold text-slate-600">
            {place.priceLevel === 'free' ? (
              <span className="text-emerald-600 font-bold">
                {isArabic ? 'دخول مجاني' : 'Free Entry'}
              </span>
            ) : (
              <span>{place.priceLevel}</span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Direct Google Maps Direction URL */}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 transition-colors"
              title={isArabic ? 'الملاحة والتوجيه على Google Maps' : 'Open Directions in Google Maps'}
            >
              <Navigation className="w-3.5 h-3.5" />
            </a>

            {/* Add to itinerary */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleItinerary(place.id);
              }}
              className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors ${
                isInItinerary
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {isInItinerary ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>{isArabic ? 'في المسار' : 'Planned'}</span>
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3" />
                  <span>{isArabic ? 'إضافة للمسار' : 'Plan'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
