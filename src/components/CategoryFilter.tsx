import React from 'react';
import {
  Compass,
  Landmark,
  Building2,
  Palmtree,
  Sparkles,
  Utensils,
  CreditCard,
  HeartPulse,
  Moon,
  TrainTrack,
  ShoppingBag,
  Info,
} from 'lucide-react';
import { CategoryId, CategoryInfo } from '../types/tourist';

interface CategoryFilterProps {
  categories: CategoryInfo[];
  selectedCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  isArabic: boolean;
  categoryCounts: Record<CategoryId, number>;
  activeTypeFilter: 'all' | 'attraction' | 'service';
  onChangeTypeFilter: (type: 'all' | 'attraction' | 'service') => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Compass,
  Landmark,
  Building2,
  Palmtree,
  Sparkles,
  Utensils,
  CreditCard,
  HeartPulse,
  Moon,
  TrainTrack,
  ShoppingBag,
  Info,
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  isArabic,
  categoryCounts,
  activeTypeFilter,
  onChangeTypeFilter,
}) => {
  return (
    <div className="bg-white border-b border-slate-200/80 px-3 sm:px-6 py-2.5 shadow-2xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        {/* Top Type Filter: All vs Places vs Essential Services */}
        <div className="flex items-center gap-1.5 shrink-0 bg-slate-100 p-1 rounded-xl self-start">
          <button
            onClick={() => onChangeTypeFilter('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTypeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isArabic ? 'الكل' : 'All'}
          </button>
          <button
            onClick={() => onChangeTypeFilter('attraction')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTypeFilter === 'attraction'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🏛️</span>
            <span>{isArabic ? 'معالم سياحية' : 'Attractions'}</span>
          </button>
          <button
            onClick={() => onChangeTypeFilter('service')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTypeFilter === 'service'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🏧</span>
            <span>{isArabic ? 'خدمات السائح' : 'Tourist Services'}</span>
          </button>
        </div>

        {/* Scrollable Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 scroll-smooth">
          {categories
            .filter((c) => {
              if (activeTypeFilter === 'attraction') return !c.isService || c.id === 'all';
              if (activeTypeFilter === 'service') return c.isService || c.id === 'all';
              return true;
            })
            .map((category) => {
              const Icon = ICON_MAP[category.iconName] || Compass;
              const isSelected = selectedCategory === category.id;
              const count = categoryCounts[category.id] ?? 0;

              return (
                <button
                  key={category.id}
                  onClick={() => onSelectCategory(category.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs ring-2 ring-slate-900/10'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isSelected ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  />
                  <span>{isArabic ? category.nameAr : category.nameEn}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200/80 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};
