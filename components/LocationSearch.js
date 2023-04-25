import { firestore, auth } from '../lib/firebase';
import {GoogleMap, useLoadScript, Marker} from '@react-google-maps/api'
import Script from "next/script"
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import {
	Combobox,
	ComboboxInput,
	ComboboxPopover,
	ComboboxList,
	ComboboxOption,
	ComboboxOptionText,
} from "@reach/combobox";
import "@reach/combobox/styles.css"

import usePlacesAutocomplete, {
  getGeocode, 
  getLatLng
} from 'use-places-autocomplete'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useState } from 'react';


/* export default function LocationSearch({setAddress, setCoordinates }) {

 

  
  /* useEffect(() => {
    const script = document.createElement('script');

    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDrK58HiFH7Pv93wft_BVny-XqtwuO5u1s&libraries=places';
    script.async = true;

    document.body.appendChild(script);

    

    

    return () => {
        document.body.removeChild(script);
        
    };
}, []); // router prop or w/e */

  /* const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDrK58HiFH7Pv93wft_BVny-XqtwuO5u1s",
    libraries: ['places']
  })

  console.log(isLoaded)

    
    
    const {
      ready, 
      value, //what users typed in the input box
      setValue, 
      suggestions: {status, data}, 
      clearSuggestions, //its a function that we call when the user has chosen a specific suggestion
    } = usePlacesAutocomplete()
  
    if (!isLoaded) return <div>Loading...</div>
    
  
    const handleSelect = async (address) => { //address is chosen address by the user
      setValue(address, false); //we change the value of value variable (so far its just what user has typed) to the selected suggestion address
      clearSuggestions();
  
      const results = await getGeocode({address})
      
      
      
      const {lat, lng} = await getLatLng(results[0])
      setAddress(address)
      
      setCoordinates({lat, lng}) //setSelected is from the Map component and it is center of the ma
    }
  
    return (
      <>
      <div className='searchbarfilter'>
      {//isLoaded && 
    <Combobox onSelect={handleSelect}>
      <ComboboxInput value={value} onChange={(e)=> setValue(e.target.value)} disabled={!ready} 
      className = 'combobox-input' placeholder='search your address'/>
      <ComboboxPopover>
        <ComboboxList>
          {status === 'OK' && data.map(({place_id, description}) => <ComboboxOption key={place_id} value={description} />)}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  }
  </div>
    </>)
  } 
   */

  export default function Places({setAddress, setCoordinates}) {
    const { isLoaded } = useLoadScript({
      googleMapsApiKey: "AIzaSyDrK58HiFH7Pv93wft_BVny-XqtwuO5u1s",
      libraries: ['places']
    })

    

    if (!isLoaded) return <div>Loading...</div>
    return <PlacesAutoComplete setAddress={setAddress} setCoordinates={setCoordinates}/>
  }

  /* function Map({setCoordinates, setAddress}) {
    const [coordinates, setCoordinates] = useState(null)
    const [address, setAddress] = useState(null)

    return (
      <>
      <div>
        <PlacesAutoComplete setCoordinates={setCoordinates} setAddress={setAddress} />
      </div>
      </>
    )
  }
 */
  function PlacesAutoComplete({setCoordinates, setAddress}) {
    const {
      ready,
      value,
      setValue,
      suggestions: { status, data },
      clearSuggestions,
    } = usePlacesAutocomplete();

    
  
    const handleSelect = async (address) => {
      


      setValue(address, false); //we change the value of value variable (so far its just what user has typed) to the selected suggestion address
      clearSuggestions();
  
      const results = await getGeocode({address})
      
      
      
      const {lat, lng} = await getLatLng(results[0])
      setAddress(address)
      
      setCoordinates({lat, lng}) //setSelected is from the Map component and it is center of the ma
    };
  
    return (
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          className="combobox-input"
          placeholder="Search an address"
          style={{padding: '5px', width: '100%', borderRadius: '5px', border: '1px solid #ccc'}}
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption key={place_id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    );
  };
  
  