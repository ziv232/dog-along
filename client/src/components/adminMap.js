import React, {useState, useEffect, useRef, useContext} from 'react';
import { GoogleMap, Marker, useLoadScript, InfoWindow } from "@react-google-maps/api"
import { MarkerClusterer } from '@react-google-maps/api';
import { Fab } from '@material-ui/core';
import UserContext from '../context/userContext';
import axios from 'axios';

import '../css/adminMap.css';

//Components
import RequestInfoWindow from '../components/requestInfoWindow';

const mapConStyle = {
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    top: 0,
    left: 0
}
const options = {
    disableDefaultUI: true,
    zoomControl: true,
    disableDoubleClickZoom: true,
}

const libraries = []

function AdminMap(props){


    const mapRef = useRef(null);
    const {userData,setUserData} = useContext(UserContext);
    const [latCenter, setLatCenter] = useState(32.066287);
    const [lngCenter, setLngCenter] = useState(34.777364);
    const [requests, setRequests] = useState([]);
    const [markers, setMarkers] = useState('');
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [infoWindow, setInfoWindow] = useState(false);





    const {isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: libraries,
        language: 'he',
    });

    useEffect(() => {
        try{
        if(userData.user != undefined){    
            axios.get('/api/requests/', {headers: {'x-auth-token': userData.token}}).then(res => {
                setRequests(res.data);
            })
            .catch(err => console.log(err))
        }
        } catch(err) {
            console.log(err);
        }
    },[requests])

    if(loadError) return "ERROR Loading Maps";
    if(!isLoaded) return "Loading Maps";

    function handleLoad(map) {
        mapRef.current = map;
    }

    const handleCenterChanged = () => {
        if (!mapRef.current) return;
        const newPos = mapRef.current.getCenter().toJSON();
        setLatCenter(newPos.lat);
        setLngCenter(newPos.lng);
    }

    const logOut = () => {
        const username = userData.user.username
        axios.post('/api/users/logout', {username}, {headers: {'x-auth-token': userData.token}})
        .then(res => {
            localStorage.setItem('auth-token', '');
            setUserData({
                token: undefined,
                user: undefined
              })
        }).catch(err => console.log(err))
    }

    return(
        <GoogleMap
            id="map"
            mapContainerStyle={mapConStyle}
            options={options}
            zoom={10}
            center={{ lat: latCenter, lng: lngCenter }}
            onLoad={handleLoad}
            onCenterChanged={handleCenterChanged}>
            <div className='admin-buttons-container'>
                <button className='logoutButton' onClick={logOut}>התנתק</button>
            </div>
            <MarkerClusterer minimumClusterSize={2} gridSize={50}>{ clusterer => requests.map(request => {
                   return <Marker clusterer={clusterer} key={request._id} position={{lat: request.location.coordinates[1], lng: request.location.coordinates[0]}} 
                   onClick={() => setSelectedPlace(request)} />
                })}
            </MarkerClusterer>
            {selectedPlace && (<InfoWindow position={{lat: selectedPlace.location.coordinates[1], lng: selectedPlace.location.coordinates[0]}} 
                onCloseClick={() => {setSelectedPlace(null)}}>
                    <div className='info-window'>
                        {selectedPlace.name}
                        <button className='details-button' onClick={() => setInfoWindow(true)}>הצג בקשה</button>
                    </div>
                </InfoWindow>)}


            {selectedPlace && (<RequestInfoWindow openInfoWindow={infoWindow} setInfoWindow={setInfoWindow} myPlace={selectedPlace}
             setSelectedPlace={setSelectedPlace}/>)}

            </GoogleMap>
    )

}
export default AdminMap;