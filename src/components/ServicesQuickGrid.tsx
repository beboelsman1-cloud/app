import React, { useState } from 'react';
import {
  X,
  PhoneCall,
  Coins,
  ShieldAlert,
  CreditCard,
  HeartPulse,
  Moon,
  TrainTrack,
  Info,
  DollarSign,
  ArrowRightLeft,
} from 'lucide-react';
import { City, CategoryId } from '../types/tourist';

interface ServicesQuickGridProps {
  isOpen: boolean;
  onClose: () => void;
  city: City;
  isArabic: boolean;
  onFilterByCategory: (categoryId: CategoryId) => void;
}

export const ServicesQuickGrid: React.FC<ServicesQuickGridProps> = ({
  isOpen,
  onClose,
  city,
  isArabic,
  onFilterByCategory,
}) => {
  const [usdAmount, setUsdAmount] = useState<number>(100);

  if (!isOpen) return null;

  const convertedLocalAmount = (usdAmount * city.currencyRateToUSD).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div
        className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl p-5 sm:p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {isArabic ? 'دليل خدمات وطوارئ السائح' : 'Tourist Services & Emergency Hub'}
              </h3>
              <p className="text-xs text-slate-500">
                {isArabic ? `${city.nameAr} - ${city.countryAr}` : `${city.nameEn}, ${city.countryEn}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Emergency Quick Dial */}
          <div>
            <h4 className="font-bold text-xs text-slate-800 mb-2 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-rose-500" />
              <span>{isArabic ? 'أرقام الطوارئ السريعة' : 'Emergency Hotlines'}</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <a
                href={`tel:${city.emergencyNumbers.police}`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-950 transition-colors"
              >
                <div>
                  <span className="text-[11px] block font-semibold text-rose-700">
                    {isArabic ? 'الشرطة' : 'Police'}
                  </span>
                  <span className="font-black text-sm">{city.emergencyNumbers.police}</span>
                </div>
                <PhoneCall className="w-4 h-4 text-rose-600 shrink-0" />
              </a>

              <a
                href={`tel:${city.emergencyNumbers.ambulance}`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-950 transition-colors"
              >
                <div>
                  <span className="text-[11px] block font-semibold text-red-700">
                    {isArabic ? 'الإسعاف' : 'Ambulance'}
                  </span>
                  <span className="font-black text-sm">{city.emergencyNumbers.ambulance}</span>
                </div>
                <PhoneCall className="w-4 h-4 text-red-600 shrink-0" />
              </a>

              {city.emergencyNumbers.touristPolice && (
                <a
                  href={`tel:${city.emergencyNumbers.touristPolice}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-950 transition-colors col-span-2 sm:col-span-1"
                >
                  <div>
                    <span className="text-[11px] block font-semibold text-blue-700">
                      {isArabic ? 'شرطة السياحة' : 'Tourist Police'}
                    </span>
                    <span className="font-black text-sm">
                      {city.emergencyNumbers.touristPolice}
                    </span>
                  </div>
                  <PhoneCall className="w-4 h-4 text-blue-600 shrink-0" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Find Nearby Services Buttons */}
          <div>
            <h4 className="font-bold text-xs text-slate-800 mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-teal-600" />
              <span>{isArabic ? 'البحث السريع عن أقرب الخدمات' : 'Quick Nearby Service Search'}</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onFilterByCategory('atm');
                  onClose();
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-800 hover:text-teal-900 transition-all text-right"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs block">
                    {isArabic ? 'صراف آلي وصرافة' : 'ATMs & Exchange'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {isArabic ? 'سحب نقدي وتحويل عملات' : 'Cash & Forex'}
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  onFilterByCategory('pharmacy');
                  onClose();
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 text-slate-800 hover:text-red-900 transition-all text-right"
              >
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs block">
                    {isArabic ? 'صيدليات 24/7' : '24/7 Pharmacies'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {isArabic ? 'أدوية وطوارئ صحية' : 'Medicines & First Aid'}
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  onFilterByCategory('mosque');
                  onClose();
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800 hover:text-emerald-900 transition-all text-right"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs block">
                    {isArabic ? 'مساجد ومصليات' : 'Mosques & Prayer'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {isArabic ? 'أماكن الصلاة والوضوء' : 'Prayer facilities'}
                  </span>
                </div>
              </button>

              <button
                onClick={() => {
                  onFilterByCategory('transport');
                  onClose();
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-800 hover:text-indigo-900 transition-all text-right"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <TrainTrack className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs block">
                    {isArabic ? 'مترو ومواصلات' : 'Metro & Transit'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {isArabic ? 'محطات القطار والتاكسي' : 'Train & Taxi Hubs'}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Currency Calculator */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-4">
            <h4 className="font-bold text-xs text-emerald-900 mb-2 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-emerald-600" />
              <span>{isArabic ? 'حاسبة تحويل العملات للسائح' : 'Tourist Currency Converter'}</span>
            </h4>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-[10px] text-slate-500 block mb-1 font-semibold">
                  {isArabic ? 'المبلغ بالدولار الأمريكي (USD)' : 'Amount in USD ($)'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={usdAmount}
                    onChange={(e) => setUsdAmount(Math.max(1, Number(e.target.value) || 0))}
                    className="w-full text-sm font-bold bg-white border border-slate-200 rounded-xl px-3 py-2 outline-hidden focus:border-emerald-500"
                  />
                  <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="shrink-0 mt-4 text-emerald-600">
                <ArrowRightLeft className="w-4 h-4" />
              </div>

              <div className="flex-1">
                <label className="text-[10px] text-slate-500 block mb-1 font-semibold">
                  {isArabic ? `يعادل بالـ (${city.currency})` : `In Local (${city.currency})`}
                </label>
                <div className="w-full text-sm font-extrabold bg-white border border-emerald-300 text-emerald-800 rounded-xl px-3 py-2 flex items-center justify-between">
                  <span>{convertedLocalAmount}</span>
                  <span className="text-xs font-normal text-slate-500">{city.currencySymbol}</span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              * {isArabic ? `سعر الصرف التقديري: 1 USD = ${city.currencyRateToUSD} ${city.currency}` : `Approx: 1 USD = ${city.currencyRateToUSD} ${city.currency}`}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            {isArabic ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
