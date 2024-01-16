import { MapContainer, TileLayer, Marker, useMapEvent } from "react-leaflet";
import "./MapComponent.scss";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { Icon,LatLngTuple  } from "leaflet";
import { addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { colRef } from "../../utills/firebase";
import { MyComponentProps, Pin } from "../Types/Types";


const MyComponent: React.FC<MyComponentProps> = ({ addPin }) => {
  const map = useMapEvent("click", (e) => {
    const currentDate = new Date();
    addPin({
      location: [e.latlng.lat, e.latlng.lng],
      date: currentDate.toISOString(),
      id:''
    });
  });
  return null;
};

export const MapComponent = () => {
  const [pins, setPins] =  useState<Pin[]>([]);

  const addPin = (newPin:Pin) => {
    addDoc(colRef, newPin).then((res) => {
      setPins((prevPins) => [
        ...prevPins,
        { ...newPin, id: res.id },
      ]);
    });
  };

  const deletePin = (pin:Pin) => {
    setPins((prevPins) =>
      prevPins.filter((existingPin) => existingPin.id !== pin.id)
    );

    deleteDoc(doc(colRef, pin.id));
  };

  const movePin = async (movedPin:Pin) => {
    console.log(movedPin);

    try {
      await updateDoc(doc(colRef, movedPin.id), {
        location: movedPin.location,
      });

      setPins((prevPins) =>
        prevPins.map((existingPin) =>
          existingPin.id === movedPin.id
            ? { ...existingPin, location: movedPin.location }
            : existingPin
        )
      );
    } catch (error) {
      throw new Error("Error moving pin:");
    }
  };


  const eraseAll = () => {
    for (const pin of pins) {
      deleteDoc(doc(colRef, pin.id));
    }
    setPins([]);
  };
  
  const newIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/256/8989/8989464.png",
    iconSize: [40, 40],
  });

  

  useEffect(() => {
    const pinsToDisplay:Pin[] = [];

    getDocs(colRef).then((snapshot) => {
      snapshot.docs.forEach((doc) => {
       const pinData :Pin = doc.data() as Pin;
        pinsToDisplay.push({...pinData, id: doc.id });
      });
      setPins([...pinsToDisplay]);
    });
  }, []);

  return (
    <>
      <button onClick={eraseAll}>Get rid of pins</button>

      <MapContainer center={[49.842957,24.031111]} zoom={13}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {pins.map((pin) => (
          <Marker
            key={pin.id}
            position={pin.location}
            icon={newIcon}
            draggable={true}
            eventHandlers={{
              click: () => deletePin(pin),
              dragend: (e) =>
                movePin({
                  ...pin,
                  location: [e.target._latlng.lat, e.target._latlng.lng],
                }),
            }}
          ></Marker>
        ))}

        <MyComponent addPin={addPin} />
      </MapContainer>
    </>
  );
};