import React, {useState, useEffect, useContext} from 'react';
import {Dialog, DialogTitle, Grid, Button, DialogContent } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import UserContext from '../context/userContext';
import SvgExitButton from './svgExitButton';
import '../css/requestInfoWindow.css';

import "react-image-gallery/styles/css/image-gallery.css";
import Slider from 'react-image-gallery';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import axios from 'axios';


const styles = {
    dialogPaper: {
    background: 'radial-gradient(#e7e7e4,#dcddd4)',
      color: 'black',
      paddingBottom: '1rem',
      minHeight: '70vh',
      borderRadius: '1rem'
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


    return(
        <Dialog classes={{ paper: classes.dialogPaper }} open={openInfoWindow} fullWidth={true} maxWidth={'md'}>
        <button className='exitButton' onClick={() => setInfoWindow(false)}><SvgExitButton/></button>
        <div className="dialogContainer">
            <DialogTitle>{myPlace.name}</DialogTitle>
            <DialogContent>
                <div className='description'>
                {myPlace.description}
                </div>
            </DialogContent>
            <Slider items={myPlace.photos.urls.map(image => {return {original: image, thumbnail: image}})} showThumbnails={false}/>
            <Grid container style={{marginTop: '5vh'}} spacing={2} direction='row' alignContent='center' justify='center'>
                    <Grid item>
                        <Button type='button' variant="contained" color='primary' onClick={() => rejectRequest()}>דחה</Button>
                    </Grid>
                    <Grid item>
                        <Button type='button' variant="contained" color='primary' onClick={() => acceptRequest()} >אשר</Button>
                    </Grid>
            </Grid>
        </div>
    </Dialog>
    )


}
export default withStyles(styles)(RequestInfoWindow);