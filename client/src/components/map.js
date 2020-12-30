/*global google*/
import React, {useState, useEffect, useRef, useCallback} from 'react';
import { GoogleMap, Marker, useLoadScript, InfoWindow } from "@react-google-maps/api"
import { MarkerClusterer} from '@react-google-maps/api';
import {Modal, Card, CardContent, CardMedia, Dialog} from '@material-ui/core';
import axios from 'axios';
import ExploreIcon from '@material-ui/icons/Explore';
import '../css/map.css'


//Components
import SearchBox from './searchBox';
import Terms from './terms';
import MyInfoWindow from './infoWindow';
import AddForm from './addForm';
import LocationCard from './locationCard';
import AddMsg from './addMsg';

//Icons
import locationMarker from '../icons/locationMarker.svg';
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
    zoomControl: true,
    disableDoubleClickZoom: true
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
    const [isSelected, setIsSelected] = useState(false);
    const [infoWindow, setInfoWindow] = useState(false);
    const [addingMode, setAddingMode] = useState(false);
    const [toAdd, setToAdd] = useState(null);
    const [toAddAsArray, setToAddAsArray] = useState(null);
    const [addMsg, setAddMsg] = useState(false);
    const [addForm, setAddForm] = useState(false);
    const [storiesArray, setStoriesArray] = useState([]);

    //Geolocation
    const [isGeolocation, setGeolocation] = useState(false);
    const [geoLat, setGeoLat] = useState(null);
    const [geoLng, setGeoLng] = useState(null);

    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: libraries,
        language: 'he',
    });

    
    //Pan to the Location was given
    const panLocation = useCallback(({lat, lng}) => {
        setLatCenter(lat);
        setLngCenter(lng);
        mapRef.current.setZoom(14);
    },[])

    const iconType = (type) => {

    }

    if(loadError) return "ERROR Loading Maps";
    if(!isLoaded) return "Loading Maps";



    function handleLoad(map) {
        mapRef.current = map;

    }


    //Geolocation Function
    const locateMe = () => {
        navigator.geolocation.getCurrentPosition(
            (location) => {
                setGeoLat(location.coords.latitude);
                setGeoLng(location.coords.longitude);
                setGeolocation(true);
               panLocation({
                   lat: location.coords.latitude,
                   lng: location.coords.longitude
               }) 
            },
            () => null
        );
    }
    

    const addPlace = (event) => {
        const coordinates = event.latLng.toJSON();
        setToAdd(coordinates);
        setToAddAsArray([coordinates.lat,coordinates.lng])
        setLatCenter(coordinates.lat);
        setLngCenter(coordinates.lng);
        setAddingMode(true);
        setAddMsg(true);
    }
    
    //Center the Map every time it moves
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

    const fetchDetails = async (place) => {
        await axios.get(`/api/locations/fetchStories/${place._id}`)
        .then(res => {
            console.log(res.data);
            setStoriesArray(res.data);
            const stories = [place].concat(res.data);
            setStoriesArray(stories);
            console.log(storiesArray)
        })
        .catch(err => console.log(err));
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
                    <button className='pulse-button' onClick={() => setOpenSearch(true)}>חיפוש</button>
                    <button className='location-button' onClick={locateMe}><ExploreIcon style={{fontSize: '5vh'}}/></button>
                </div>
            <MarkerClusterer minimumClusterSize={2} gridSize={50}>{ clusterer => places.map(place => {
                   return <Marker clusterer={clusterer} key={place._id} position={{lat: place.location.coordinates[1], lng: place.location.coordinates[0]}} 
                   onClick={() => { setSelectedPlace(place); setIsSelected(true); fetchDetails(place);}}   
                                   onCloseClick={() => {setIsSelected(false); setSelectedPlace(null);}} />
                })}
            </MarkerClusterer>
                {isGeolocation && (<Marker position={{lat: geoLat, lng: geoLng}} title='המיקום שלך' icon={locationMarker}/>)}
                {selectedPlace && (<MyInfoWindow openInfoWindow={infoWindow} setInfoWindow={setInfoWindow} myPlace={selectedPlace} stories={storiesArray} setSelectedPlace={setSelectedPlace}/>)}
                {addMsg && (<Marker position={toAdd}></Marker>)}
                {addMsg && (<AddMsg addMsg={addMsg} setAddMsg={setAddMsg} setAddForm={setAddForm} />)}
                <AddForm addForm={addForm} setAddForm={setAddForm} setAddMsg={setAddMsg} coordinates={toAddAsArray}/>
                <Terms terms={props.terms} setTerms={props.setTerms}/>
                <SearchBox openSearchBox={openSearch} setOpenSearchBox={setOpenSearch} places={places} setPlaces={setPlaces} setGeoLocation={setGeolocation}
                 panLocation={panLocation} setGeoLat={setGeoLat} setGeoLng={setGeoLng}/>
                {selectedPlace && (<LocationCard open={isSelected} location={selectedPlace} setOpen={setIsSelected} setInfoWindow={setInfoWindow} setSelectedPlace={setSelectedPlace}/>)}
            </GoogleMap>
        )
}
export default Map