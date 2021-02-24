import React, {useState, useEffect, useContext} from 'react';
import {Dialog, DialogTitle, Grid, Button, DialogContent } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import UserContext from '../context/userContext';
import '../css/requestInfoWindow.css';
import "react-image-gallery/styles/css/image-gallery.css";
import Slider from 'react-image-gallery';
import 'react-awesome-slider/dist/styles.css';
import { formatRelative, parseISO } from 'date-fns'
import { he } from 'date-fns/locale'
import axios from 'axios';


//Icons
import InstagramIcon from './svgInstagram';


const styles = {
    dialogPaper: {
    background: 'radial-gradient(#e7e7e4,#dcddd4)',
      color: 'black',
      paddingBottom: '2vh',
      minHeight: '70vh',
      borderRadius: '0.5rem',
      overflowX: 'hidden',
      '&::-webkit-scrollbar': {
        width: '0.4em',
      },
      '&::-webkit-scrollbar-track': {
        boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
        webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'darkgrey',
        outline: '1px solid slategrey',
        borderRadius: '1rem',
        border: 'none',
        outline: 'none'
      }
    },
  };

function RequestInfoWindow(props){
    const {openInfoWindow, setInfoWindow, myPlace, setSelectedPlace, classes} = props;

    const {userData} = useContext(UserContext);

    const acceptRequest = () => {
        const location = {
            location: {type: 'Point', coordinates: myPlace.location.coordinates},
            name: myPlace.name,
            category: myPlace.category,
            district: myPlace.district,
            description: myPlace.description,
            photos: {
               urls: myPlace.photos.urls,
               publicIds: myPlace.photos.publicIds
            },
            donor: myPlace.donor,
            donorInstagram: myPlace.donorInstagram,
            comments: myPlace.comments,
            reference: myPlace.reference
        }
        axios.post('/api/locations/add', location, {headers: {'x-auth-token': userData.token}}).then(
            res => {
                return axios.delete(`/api/requests/${myPlace._id}`, {headers: {'x-auth-token': userData.token}}).then(
                    res => {
                        setInfoWindow(false);
                        setSelectedPlace(null);
                    }
                ).catch(err => console.log(err));
            }
        ).catch(err => console.log(err));

    }

    const rejectRequest = async () => {
        try{
           axios.post('/api/uploads/delete', myPlace.photos.publicIds, {headers: {'x-auth-token': userData.token}}).then(
            axios.delete(`/api/requests/${myPlace._id}`, {headers: {'x-auth-token': userData.token}}).then(res => {
                setInfoWindow(false);
                setSelectedPlace(null);
            })
        .catch(err => console.log(err))
        )
        } catch(err) {
            
        }
    }

    const openInstagramUser = (donorInsta) => {
        window.open(`http://instagram.com/${donorInsta}`);
    }


    return(
        <Dialog classes={{ paper: classes.dialogPaper }} open={openInfoWindow} fullWidth={true} maxWidth={'md'}>
        <button className='exit-button' onClick={() => {setInfoWindow(false); setSelectedPlace(null)}}>+</button>
        <div className="dialogContainer">
                <div style={{fontSize: '4vh', direction: 'rtl', textAlign: 'center', marginTop: '2vh'}}>{myPlace.name}</div>
                <div style={{direction: 'rtl', fontSize: '2vh', marginTop: '2vh', color: 'grey'}}>
                    נוסף על ידי {myPlace.donor}
                </div>
                {(myPlace.donorInstagram == undefined || myPlace.donorInstagram == '') ? ''
                    :   
                        <div style={{direction: 'ltr', display: 'flex', justifyContent: 'space-around', fontSize: '2.3vh', marginTop: '2vh', marginBottom: '2vh', color: 'blue', cursor: 'pointer'}}
                        onClick={() => openInstagramUser(myPlace.donorInstagram)}>
                            <InstagramIcon/><div style={{width: '1vh'}}></div><div>{myPlace.donorInstagram}</div>
                        </div>}
                <div style={{direction: 'rtl', fontSize: '2vh', color: 'grey'}}>
                {formatRelative(parseISO(myPlace.date), new Date(), { locale: he })}
                </div>
            <DialogContent>
                <div className='description'>
                {myPlace.description}
                </div>
            </DialogContent>
            <Slider items={myPlace.photos.urls.map(image => {return {original: image, thumbnail: image}})} showThumbnails={false} showPlayButton={false}/>
            <div className='buttons-container'>
            <button className='buttons' onClick={() => rejectRequest()}>דחה</button>
            <button className='buttons' onClick={() => acceptRequest()} >אשר</button>
            </div>

        </div>
    </Dialog>
    )


}
export default withStyles(styles)(RequestInfoWindow);