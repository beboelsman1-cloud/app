import React from 'react';
import {
  X,
  CalendarCheck,
  Trash2,
  Navigation,
  MapPin,
  Clock,
  ArrowDown,
  CheckCircle2,
  Circle,
  ExternalLink,
} from 'lucide-react';
import { Place } from '../types/tourist';
import { formatDistance, formatTransitTime } from '../utils/distance';

interface ItineraryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  itineraryPlaces: Place[];
  onRemovePlace: (placeId: string) => void;
  onClearAll: () => void;
  isArabic: boolean;
  distances: Record<string, number>;
  onSelectPlace: (place: Place) => void;
}

export const ItineraryDrawer: React.FC<ItineraryDrawerProps> = ({
  isOpen,
  onClose,
  itineraryPlaces,
  onRemovePlace,
  onClearAll,
  isArabic,
  distances,
  onSelectPlace,
}) => {
  const [completedIds, setCompletedIds] = React.useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const toggleComplete = (id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Calculate total tour distance roughly based on items
  let totalDistanceKm = 0;
  for (let i = 0; i < itineraryPlaces.length; i++) {
    const d = distances[itineraryPlaces[i].id] || 1.2;
    totalDistanceKm += d;
  }
  const { walkText } = formatTransitTime(totalDistanceKm, isArabic);

  // Generate multi-stop Google Maps URL
  const googleMapsRouteUrl =
    itineraryPlaces.length > 0
      ? `https://www.google.com/maps/dir/${itineraryPlaces
          .map((p) => `${p.lat},${p.lng}`)
          .join('/')}`
      : '#';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-2xs flex justify-end">
      <div
        className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {isArabic ? 'مسار جولة اليوم' : 'Daily Tour Itinerary'}
              </h3>
              <p className="text-xs text-slate-500">
                {isArabic
                  ? `${itineraryPlaces.length} محطات محددة`
                  : `${itineraryPlaces.length} stops planned`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Total Summary bar */}
        {itineraryPlaces.length > 0 && (
          <div className="bg-emerald-50/90 border-b border-emerald-100 p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-900 font-semibold">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>
                {isArabic ? 'إجمالي السير المتوقع:' : 'Total Walking Time:'} {walkText}
              </span>
            </div>
            <button
              onClick={onClearAll}
              className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 transition-colors text-[11px]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isArabic ? 'مسح الخطة' : 'Clear'}</span>
            </button>
          </div>
        )}

        {/* Places List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {itineraryPlaces.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <CalendarCheck className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">
                {isArabic ? 'مسار رحلتك فارغ حتى الآن' : 'Your Day Plan is Empty'}
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                {isArabic
                  ? 'تصفح المعالم والخدمات السياحية واضغط على "إضافة للمسار" لبناء جدول سياحي مميز لجولتك اليوم.'
                  : 'Browse attractions & services and click "Add to Day Plan" to organize your day.'}
              </p>
            </div>
          ) : (
            itineraryPlaces.map((place, index) => {
              const isDone = completedIds.has(place.id);
              const dist = distances[place.id];

              return (
                <div key={place.id}>
                  <div
                    className={`p-3 rounded-2xl border transition-all ${
                      isDone
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleComplete(place.id)}
                        className="mt-0.5 shrink-0 text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      {/* Number badge */}
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>

                      {/* Place details */}
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => onSelectPlace(place)}
                      >
                        <h5
                          className={`font-bold text-xs sm:text-sm text-slate-900 line-clamp-1 ${
                            isDone ? 'line-through text-slate-500' : ''
                          }`}
                        >
                          {isArabic ? place.nameAr : place.nameEn}
                        </h5>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span>{place.openingHours}</span>
                          {dist !== undefined && (
                            <span className="font-semibold text-emerald-700">
                              &bull; {formatDistance(dist, isArabic)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => onRemovePlace(place.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title={isArabic ? 'حذف من المسار' : 'Remove from plan'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Connecting indicator if not last */}
                  {index < itineraryPlaces.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowDown className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Button */}
        {itineraryPlaces.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
            <a
              href={googleMapsRouteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>{isArabic ? 'فتح المسار الكامل على Google Maps' : 'Open Full Route on Google Maps'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
