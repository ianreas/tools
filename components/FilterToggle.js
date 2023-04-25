import React, { useState } from "react";
import LocationSearch from './LocationSearch'
import Script from "next/script"
import { useEffect } from "react";
import NameSearch from "./NameSearch";

const FilterToggle = ({ closePopup, onButtonClick, onChooseLat, onButtonNameClick, onFilterChange, }) => {
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

  //style={{zIndex: "9990", position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "white", padding: "60px", borderColor: "#FFFFFFF"}}


    /* const [filter1, setFilter1] = useState

    const [isChecked1, setIsChecked1] = useState(true)
    const [isChecked2, setIsChecked2] = useState(true)
    const [isChecked3, setIsChecked3] = useState(true) */

    /* const handleFilterChange1 = (event) => { //when a checkbox is clicked
      /* const name = e.target.name   //e.target.name is the name of the checkbox
      const value = e.target.checked //e.target.checked is the value of the checkbox

      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value
      }))

      onFilterChange(filters) 

      if (event.target.checked){
        setFilters([...filters, event.target.value])

      }else {
        setFilters(filters.filter((filter) => filter !== event.target.value)) 
      }
      console.log('changed')
      setIsChecked1(event.target.checked)
      
      onFilterChange(filters)
      console.log(filters)
    } */

    const [selectedOption, setSelectedOption] = useState("")

    /* function handleOptionChange(event) {
      setSelectedOption(event.target.value)
      console.log(selectedOption + 'selected option')
      onFilterChange(selectedOption)
    } */
    

    

    //useEffect(() => {
    
    
    //}, [filters])

    return (
      <div className='popupwindow'>
        <h2 style={{color: "white"}}>Filter Tools</h2>
        
        {<LocationSearch setCoordinates={setCoordinates} setAddress={setAddress} className='seachbars'/>}
        <button onClick={handleClick} >Search tools around this location</button>
        {<NameSearch setSearchedPostName={setSearchedName} />}
        
        <button onClick={handleSecondClick}>Search tools by name</button>
        
        {/* <button onClick={closePopup} style={{}}> Close </button> */}
        {/* <div className="buysellfilter" >
          <label for='options'>Select If you want to buy, sell or exchange.</label>
          <select id='options' name='options' value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
            <option value=''>--Please Choose an Option--</option>
            <option value='buying'>Buy</option>
            <option value='selling'>Sell</option>
            <option value='exchanging'>Exchange</option>
          </select>
          {/* <button onClick={handleSelectOption}>Select Option</button> }
        </div> */}
      </div>
    );
  };

export default FilterToggle