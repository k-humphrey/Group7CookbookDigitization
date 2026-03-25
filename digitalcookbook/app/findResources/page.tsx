"use client";

import Script from "next/script";
import { useState, useEffect, useRef } from "react";

//api key and map ID
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_MAPS_API_KEY;
const MAP_ID = "912b2dfe55b44487cd709d27";

//location type for typescript
type Location = {
  name: string;
  lat: number;
  lng: number;
  address: string;
  hours: string;
  phone: string;
  description: string;
};

//have to declare the google map API stuff for typescript as well [AI made this]
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "gmp-map": React.HTMLAttributes<HTMLElement> & {
        "map-id"?: string;
      };
      "gmp-advanced-marker": React.HTMLAttributes<HTMLElement> & {
        title?: string;
      };
    }
  }
}

//AI mangled version of the old marker loading system.. Does some weird stuff that fixes a rendering and typing issue
function AdvancedMarker({ loc, onClick }: { loc: Location; onClick: () => void }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    (el as any).position = { lat: loc.lat, lng: loc.lng };
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [loc, onClick]);

  return <gmp-advanced-marker ref={ref} title={loc.name} />;
}

//AI mangled this and made it a function version of the Map that fixes a rendering issue
function MapComponent({ locations, onMarkerClick }: { locations: Location[]; onMarkerClick: (loc: Location) => void }) {
  const mapRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    (el as any).center = { lat: locations[0].lat, lng: locations[0].lng };
    (el as any).zoom = 15;
  }, [locations]);

  return (
    <gmp-map ref={mapRef} map-id={MAP_ID} style={{ height: "400px", width: "100%" }}>
      {locations.map((loc) => (
        <AdvancedMarker
          key={loc.name}
          loc={loc}
          onClick={() => onMarkerClick(loc)}
        />
      ))}
    </gmp-map>
  );
}

export default function MapPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const [mapsReady, setMapsReady] = useState(false);

  //load function needed to safetly call my api route. we just load in everything in location table from DB
  useEffect(() => {
    async function load() {
      const res = await fetch("/api/locations");
      const data: Location[] = await res.json();
      setLocations(data);
    }
    load();
  }, []);

  //busy waiting  (100ms) for the gmp map and gmp advanced marker components to be ready before we try to actually render them.
  useEffect(() => {
    const interval = setInterval(() => {
      if (customElements.get("gmp-map") && customElements.get("gmp-advanced-marker")) {
        clearInterval(interval);
        setMapsReady(true);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  //if we click a marker, set the selected location and clear the copy status
  function handleMarkerClick(loc: Location) {
    setSelectedLocation(loc);
    setCopyStatus("");
  }

  //if copy address is clicked, copy to clipboard and set the copy status to Copied for 2000ms
  function handleCopyAddress(address: string) {
    navigator.clipboard.writeText(address).then(() => {
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus(""), 2000);
    });
  }

  //function that will open google maps with the selected location
  function googleMapsUrl(loc: Location) {
    const query = encodeURIComponent(`${loc.name}, ${loc.address}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }

  //we check the state of the readiness and whether locations has been loaded yet
  const mapIsReady = mapsReady && locations.length > 0;

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=maps,marker&v=weekly`}
        strategy="afterInteractive"
      />
      <main>
        <h1 className="text-center font-bold text-2xl mt-5">Helpful Resource Locations</h1>

        {/*Check if the map is ready, and only load it when it's actually ready. */}
        {!mapIsReady ? (
          <p className="text-center mt-6">Loading map…</p>
        ) : (
          <>
          {/*Map card*/}
            <div className="card bg-base-100 shadow-xl max-w-4xl mx-auto mt-6">
              <figure className="rounded-xl overflow-hidden">
                <MapComponent locations={locations} onMarkerClick={handleMarkerClick} />
              </figure>
            </div>

            {/*If the selected Location state is non empty (something has been clicked) so we will show a card description*/}
            {selectedLocation && (
              <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto mt-6 p-6">
                <div className="flex justify-between items-start">
                  <h2 className="card-title">{selectedLocation.name}</h2>
                  {/*X button that will remove selected location, thus hiding the card. */}
                  <button
                    onClick={() => setSelectedLocation(null)}
                    className="btn btn-sm btn-circle btn-ghost"
                  >
                    ✕
                  </button>
                </div>

                <p className="mt-2">{selectedLocation.description}</p>

                <div className="mt-4 space-y-1">
                  <p><strong>Address:</strong> {selectedLocation.address}</p>
                  <p><strong>Hours:</strong> {selectedLocation.hours}</p>
                  <p><strong>Phone:</strong> {selectedLocation.phone}</p>
                </div>

                <div className="mt-4 flex items-center gap-3">
                {/*a button hyperlink that dynamically routes to google maps with the selected address */}
                  <a
                    href={googleMapsUrl(selectedLocation)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    Open in Google Maps
                  </a>
                  {/*A button that will let you copy your selected address to the clipboard */}
                  <button
                    onClick={() => handleCopyAddress(selectedLocation.address)}
                    className="btn btn-outline btn-sm"
                  >
                    {copyStatus || "Copy Address"}
                  </button>
                </div>
              </div>
            )}
            <div className="card bg-base-100 shadow-xl max-w-4xl mx-auto mt-6 p-4 overflow-y-auto max-h-96 mb-4">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Hours</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {/*Table, each row is a button that also triggers the popup info card*/}
                  {locations.map((loc) => (
                    <tr
                      key={loc.name}
                      tabIndex={0}
                      role="button"
                      onClick={() => handleMarkerClick(loc)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleMarkerClick(loc);
                        }
                      }}
                      className="cursor-pointer hover:bg-base-200"
                    >
                      <td>{loc.name}</td>
                      <td>{loc.address}</td>
                      <td>{loc.hours}</td>
                      <td>{loc.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </>
  );
}