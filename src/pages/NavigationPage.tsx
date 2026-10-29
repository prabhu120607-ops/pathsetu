import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Clock,
  LocateFixed,
  StopCircle,
  Phone,
  Globe,
  Radio
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { VERIFIED_DESTINATIONS } from '../data/destinations';
import { Destination, RouteGeometry } from '../types';
import { navigationService } from '../services/navigationService';
import { useLanguage } from '../context/LanguageContext';

export const NavigationPage: React.FC = () => {
  const { language } = useLanguage();

  const [destinations] = useState<Destination[]>(VERIFIED_DESTINATIONS);
  const [selectedDestination, setSelectedDestination] = useState<Destination>(VERIFIED_DESTINATIONS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Navigation & GPS Tracking State
  const [isTracking, setIsTracking] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteGeometry | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Leaflet map refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const destMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Fix default Leaflet icon paths in bundler
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapContainerRef.current).setView(
        [selectedDestination.latitude, selectedDestination.longitude],
        13
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    updateDestinationMarker(selectedDestination);

    return () => {
      // Cleanup on unmount
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update destination marker when selectedDestination changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      updateDestinationMarker(selectedDestination);
      if (userLocation) {
        fetchAndDrawRoute(userLocation.lat, userLocation.lng, selectedDestination.latitude, selectedDestination.longitude);
      }
    }
  }, [selectedDestination]);

  const updateDestinationMarker = (dest: Destination) => {
    if (!mapInstanceRef.current) return;

    if (destMarkerRef.current) {
      destMarkerRef.current.remove();
    }

    const destIcon = L.divIcon({
      className: 'custom-dest-pin',
      html: `<div style="background-color:#2563EB; color:white; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 8px rgba(0,0,0,0.3); border:2px solid white;">🏛️</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const marker = L.marker([dest.latitude, dest.longitude], { icon: destIcon })
      .addTo(mapInstanceRef.current)
      .bindPopup(`<b>${dest.name}</b><br/>${dest.address}`)
      .openPopup();

    destMarkerRef.current = marker;

    if (!userLocation) {
      mapInstanceRef.current.setView([dest.latitude, dest.longitude], 13);
    }
  };

  const updateUserMarker = (lat: number, lng: number, accuracy: number) => {
    if (!mapInstanceRef.current) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([lat, lng]);
    } else {
      const userIcon = L.divIcon({
        className: 'custom-user-pin',
        html: `<div style="background-color:#2563EB; color:white; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid #FFFFFF;">📍</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([lat, lng], { icon: userIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`<b>Your Current Location</b><br/>GPS Accuracy: ±${Math.round(accuracy)}m`);

      userMarkerRef.current = marker;
    }
  };

  const fetchAndDrawRoute = async (startLat: number, startLng: number, destLat: number, destLng: number) => {
    setIsLoadingRoute(true);
    try {
      const route = await navigationService.getRoute(startLat, startLng, destLat, destLng);
      setRouteInfo(route);

      if (mapInstanceRef.current) {
        if (routePolylineRef.current) {
          routePolylineRef.current.remove();
        }

        const poly = L.polyline(route.coordinates, {
          color: '#234B3D',
          weight: 5,
          opacity: 0.85,
          dashArray: '1, 6'
        }).addTo(mapInstanceRef.current);

        routePolylineRef.current = poly;

        // Fit bounds to show both user and destination
        const bounds = L.latLngBounds([
          [startLat, startLng],
          [destLat, destLng]
        ]);
        mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
      }
    } catch (e) {
      console.warn('Failed to draw route:', e);
    } finally {
      setIsLoadingRoute(false);
    }
  };

  // Start Navigation Consent Flow
  const handleStartNavigationClick = () => {
    if (isTracking) {
      stopNavigation();
      return;
    }
    // Show explicit informed consent modal
    setIsConsentModalOpen(true);
  };

  const confirmConsentAndStartTracking = () => {
    setIsConsentModalOpen(false);
    setGeoError(null);

    if (!('geolocation' in navigator)) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setIsTracking(true);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setGpsAccuracy(accuracy);
        setLastUpdated(new Date().toLocaleTimeString());
        setGeoError(null);

        updateUserMarker(latitude, longitude, accuracy);
        fetchAndDrawRoute(latitude, longitude, selectedDestination.latitude, selectedDestination.longitude);
      },
      (error) => {
        let msg = 'Failed to obtain live location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please allow location access in your browser settings to track live turn-by-turn distance.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location signal currently unavailable. Using destination coordinates.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out.';
        }
        setGeoError(msg);
        stopNavigation();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      }
    );

    watchIdRef.current = watchId;
  };

  const stopNavigation = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }
    setUserLocation(null);
    setRouteInfo(null);
  };

  const filteredDestinations = destinations.filter(d => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === 'All' || d.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-6 sm:py-8 space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-elevated text-brand-primary border border-brand-border text-xs font-bold uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Feature B · Destination Discovery & Live GPS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">
            Find Your Institution & Real-Time Navigation
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-2xl">
            Locate verified government colleges, ITIs, and polytechnics. Start privacy-conscious live GPS routing with OpenStreetMap and OSRM turn-by-turn guidance.
          </p>
        </div>

        {/* Live Tracking Controls */}
        <div className="flex items-center gap-2">
          {isTracking && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-pulse">
              <Radio className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tracking Active</span>
            </div>
          )}

          <button
            onClick={handleStartNavigationClick}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-brand-sm text-xs font-bold  transition-all ${
              isTracking
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-brand-primary text-white hover:bg-brand-primary-hover'
            }`}
          >
            {isTracking ? (
              <>
                <StopCircle className="w-4 h-4" />
                <span>Stop Navigation</span>
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                <span>Start Live Navigation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Geolocation Notice / Error Alert */}
      {geoError && (
        <div className="p-4 rounded-brand-sm bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold">Location Access Notice:</div>
            <p>{geoError}</p>
            <div className="pt-1">
              <a
                href={navigationService.getGoogleMapsUrl(
                  selectedDestination.latitude,
                  selectedDestination.longitude,
                  selectedDestination.name
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline text-rose-800 inline-flex items-center gap-1"
              >
                <span>Open Destination in Google Maps Instead</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Destinations List + Leaflet Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col: Destination Selector */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="bg-brand-surface border border-brand-border rounded-brand p-4  space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search colleges, ITIs, cities..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-brand-sm border border-brand-border bg-brand-elevated/40 text-brand-dark focus:border-brand-primary focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto text-[11px] pb-1">
              {['All', 'University', 'Polytechnic / ITI', 'Agricultural Institute', 'Medical College'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                    categoryFilter === cat
                      ? 'bg-brand-primary text-white'
                      : 'bg-brand-elevated text-brand-muted hover:text-brand-dark'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Destinations Scroll List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredDestinations.map(dest => {
              const isSelected = selectedDestination.id === dest.id;
              return (
                <div
                  key={dest.id}
                  onClick={() => setSelectedDestination(dest)}
                  className={`p-4 rounded-brand-sm border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brand-primary-light/40 border-brand-primary shadow-xs'
                      : 'bg-white border-brand-border hover:border-brand-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">
                      {dest.category}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-800 flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-brand-dark mt-1 leading-snug">
                    {dest.name}
                  </h3>
                  <div className="text-[11px] text-brand-muted mt-0.5">
                    {dest.city}, {dest.state}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right Col: Leaflet Map & Navigation Info Box */}
        <main className="lg:col-span-8 space-y-4">
          {/* Map Container */}
          <div className="bg-brand-surface border border-brand-border rounded-brand overflow-hidden  relative">
            <div
              ref={mapContainerRef}
              className="w-full h-[450px] z-0"
              style={{ minHeight: '400px' }}
            />

            {/* GPS Telemetry Pill Overlay */}
            {isTracking && (
              <div className="absolute top-4 right-4 z-[400] bg-brand-surface px-3.5 py-2 rounded-brand-sm border border-brand-border  text-[11px] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>Live GPS Tracking</span>
                </div>
                {gpsAccuracy && (
                  <div className="text-brand-muted">Accuracy: ±{Math.round(gpsAccuracy)}m</div>
                )}
                {lastUpdated && (
                  <div className="text-brand-muted">Updated: {lastUpdated}</div>
                )}
              </div>
            )}
          </div>

          {/* Destination Details & Routing Summary Box */}
          <div className="bg-brand-surface border border-brand-border rounded-brand p-6  space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-brand-border">
              <div>
                <span className="text-[10px] font-bold uppercase text-brand-primary tracking-wider">
                  Selected Destination
                </span>
                <h2 className="text-lg font-black text-brand-dark mt-0.5">
                  {selectedDestination.name}
                </h2>
                <div className="text-xs text-brand-muted mt-0.5">
                  {selectedDestination.address}, {selectedDestination.city} — {selectedDestination.pincode}
                </div>
              </div>

              {/* External Navigation Links */}
              <div className="flex items-center gap-2">
                <a
                  href={navigationService.getGoogleMapsUrl(
                    selectedDestination.latitude,
                    selectedDestination.longitude,
                    selectedDestination.name
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-brand-sm border border-brand-border bg-brand-elevated text-brand-dark text-xs font-semibold hover:border-brand-primary flex items-center gap-1"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3 text-brand-muted" />
                </a>

                <a
                  href={navigationService.getOpenStreetMapUrl(
                    selectedDestination.latitude,
                    selectedDestination.longitude,
                    userLocation?.lat,
                    userLocation?.lng
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-brand-sm border border-brand-border bg-brand-elevated text-brand-dark text-xs font-semibold hover:border-brand-primary flex items-center gap-1"
                >
                  <span>OpenStreetMap</span>
                  <ExternalLink className="w-3 h-3 text-brand-muted" />
                </a>
              </div>
            </div>

            {/* Live Route Calculation Cards */}
            {routeInfo && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-emerald-50 rounded-brand-sm border border-emerald-200 text-xs">
                <div>
                  <span className="text-emerald-800 font-semibold block">Route Distance:</span>
                  <strong className="text-base text-emerald-950 font-black">{routeInfo.distanceKm} km</strong>
                </div>
                <div>
                  <span className="text-emerald-800 font-semibold block">Est. Driving Time:</span>
                  <strong className="text-base text-emerald-950 font-black">~{routeInfo.durationMinutes} mins</strong>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-emerald-800 font-semibold block">Routing Engine:</span>
                  <span className="text-emerald-950 font-medium">{routeInfo.summary}</span>
                </div>
              </div>
            )}

            {/* Institution Info & Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-brand-dark">
              <div>
                <span className="font-bold text-brand-muted block mb-1">Key Programs & Facilities:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDestination.features.map(f => (
                    <span key={f} className="px-2 py-0.5 rounded bg-brand-elevated text-[10px] font-medium border border-brand-border">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-brand-muted block mb-1">Contact & Verification:</span>
                <div className="space-y-1 text-xs text-brand-muted">
                  {selectedDestination.contact_phone && (
                    <div className="flex items-center gap-1.5 text-brand-dark">
                      <Phone className="w-3.5 h-3.5 text-brand-muted" />
                      <span>{selectedDestination.contact_phone}</span>
                    </div>
                  )}
                  {selectedDestination.website && (
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-brand-muted" />
                      <a href={selectedDestination.website} target="_blank" rel="noopener noreferrer" className="text-brand-primary underline truncate">
                        {selectedDestination.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Explicit Geolocation Informed Consent Modal */}
      {isConsentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-brand-lg max-w-md w-full p-6 shadow-modal space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                <Navigation className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-black text-brand-dark text-base">
                Enable Live Navigation & Location
              </h3>
            </div>

            <p className="text-xs text-brand-muted leading-relaxed">
              PathSetu uses your device's browser GPS to display your current position on the map and calculate turn-by-turn distance to <strong className="text-brand-dark">{selectedDestination.name}</strong>.
            </p>

            <div className="p-3 bg-brand-elevated rounded-brand-sm border border-brand-border text-xs text-brand-dark/90 space-y-1.5">
              <div className="font-bold flex items-center gap-1 text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Privacy Safeguards:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[11px] text-brand-muted">
                <li>Your location coordinates are processed only on your device and never stored on a server.</li>
                <li>Tracking stops instantly when you click "Stop Navigation" or leave this page.</li>
                <li>We do not track you in the background.</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsConsentModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-brand-sm border border-brand-border text-brand-muted hover:text-brand-dark"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmConsentAndStartTracking}
                className="px-5 py-2 text-xs font-bold rounded-brand-sm bg-brand-primary text-white hover:bg-brand-primary-hover "
              >
                Allow & Start Navigation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
