import React, { useState } from 'react';
import {
  X,
  Star,
  MapPin,
  Clock,
  Phone,
  Navigation,
  Bookmark,
  Share2,
  Volume2,
  VolumeX,
  Wifi,
  Car,
  Accessibility,
  Users,
  CreditCard,
  Languages,
  Sparkles,
  Check,
  Plus,
} from 'lucide-react';
import { Place } from '../types/tourist';
import { formatDistance, formatTransitTime } from '../utils/distance';

interface PlaceDetailModalProps {
  place: Place | null;
  distanceKm: number;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  isInItinerary: boolean;
  isArabic: boolean;
  onToggleBookmark: (placeId: string) => void;
  onToggleItinerary: (placeId: string) => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  place,
  distanceKm,
  isOpen,
  onClose,
  isBookmarked,
  isInItinerary,
  isArabic,
  onToggleBookmark,
  onToggleItinerary,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !place) return null;

  const { walkText, driveText } = formatTransitTime(distanceKm, isArabic);
  const formattedDistance = formatDistance(distanceKm, isArabic);

  // Audio Guide via Web Speech Synthesis API
  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = isArabic
        ? `${place.nameAr}. ${place.audioGuideScriptAr || place.descriptionAr}. نصيحة السائح: ${place.touristTipAr}`
        : `${place.nameEn}. ${place.audioGuideScriptEn || place.descriptionEn}. Tourist Tip: ${place.touristTipEn}`;

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = isArabic ? 'ar-SA' : 'en-US';
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: isArabic ? place.nameAr : place.nameEn,
      text: isArabic ? place.touristTipAr : place.touristTipEn,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user canceled or error
      }
    } else {
      navigator.clipboard.writeText(
        `${shareData.title} - ${shareData.text} \nhttps://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            if (isPlayingAudio) window.speechSynthesis?.cancel();
            onClose();
          }}
          className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-900">
          <img
            src={place.imageUrl}
            alt={isArabic ? place.nameAr : place.nameEn}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Badges on hero */}
          <div className="absolute bottom-4 inset-x-5 flex items-end justify-between">
            <div>
              <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-emerald-500 text-white mb-2 shadow-sm">
                {place.type === 'attraction'
                  ? isArabic ? 'معلم سياحي رئيسي' : 'Major Attraction'
                  : isArabic ? 'خدمة سياحية ضرورية' : 'Essential Service'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {isArabic ? place.nameAr : place.nameEn}
              </h2>
            </div>

            <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white shrink-0">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-sm">{place.rating}</span>
              <span className="text-[11px] text-slate-300">({place.reviewCount.toLocaleString()})</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Distance & Walking/Driving strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {isArabic ? 'المسافة من موقعك:' : 'Distance from you:'}{' '}
                  <span className="text-emerald-700 font-extrabold">{formattedDistance}</span>
                </p>
                <p className="text-[11px] text-slate-500">
                  🚶 {walkText} &bull; 🚗 {driveText}
                </p>
              </div>
            </div>

            {/* Audio Tour Guide Button */}
            <button
              onClick={handleToggleAudio}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                isPlayingAudio
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>{isArabic ? 'إيقاف المرشد الصوتي' : 'Stop Audio'}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>{isArabic ? 'استمع للمرشد الصوتي' : 'Audio Guide'}</span>
                </>
              )}
            </button>
          </div>

          {/* Tourist Pro Tip Highlight */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs sm:text-sm mb-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{isArabic ? 'نصيحة السائح الذكي (Smart Tourist Tip)' : 'Smart Tourist Tip'}</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
              {isArabic ? place.touristTipAr : place.touristTipEn}
            </p>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">
              {isArabic ? 'عن هذا المكان' : 'About this location'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isArabic ? place.descriptionAr : place.descriptionEn}
            </p>
          </div>

          {/* Practical Info: Hours, Price, Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <Clock className="w-4 h-4 text-slate-500 shrink-0" />
              <div>
                <span className="font-bold text-slate-800 block">
                  {isArabic ? 'ساعات العمل' : 'Opening Hours'}
                </span>
                <span className="text-slate-600">{place.openingHours}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <CreditCard className="w-4 h-4 text-slate-500 shrink-0" />
              <div>
                <span className="font-bold text-slate-800 block">
                  {isArabic ? 'تكلفة الدخول' : 'Admission / Price'}
                </span>
                <span className="text-slate-600">
                  {place.priceLevel === 'free'
                    ? isArabic ? 'مجاني بالكامل' : 'Free admission'
                    : place.priceLevel}
                </span>
              </div>
            </div>

            {place.phone && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">
                    {isArabic ? 'رقم الهاتف' : 'Phone'}
                  </span>
                  <a
                    href={`tel:${place.phone}`}
                    className="text-emerald-700 font-semibold hover:underline"
                  >
                    {place.phone}
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
              <div>
                <span className="font-bold text-slate-800 block">
                  {isArabic ? 'العنوان بالتفصيل' : 'Detailed Address'}
                </span>
                <span className="text-slate-600 line-clamp-1">
                  {isArabic ? place.addressAr : place.addressEn}
                </span>
              </div>
            </div>
          </div>

          {/* Features & Accessibility Icons */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs mb-2">
              {isArabic ? 'المرافق والتسهيلات' : 'Facilities & Accessibility'}
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {place.features.hasWifi && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700">
                  <Wifi className="w-3.5 h-3.5 text-slate-600" />
                  <span>{isArabic ? 'واي فاي متوفر' : 'Free Wi-Fi'}</span>
                </span>
              )}
              {place.features.hasParking && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700">
                  <Car className="w-3.5 h-3.5 text-slate-600" />
                  <span>{isArabic ? 'مواقف سيارات' : 'Parking available'}</span>
                </span>
              )}
              {place.features.isWheelchairAccessible && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700">
                  <Accessibility className="w-3.5 h-3.5 text-slate-600" />
                  <span>{isArabic ? 'مهيأ للكراسي المتحركة' : 'Wheelchair accessible'}</span>
                </span>
              )}
              {place.features.isFamilyFriendly && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700">
                  <Users className="w-3.5 h-3.5 text-slate-600" />
                  <span>{isArabic ? 'مناسب للعائلات والأطفال' : 'Family friendly'}</span>
                </span>
              )}
              {place.features.acceptsCards && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700">
                  <CreditCard className="w-3.5 h-3.5 text-slate-600" />
                  <span>{isArabic ? 'دفع إلكتروني وبطاقات' : 'Card payment accepted'}</span>
                </span>
              )}
              {place.features.englishSpoken && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700">
                  <Languages className="w-3.5 h-3.5 text-slate-600" />
                  <span>{isArabic ? 'طاقم يتحدث الإنجليزية' : 'English spoken'}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Modal Sticky Bottom Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {/* Bookmark button */}
            <button
              onClick={() => onToggleBookmark(place.id)}
              className={`p-2.5 rounded-xl border transition-all ${
                isBookmarked
                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title={isArabic ? 'حفظ المكان' : 'Save bookmark'}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all"
              title={isArabic ? 'مشاركة المكان' : 'Share place'}
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copiedLink && (
              <span className="text-xs text-emerald-600 font-bold">
                {isArabic ? 'تم النسخ!' : 'Copied!'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Add to itinerary */}
            <button
              onClick={() => onToggleItinerary(place.id)}
              className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all ${
                isInItinerary
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
              }`}
            >
              {isInItinerary ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>{isArabic ? 'مضاف إلى مسارك' : 'In Itinerary'}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>{isArabic ? 'إضافة إلى مسار اليوم' : 'Add to Day Plan'}</span>
                </>
              )}
            </button>

            {/* Google Maps Directions */}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>{isArabic ? 'ابدأ الملاحة' : 'Get Directions'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
