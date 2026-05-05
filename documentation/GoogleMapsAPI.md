# **Map Page Documentation (Google Maps Web Components Integration)**

## **Overview**
The findResouces page implements an interactive map of community resource locations using **Google Maps Web Components** (`gmp-map` and `gmp-advanced-marker`).  
It loads location data from the backend, renders markers, displays a details card when a marker is clicked, and provides a searchable table of all locations.

---

# **1. Technology Used**

### **Google Maps Web Components**
The page uses:

- `<gmp-map>`  
- `<gmp-advanced-marker>`

These are part of Google’s new Web Components API, which replaces the older imperative Maps JS API.


# **2. Data Model**

### **Location Type**
```ts
type Location = {
  name: string;
  lat: number;
  lng: number;
  address: string;
  hours: string;
  phone: string;
  description: string;
};
```

This matches the structure returned by `/api/locations`.

---

# **3. Component Architecture**

## **3.1 `AdvancedMarker`**
A wrapper around `<gmp-advanced-marker>` that:

- Uses a `ref` to access the underlying DOM element
- Sets the marker’s position via `el.position = { lat, lng }`
- Attaches a click listener manually

---

## **3.2 `MapComponent`**
Responsible for:

- Rendering the `<gmp-map>` element
- Setting the map center and zoom once locations load
- Rendering all markers as children

The map is centered on the first location:

```ts
(el as any).center = { lat: locations[0].lat, lng: locations[0].lng };
(el as any).zoom = 15;
```

---

## **3.3 `MapPage` (Main Component)**

### **State Variables**
| State | Purpose |
|-------|---------|
| `locations` | All locations loaded from the API |
| `selectedLocation` | The location currently selected (marker or table row) |
| `copyStatus` | UI feedback for clipboard copy |
| `mapsReady` | Whether Web Components are defined |

---

# **5. Loading Google Maps**

### **Script Loading**
```tsx
<Script
  src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=maps,marker&v=weekly`}
  strategy="afterInteractive"
/>
```
This loads the Maps JS API **after hydration**, preventing SSR issues.

---
