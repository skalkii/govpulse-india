"use client";

import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useEffect, useMemo } from "react";
import L from "leaflet";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label: string;
  sub?: string;
  value: string;       // displayed inside the marker / popup heading
  color: string;       // marker fill
}

interface Props {
  markers: MapMarker[];
  height?: number;
  /** Enable marker clustering for dense maps (e.g. Delhi AQI with 42 stations). */
  cluster?: boolean;
}

function FitToMarkers({ markers }: { markers: MapMarker[] }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length === 0) return;
    if (markers.length === 1) {
      map.setView([markers[0].lat, markers[0].lng], 9);
      return;
    }
    const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [markers, map]);
  return null;
}

export default function StationMap({ markers, height = 420, cluster = false }: Props) {
  const center = useMemo<[number, number]>(() => {
    if (markers.length === 0) return [22.5, 80];
    return [markers[0].lat, markers[0].lng];
  }, [markers]);

  const renderMarkers = markers.map((m) => (
    <CircleMarker
      key={m.id}
      center={[m.lat, m.lng]}
      radius={9}
      pathOptions={{
        color: "#ffffff",
        weight: 2,
        fillColor: m.color,
        fillOpacity: 0.92,
      }}
    >
      <Popup>
        <div className="text-sm">
          <div className="font-semibold">{m.label}</div>
          {m.sub && <div className="text-xs opacity-70">{m.sub}</div>}
          <div className="mt-1">
            <span
              className="inline-block rounded px-2 py-0.5 text-xs font-semibold text-white"
              style={{ backgroundColor: m.color }}
            >
              {m.value}
            </span>
          </div>
        </div>
      </Popup>
    </CircleMarker>
  ));

  return (
    <div className="overflow-hidden rounded-xl border" style={{ height }}>
      <MapContainer
        center={center}
        zoom={6}
        scrollWheelZoom={true}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <FitToMarkers markers={markers} />
        {cluster ? (
          <MarkerClusterGroup chunkedLoading maxClusterRadius={45}>
            {renderMarkers}
          </MarkerClusterGroup>
        ) : (
          renderMarkers
        )}
      </MapContainer>
    </div>
  );
}
