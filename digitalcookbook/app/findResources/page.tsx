"use client";

import Script from "next/script";
import { useState, useEffect } from "react";

//google maps key and map id
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_MAPS_API_KEY;
const MAP_ID = "912b2dfe55b44487cd709d27";

//type for locations bc of typescript
type Location = {
  name: string;
  lat: number;
  lng: number;
  address: string;
  hours: string;
  phone: string;
  description: string;
};

// Declare Google Maps Web Components for typescript [AI helped here]
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "gmp-map": React.HTMLAttributes<HTMLElement> & {
        center?: string;
        zoom?: number;
        "map-id"?: string;
      };
      "gmp-advanced-marker": React.HTMLAttributes<HTMLElement> & {
        position?: string;
        title?: string;
      };
    }
  }
}

export default function MapPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [copyStatus, setCopyStatus] = useState("");

  //Fetch locations on client side
  useEffect(() => {
    //async function load for loading in locations
    async function load() {
      const res = await fetch("/api/locations");
      const data: Location[] = await res.json();
      setLocations(data);
    }
    //immediately call async function
    load();
  }, []);

  //everytime someone clicks a marker on the map, set the selected location and empty the copy status
  function handleMarkerClick(loc: Location) {
    setSelectedLocation(loc);
    setCopyStatus("");
  }

  //everytime an address is copied, set the copy status to copied, then set a little time out for the status to clear
  function handleCopyAddress(address: string) {
    navigator.clipboard.writeText(address).then(() => {
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus(""), 2000);
    });
  }

  //for open in google maps, Allows user to open google maps with the location pre loaded
  function googleMapsUrl(loc: Location) {
    const query = encodeURIComponent(`${loc.name}, ${loc.address}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }

  //Don’t render map until data is loaded
  if (locations.length === 0) {
    return <p>Loading map…</p>;
  }

  //once data is loaded, set the center and zoom
  const MAP_CENTER = `${locations[0].lat}, ${locations[0].lng}`;
  const MAP_ZOOM = 15;

  return (
    <>
      <Script src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=maps,marker&v=weekly`} strategy="afterInteractive"/>
      <main>
        <h1 className="text-center font-bold text-2xl">Helpful Resource Locations</h1>
        {/*Card that contains the google maps, map. Contains advanced markers that can trigger our pop up card*/}
        <div className="card bg-base-100 shadow-xl max-w-4xl mx-auto mt-6">
          <figure className="rounded-xl overflow-hidden">
            <gmp-map
              center={MAP_CENTER}
              zoom={MAP_ZOOM}
              map-id={MAP_ID}
              style={{ height: "400px", width: "100%" }}
            >
              {locations.map((loc) => (
                <gmp-advanced-marker
                  key={loc.name}
                  position={`${loc.lat}, ${loc.lng}`}
                  title={loc.name}
                  onClick={() => handleMarkerClick(loc)}
                />
              ))}
            </gmp-map>
            </figure>
          </div>
        
        {/*Pop up card, when selected Location is not null, this card comes up with info about a location.*/}
        {selectedLocation && (
          <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto mt-6 p-6">
            <div className="flex justify-between items-start">
              <h2 className="card-title">{selectedLocation.name}</h2>
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
              <a
                href={googleMapsUrl(selectedLocation)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                Open in Google Maps
              </a>

              <button
                onClick={() => handleCopyAddress(selectedLocation.address)}
                className="btn btn-outline btn-sm"
              >
                {copyStatus || "Copy Address"}
              </button>
            </div>
          </div>
        )}
        {/*Table that can be tabbed through of locations, also can be clicked to get popup card.*/}
        <div className="card bg-base-100 shadow-xl max-w-4xl mx-auto mt-6 p-4">
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

      </main>
    </>
  );
}