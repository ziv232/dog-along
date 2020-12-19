import React, {useState, useEffect, useRef} from 'react';
import { GoogleMap, Marker, useLoadScript, InfoWindow } from "@react-google-maps/api"
import { MarkerClusterer } from '@react-google-maps/api';

import axios from 'axios';
import SearchIcon from '@material-ui/icons/Search';
import '../css/map.css'


//Components
import SearchBox from './searchBox';
import Terms from './terms';
import MyInfoWindow from './infoWindow';
import AddForm from './addForm';

//Icons
import amuta from '../icons/pet-shelter.png';

require('dotenv').config();

const mapConStyle = {
    width: '100vw',
    height: '100vh',
    padding: 0,
    margin: 0,
    position: 'absolute',
    top: 0,
    left: 0
}
const options = {
    disableDefaultUI: true,
    zoomControl: false
}

const libraries = []

function Map(props){
    const mapRef = useRef(null);
    const [openSearch, setOpenSearch] = useState(false);
    const [latCenter, setLatCenter] = useState(32.066287);
    const [lngCenter, setLngCenter] = useState(34.777364);
    const [places, setPlaces] = useState([]);
    const [markers, setMarkers] = useState('');
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [infoWindow, setInfoWindow] = useState(false);
    const [addingMode, setAddingMode] = useState(false);
    const [toAdd, setToAdd] = useState(null);
    const [toAddAsArray, setToAddAsArray] = useState(null);
    const [addMsg, setAddMsg] = useState(false);
    const [addForm, setAddForm] = useState(false);
    const [storiesArray, setStoriesArray] = useState([]);

    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: libraries,
        language: 'he',
    });

    const iconType = (type) => {

    }

    if(loadError) return "ERROR Loading Maps";
    if(!isLoaded) return "Loading Maps";

    function handleLoad(map) {
        mapRef.current = map;

    }

    const addPlace = (event) => {
        const coordinates = event.latLng.toJSON();
        setToAdd(coordinates);
        setToAddAsArray([coordinates.lat,coordinates.lng])
        setAddingMode(true);
        setAddMsg(true);
        // setLatCenter(coordinates.lat);
        // setLngCenter(coordinates.lng);
    }
    
    const handleCenterChanged = () => {
        if (!mapRef.current) return;
        const newPos = mapRef.current.getCenter().toJSON();
        setLatCenter(newPos.lat);
        setLngCenter(newPos.lng);
    }

// Fetch All the Stories of the Location
    const fetchStories = async () => {
        await axios.get(`/api/locations/fetchStories/${selectedPlace._id}`)
        .then(res => {
            console.log(res.data);
            setStoriesArray(res.data);
            const stories = [selectedPlace].concat(res.data);
            setStoriesArray(stories);
            console.log(storiesArray)
        })
        .catch(err => console.log(err));
        setInfoWindow(true);
    }


    return(
            <GoogleMap
            id="map"
            mapContainerStyle={mapConStyle}
            options={options}
            zoom={10}
            yesIWantToUseGoogleMapApiInternals
            center={{ lat: latCenter, lng: lngCenter }}
            onLoad={handleLoad}
            onCenterChanged={handleCenterChanged}
            onRightClick={addPlace} onDblClick={addPlace} onClick={() => setAddingMode(false)} clickableIcons={false}>
                <div className="search-button-container">
                    <button className='search-button' onClick={() => setOpenSearch(true)}>
                        <SearchIcon fontSize='inherit' className='search-icon'></SearchIcon> חיפוש
                    </button>
                </div>
            <MarkerClusterer minimumClusterSize={2} gridSize={50}>{ clusterer => places.map(place => {
                   return <Marker clusterer={clusterer} key={place._id} position={{lat: place.coordinates[0], lng: place.coordinates[1]}} 
                   onClick={() => {
                       setSelectedPlace(place);
                       }} />
                })}
            </MarkerClusterer>
                {selectedPlace && (<InfoWindow position={{lat: selectedPlace.coordinates[0], lng: selectedPlace.coordinates[1]}} 
                onCloseClick={() => {setSelectedPlace(null)}}>
                    <div className='info-window'>
                        {selectedPlace.name}
                        <button className='details-button' onClick={() => fetchStories()}>פרטים נוספים</button>
                    </div>
                </InfoWindow>)}
                {selectedPlace && (<MyInfoWindow openInfoWindow={infoWindow} setInfoWindow={setInfoWindow} myPlace={selectedPlace} stories={storiesArray}/>)}
                {addMsg && (<Marker position={toAdd}><InfoWindow zIndex={100} onCloseClick={() => {setAddingMode(false);
                                                                                    setAddMsg(false);}} position={toAdd}>
                    <div className='addInfoWindow'>
                        האם אתה בטוח שברצונך להוסיף מקום זה?
                        <div className='buttons-container'>
                        <button className='add-buttons' onClick={() => setAddForm(true)}>כן</button>
                        <button className='add-buttons' onClick={() => {
                            setAddingMode(false);
                            setAddMsg(false);
                        }}>לא</button>
                        </div>
                    </div>
                </InfoWindow></Marker>)}
                <AddForm addForm={addForm} setAddForm={setAddForm} setAddMsg={setAddMsg} coordinates={toAddAsArray}/>
                <Terms terms={props.terms} setTerms={props.setTerms}/>
                <SearchBox openSearchBox={openSearch} setOpenSearchBox={setOpenSearch} places={places} setPlaces={setPlaces}>
                </SearchBox>
            </GoogleMap>
        )
}
export default Map