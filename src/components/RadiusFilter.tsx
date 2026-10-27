import React from 'react';
import { Sliders, Clock, Sparkles } from 'lucide-react';

interface RadiusFilterProps {
  radiusKm: number;
  onRadiusChange: (radius: number) => void;
  sortBy: 'distance' | 'rating' | 'reviews';
  onSortChange: (sort: 'distance' | 'rating' | 'reviews') => void;
  openOnly: boolean;
  onToggleOpenOnly: () => void;
  freeOnly: boolean;
  onToggleFreeOnly: () => void;
  isArabic: boolean;
  viewMode: 'split' | 'map' | 'list';
  onViewModeChange: (mode: 'split' | 'map' | 'list') => void;
  totalFiltered: number;
}

export const RadiusFilter: React.FC<RadiusFilterProps> = ({
  radiusKm,
  onRadiusChange,
  sortBy,
  onSortChange,
  openOnly,
  onToggleOpenOnly,
  freeOnly,
  onToggleFreeOnly,
  isArabic,
  viewMode,
  onViewModeChange,
  totalFiltered,
}) => {
  return (
    <div className="bg-slate-50 border-b border-slate-200/80 px-3 sm:px-6 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Distance & Sort */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Radius selector */}
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200">
            <Sliders className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold text-slate-700">
              {isArabic ? 'نطاق المسافة:' : 'Distance:'}
            </span>
            <select
              value={radiusKm}
              onChange={(e) => onRadiusChange(Number(e.target.value))}
              className="bg-transparent font-bold text-emerald-800 outline-hidden cursor-pointer"
            >
              <option value={2}>2 {isArabic ? 'كم' : 'km'}</option>
              <option value={5}>5 {isArabic ? 'كم' : 'km'}</option>
              <option value={10}>10 {isArabic ? 'كم' : 'km'}</option>
              <option value={25}>25 {isArabic ? 'كم' : 'km'}</option>
              <option value={100}>{isArabic ? 'كل المدينة' : 'All City'}</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200">
            <span className="text-slate-500">{isArabic ? 'الترتيب:' : 'Sort:'}</span>
            <select
              value={sortBy}
              onChange={(e) =>
                onSortChange(e.target.value as 'distance' | 'rating' | 'reviews')
              }
              className="bg-transparent font-bold text-slate-800 outline-hidden cursor-pointer"
            >
              <option value="distance">{isArabic ? 'الأقرب إليك' : 'Closest'}</option>
              <option value="rating">{isArabic ? 'الأعلى تقييماً' : 'Highest Rated'}</option>
              <option value="reviews">{isArabic ? 'الأكثر شعبية' : 'Most Popular'}</option>
            </select>
          </div>

          {/* Toggles: Open Now, Free Entry */}
          <button
            onClick={onToggleOpenOnly}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border font-bold transition-all ${
              openOnly
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>{isArabic ? 'مفتوح الآن' : 'Open Now'}</span>
          </button>

          <button
            onClick={onToggleFreeOnly}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border font-bold transition-all ${
              freeOnly
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>{isArabic ? 'دخول مجاني' : 'Free Entry'}</span>
          </button>

          <span className="text-slate-500 font-medium">
            ({totalFiltered} {isArabic ? 'مكان متاح' : 'found'})
          </span>
        </div>

        {/* Right: View Mode Toggle (Map vs List vs Split) */}
        <div className="flex items-center bg-white p-0.5 rounded-xl border border-slate-200 shadow-2xs self-end">
          <button
            onClick={() => onViewModeChange('split')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all hidden md:block ${
              viewMode === 'split'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isArabic ? 'تقسيم' : 'Split'}
          </button>
          <button
            onClick={() => onViewModeChange('map')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              viewMode === 'map'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isArabic ? 'الخريطة' : 'Map'}
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              viewMode === 'list'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isArabic ? 'القائمة' : 'List'}
          </button>
        </div>
      </div>
    </div>
  );
};
