import React, { useState, useEffect, useMemo } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { CITIES, CATEGORIES, PLACES } from './data/touristData';
import { City, CategoryId, Place } from './types/tourist';
import { calculateDistanceKm } from './utils/distance';
import { Navbar } from './components/Navbar';
import { CategoryFilter } from './components/CategoryFilter';
import { RadiusFilter } from './components/RadiusFilter';
import { PlaceCard } from './components/PlaceCard';
import { TouristMap } from './components/TouristMap';
import { PlaceDetailModal } from './components/PlaceDetailModal';
import { ItineraryDrawer } from './components/ItineraryDrawer';
import { ServicesQuickGrid } from './components/ServicesQuickGrid';
import { Compass, Sparkles, MapPin, AlertCircle, HeartHandshake } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export default function App() {
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [isArabic, setIsArabic] = useState(true);
  const [currentCity, setCurrentCity] = useState<City>(CITIES[0]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [activeTypeFilter, setActiveTypeFilter] = useState<'all' | 'attraction' | 'service'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [radiusKm, setRadiusKm] = useState<number>(25);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'reviews'>('distance');
  const [openOnly, setOpenOnly] = useState(false);
  const [freeOnly, setFreeOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'list'>('split');
  const [isSavedOnly, setIsSavedOnly] = useState(false);

  // Modals & Drawers
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isItineraryOpen, setIsItineraryOpen] = useState(false);
  const [isQuickServicesOpen, setIsQuickServicesOpen] = useState(false);

  // Bookmarks & Itinerary in localStorage
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('tourist_bookmarks');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [itineraryIds, setItineraryIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('tourist_itinerary');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Listen for Google Maps quota exceeded event
  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Update HTML dir when language changes
  useEffect(() => {
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = isArabic ? 'ar' : 'en';
  }, [isArabic]);

  // Persist bookmarks
  useEffect(() => {
    localStorage.setItem('tourist_bookmarks', JSON.stringify(Array.from(bookmarkedIds)));
  }, [bookmarkedIds]);

  // Persist itinerary
  useEffect(() => {
    localStorage.setItem('tourist_itinerary', JSON.stringify(Array.from(itineraryIds)));
  }, [itineraryIds]);

  // Geolocation Handler
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setLocationError(
        isArabic
          ? 'المتصفح لا يدعم خاصية تحديد الموقع الجغرافي'
          : 'Geolocation is not supported by your browser'
      );
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLocation(coords);
        setIsLocating(false);

        // Find closest supported city to adjust focus smoothly
        let closestCity = CITIES[0];
        let minDistance = Infinity;
        for (const city of CITIES) {
          const d = calculateDistanceKm(coords.lat, coords.lng, city.lat, city.lng);
          if (d < minDistance) {
            minDistance = d;
            closestCity = city;
          }
        }
        if (minDistance < 150) {
          setCurrentCity(closestCity);
        }
      },
      (err) => {
        setIsLocating(false);
        setLocationError(
          isArabic
            ? 'تعذر الوصول إلى موقعك. يرجى تفعيل إذن الموقع في المتصفح أو اختيار المدينة يدوياً.'
            : 'Could not access your location. Please enable location permissions or select a city manually.'
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Base coordinate for distance calculations: user's live GPS if available, else current city center
  const referencePoint = useMemo(() => {
    return userLocation || { lat: currentCity.lat, lng: currentCity.lng };
  }, [userLocation, currentCity]);

  // Precompute distances for all places
  const placeDistances = useMemo(() => {
    const map: Record<string, number> = {};
    for (const place of PLACES) {
      map[place.id] = calculateDistanceKm(
        referencePoint.lat,
        referencePoint.lng,
        place.lat,
        place.lng
      );
    }
    return map;
  }, [referencePoint]);

  // Filtered and sorted places
  const filteredPlaces = useMemo(() => {
    return PLACES.filter((place) => {
      // City matching: If user location is not active, match current selected city
      if (!userLocation && place.cityId !== currentCity.id) {
        return false;
      }

      // Saved only filter
      if (isSavedOnly && !bookmarkedIds.has(place.id)) {
        return false;
      }

      // Place Type filter (Attraction vs Service)
      if (activeTypeFilter !== 'all' && place.type !== activeTypeFilter) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && place.category !== selectedCategory) {
        return false;
      }

      // Radius filter
      const distance = placeDistances[place.id] || 0;
      if (distance > radiusKm) {
        return false;
      }

      // Open only
      if (openOnly && !place.isOpen) {
        return false;
      }

      // Free only
      if (freeOnly && place.priceLevel !== 'free') {
        return false;
      }

      // Text search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName =
          place.nameAr.toLowerCase().includes(q) ||
          place.nameEn.toLowerCase().includes(q);
        const matchDesc =
          place.descriptionAr.toLowerCase().includes(q) ||
          place.descriptionEn.toLowerCase().includes(q);
        const matchAddress =
          place.addressAr.toLowerCase().includes(q) ||
          place.addressEn.toLowerCase().includes(q);
        const matchTag = place.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchAddress && !matchTag) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'distance') {
        return (placeDistances[a.id] || 0) - (placeDistances[b.id] || 0);
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'reviews') {
        return b.reviewCount - a.reviewCount;
      }
      return 0;
    });
  }, [
    currentCity,
    userLocation,
    isSavedOnly,
    bookmarkedIds,
    activeTypeFilter,
    selectedCategory,
    radiusKm,
    openOnly,
    freeOnly,
    searchQuery,
    sortBy,
    placeDistances,
  ]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryId, number> = {
      all: 0,
      landmarks: 0,
      museums: 0,
      nature: 0,
      entertainment: 0,
      food: 0,
      atm: 0,
      pharmacy: 0,
      mosque: 0,
      transport: 0,
      shopping: 0,
      tourist_info: 0,
    };

    const relevantPlaces = PLACES.filter((p) =>
      userLocation ? true : p.cityId === currentCity.id
    );

    counts.all = relevantPlaces.length;
    for (const p of relevantPlaces) {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    }
    return counts;
  }, [currentCity, userLocation]);

  // Toggle bookmark
  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Toggle itinerary
  const handleToggleItinerary = (id: string) => {
    setItineraryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Itinerary items list
  const itineraryPlaces = useMemo(() => {
    return PLACES.filter((p) => itineraryIds.has(p.id));
  }, [itineraryIds]);

  // Text-to-speech audio player
  const handlePlayAudio = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isArabic ? 'ar-SA' : 'en-US';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['marker']}>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        {/* Tier 2: Quota Exceeded Sticky Banner */}
        {quotaExceeded && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-xs">
            <span>
              Google Maps Platform quota reached. If you are the app owner, visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-amber-950 hover:text-amber-800"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </span>
          </div>
        )}

        {/* Location permission error toast */}
        {locationError && (
          <div className="bg-rose-50 border-b border-rose-200 text-rose-800 px-4 py-2 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{locationError}</span>
            </div>
            <button
              onClick={() => setLocationError(null)}
              className="font-bold text-rose-600 hover:text-rose-900"
            >
              ✕
            </button>
          </div>
        )}

        {/* Top Navbar */}
        <Navbar
          cities={CITIES}
          currentCity={currentCity}
          onSelectCity={(city) => {
            setCurrentCity(city);
            setSelectedPlace(null);
          }}
          onLocateMe={handleLocateMe}
          isLocating={isLocating}
          hasUserLocation={!!userLocation}
          isArabic={isArabic}
          onToggleLanguage={() => setIsArabic(!isArabic)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          itineraryCount={itineraryIds.size}
          onOpenItinerary={() => setIsItineraryOpen(true)}
          savedCount={bookmarkedIds.size}
          onToggleSavedOnly={() => setIsSavedOnly(!isSavedOnly)}
          isSavedOnly={isSavedOnly}
          onOpenQuickServices={() => setIsQuickServicesOpen(true)}
        />

        {/* Category Filter Chips */}
        <CategoryFilter
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          isArabic={isArabic}
          categoryCounts={categoryCounts}
          activeTypeFilter={activeTypeFilter}
          onChangeTypeFilter={setActiveTypeFilter}
        />

        {/* Radar & Sorting Toolbar */}
        <RadiusFilter
          radiusKm={radiusKm}
          onRadiusChange={setRadiusKm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          openOnly={openOnly}
          onToggleOpenOnly={() => setOpenOnly(!openOnly)}
          freeOnly={freeOnly}
          onToggleFreeOnly={() => setFreeOnly(!freeOnly)}
          isArabic={isArabic}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalFiltered={filteredPlaces.length}
        />

        {/* Main Workspace: Map & Feed */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col gap-4">
          {/* Welcome Tourist Banner when selecting a city */}
          {!userLocation && (
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-4 sm:p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                    {isArabic ? currentCity.nameAr : currentCity.nameEn}
                  </span>
                  <span className="text-xs text-slate-300">
                    {isArabic ? currentCity.countryAr : currentCity.countryEn}
                  </span>
                </div>
                <h2 className="text-lg sm:text-2xl font-black mb-1">
                  {isArabic ? currentCity.welcomeMessageAr : currentCity.welcomeMessageEn}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  {isArabic
                    ? 'استكشف أهم المعالم والخدمات الحيوية كالصرافات والصيدليات والمساجد والمواصلات أو فعّل GPS لتحديد الأقرب إليك لحظياً.'
                    : 'Discover top monuments and vital services like ATMs, pharmacies, mosques, and transport or activate GPS for live proximity.'}
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-2 shrink-0">
                <button
                  onClick={handleLocateMe}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                >
                  <MapPin className="w-4 h-4" />
                  <span>{isArabic ? 'حدد موقعي الآن' : 'Find Near Me'}</span>
                </button>
                <button
                  onClick={() => setIsQuickServicesOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition-all"
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>{isArabic ? 'خدمات وطوارئ' : 'Emergency & Rates'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Content Area: Split View, Map Only, or List Only */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[550px]">
            {/* List / Feed Column */}
            {(viewMode === 'split' || viewMode === 'list') && (
              <div
                className={`${
                  viewMode === 'split' ? 'lg:col-span-5 xl:col-span-5' : 'lg:col-span-12'
                } flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-250px)] pr-1`}
              >
                {filteredPlaces.length === 0 ? (
                  <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
                    <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                      <Compass className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-base mb-1">
                      {isArabic ? 'لا توجد أماكن مطابقة لبحثك' : 'No places found'}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                      {isArabic
                        ? 'جرّب توسيع نطاق المسافة (أكثر من 25 كم) أو تغيير التصنيف أو إلغاء فلاتر البحث.'
                        : 'Try increasing the distance radius or resetting your search filter.'}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setActiveTypeFilter('all');
                        setSearchQuery('');
                        setRadiusKm(100);
                        setOpenOnly(false);
                        setFreeOnly(false);
                        setIsSavedOnly(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                    >
                      {isArabic ? 'إعادة ضبط كل الفلاتر' : 'Reset All Filters'}
                    </button>
                  </div>
                ) : (
                  <div
                    className={`grid gap-4 ${
                      viewMode === 'list'
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-1'
                    }`}
                  >
                    {filteredPlaces.map((place) => (
                      <PlaceCard
                        key={place.id}
                        place={place}
                        distanceKm={placeDistances[place.id] || 0}
                        isSelected={selectedPlace?.id === place.id}
                        isBookmarked={bookmarkedIds.has(place.id)}
                        isInItinerary={itineraryIds.has(place.id)}
                        isArabic={isArabic}
                        onSelect={(p) => setSelectedPlace(p)}
                        onToggleBookmark={handleToggleBookmark}
                        onToggleItinerary={handleToggleItinerary}
                        onPlayAudio={handlePlayAudio}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Map Column */}
            {(viewMode === 'split' || viewMode === 'map') && (
              <div
                className={`${
                  viewMode === 'split' ? 'lg:col-span-7 xl:col-span-7' : 'lg:col-span-12'
                } h-[500px] lg:h-auto min-h-[480px] rounded-2xl overflow-hidden sticky top-28`}
              >
                <TouristMap
                  places={filteredPlaces}
                  selectedPlace={selectedPlace}
                  onSelectPlace={(p) => setSelectedPlace(p)}
                  userLocation={userLocation}
                  center={{ lat: currentCity.lat, lng: currentCity.lng }}
                  zoom={currentCity.zoom}
                  isArabic={isArabic}
                  distances={placeDistances}
                  bookmarkedIds={bookmarkedIds}
                  itineraryIds={itineraryIds}
                  onToggleBookmark={handleToggleBookmark}
                  onToggleItinerary={handleToggleItinerary}
                  onPlayAudio={handlePlayAudio}
                />
              </div>
            )}
          </div>
        </main>

        {/* Place Detail Modal */}
        <PlaceDetailModal
          place={selectedPlace}
          distanceKm={selectedPlace ? placeDistances[selectedPlace.id] || 0 : 0}
          isOpen={!!selectedPlace}
          onClose={() => setSelectedPlace(null)}
          isBookmarked={selectedPlace ? bookmarkedIds.has(selectedPlace.id) : false}
          isInItinerary={selectedPlace ? itineraryIds.has(selectedPlace.id) : false}
          isArabic={isArabic}
          onToggleBookmark={handleToggleBookmark}
          onToggleItinerary={handleToggleItinerary}
        />

        {/* Daily Itinerary Drawer */}
        <ItineraryDrawer
          isOpen={isItineraryOpen}
          onClose={() => setIsItineraryOpen(false)}
          itineraryPlaces={itineraryPlaces}
          onRemovePlace={handleToggleItinerary}
          onClearAll={() => setItineraryIds(new Set())}
          isArabic={isArabic}
          distances={placeDistances}
          onSelectPlace={(p) => {
            setSelectedPlace(p);
            setIsItineraryOpen(false);
          }}
        />

        {/* Quick Services & Emergency Dialog */}
        <ServicesQuickGrid
          isOpen={isQuickServicesOpen}
          onClose={() => setIsQuickServicesOpen(false)}
          city={currentCity}
          isArabic={isArabic}
          onFilterByCategory={(catId) => {
            setSelectedCategory(catId);
            setActiveTypeFilter('service');
          }}
        />
      </div>
    </APIProvider>
  );
}
