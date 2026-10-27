import React from 'react';
import {
  Compass,
  MapPin,
  Crosshair,
  CalendarCheck,
  Languages,
  Search,
  SlidersHorizontal,
  Bookmark,
} from 'lucide-react';
import { City } from '../types/tourist';

interface NavbarProps {
  cities: City[];
  currentCity: City;
  onSelectCity: (city: City) => void;
  onLocateMe: () => void;
  isLocating: boolean;
  hasUserLocation: boolean;
  isArabic: boolean;
  onToggleLanguage: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  itineraryCount: number;
  onOpenItinerary: () => void;
  savedCount: number;
  onToggleSavedOnly: () => void;
  isSavedOnly: boolean;
  onOpenQuickServices: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cities,
  currentCity,
  onSelectCity,
  onLocateMe,
  isLocating,
  hasUserLocation,
  isArabic,
  onToggleLanguage,
  searchQuery,
  onSearchChange,
  itineraryCount,
  onOpenItinerary,
  savedCount,
  onToggleSavedOnly,
  isSavedOnly,
  onOpenQuickServices,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                  {isArabic ? 'دليلي السياحي' : 'TourGuide'}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {isArabic ? 'المباشر' : 'Live'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                {isArabic ? 'أفضل الأماكن والخدمات القريبة منك' : 'Top spots & nearby services'}
              </p>
            </div>
          </div>

          {/* Search bar for places & services */}
          <div className="flex-1 max-w-md mx-1 sm:mx-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={
                  isArabic
                    ? 'ابحث عن معلم، متحف، صراف، صيدلية...'
                    : 'Search places, museums, ATMs, pharmacy...'
                }
                className="w-full text-xs sm:text-sm pl-9 pr-8 sm:pr-9 py-2 rounded-xl bg-slate-100/90 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs px-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* City Selector & GPS Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* City dropdown */}
            <div className="relative">
              <select
                value={currentCity.id}
                onChange={(e) => {
                  const found = cities.find((c) => c.id === e.target.value);
                  if (found) onSelectCity(found);
                }}
                className="text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 rounded-xl px-2.5 sm:px-3 py-2 cursor-pointer outline-hidden transition-all appearance-none pr-7 sm:pr-8"
              >
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {isArabic ? `${c.nameAr} - ${c.countryAr}` : `${c.nameEn}, ${c.countryEn}`}
                  </option>
                ))}
              </select>
              <MapPin className="w-3.5 h-3.5 text-emerald-600 absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* GPS Locate Me Button */}
            <button
              onClick={onLocateMe}
              title={isArabic ? 'تحديد موقعي الفعلي بالجوال/GPS' : 'Use my live GPS location'}
              className={`flex items-center gap-1.5 text-xs font-bold px-2.5 sm:px-3 py-2 rounded-xl border transition-all ${
                hasUserLocation
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs shadow-emerald-500/30'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
            >
              <Crosshair
                className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-emerald-500' : ''}`}
              />
              <span className="hidden md:inline">
                {isLocating
                  ? isArabic ? 'جاري التحديد...' : 'Locating...'
                  : hasUserLocation
                  ? isArabic ? 'موقعي نشط' : 'GPS Active'
                  : isArabic ? 'موقعي' : 'Near Me'}
              </span>
            </button>

            {/* Saved Bookmarks Toggle */}
            <button
              onClick={onToggleSavedOnly}
              title={isArabic ? 'الأماكن المحفوظة' : 'Saved places'}
              className={`p-2 rounded-xl border transition-all relative ${
                isSavedOnly
                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center border border-white">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Itinerary Planner Button */}
            <button
              onClick={onOpenItinerary}
              title={isArabic ? 'خطة جولة اليوم' : 'Daily Itinerary Planner'}
              className="relative flex items-center gap-1 text-xs font-bold px-2.5 sm:px-3 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-xs transition-all"
            >
              <CalendarCheck className="w-4 h-4" />
              <span className="hidden lg:inline">{isArabic ? 'مسار الجولة' : 'Itinerary'}</span>
              {itineraryCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-emerald-800 text-[10px] font-bold flex items-center justify-center">
                  {itineraryCount}
                </span>
              )}
            </button>

            {/* Quick Tourist Services Drawer Trigger */}
            <button
              onClick={onOpenQuickServices}
              title={isArabic ? 'أرقام الطوارئ والخدمات' : 'Emergency & Quick services'}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Language Toggle */}
            <button
              onClick={onToggleLanguage}
              title={isArabic ? 'التبديل إلى الإنجليزية' : 'Switch to Arabic'}
              className="flex items-center gap-1 text-xs font-bold px-2 sm:px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Languages className="w-3.5 h-3.5" />
              <span className="text-[11px]">{isArabic ? 'EN' : 'عربي'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
