import {LatLngTuple  } from "leaflet";

export interface Pin {
  id: string;
  location: LatLngTuple;
  date: string;
}

export interface MyComponentProps {
  addPin: (newPin: Pin) => void;
}