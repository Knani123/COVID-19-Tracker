import React, { useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "./Map.css";
import { showDataOnMap } from "./util";
const MyMap = ({ countries, casesType, center, zoom, myColor }) => {
  return (
    <div className="mymap">
      <MapContainer center={center} zoom={zoom}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {showDataOnMap(countries, casesType, myColor)}
      </MapContainer>
    </div>
  );
};

export default MyMap;
