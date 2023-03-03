import React, { useState } from "react";
import LocationSearch from './LocationSearch'
import Script from "next/script"
import { useEffect } from "react";
import NameSearch from "./NameSearch";

const FilterToggle = ({ closePopup, onButtonClick, onChooseLat, onButtonNameClick }) => {
  const [coordinates, setCoordinates] = useState(null)
  const [address, setAddress] = useState(null)


  const handleClick = () => {
    onButtonClick(address)
    onChooseLat(coordinates)
  }

  const [searchedName, setSearchedName] = useState(null)

  const handleSecondClick = () => {
    onButtonNameClick(searchedName)
  }

  useEffect(() => {
    <Script
      src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyBE7TuDTklEU_1dYRFQnupMfHED2ykinVc&libraries=places`}
    />
  }, [])


    return (
      <div style={{zIndex: "9999", position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "white", padding: "20px" }}>
        <h1>Popup Window</h1>
        <p>This is an example of a popup window in Next.js.</p>
        {<LocationSearch setCoordinates={setCoordinates} setAddress={setAddress}/>}
        <button onClick={handleClick}>Search tools around this location</button>
        {<NameSearch setSearchedPostName={setSearchedName}/>}
        <button onClick={handleSecondClick}>Search tools by name</button>
        
        <button onClick={closePopup}> Close </button>
      </div>
    );
  };

export default FilterToggle