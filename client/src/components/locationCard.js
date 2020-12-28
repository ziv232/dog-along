import React, {useState, useEffect} from 'react';
import { Dialog, DialogContent, Modal, Card, CardContent, CardMedia } from '@material-ui/core';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import '../css/locationCard.css';


const styles = {
    card: {
    },
    media: {
        maxHeight: '50vh'
    },
    dialogPaper: {
        background: '#FFFFFF',
          color: 'black',
          borderRadius: '0.5rem',
          maxWidth: '70vw'

    
        },
  };
  

function LocationCard(props){

    const {open, location, setOpen, setInfoWindow, setSelectedPlace, classes} = props

    return(
        <Dialog classes={{ paper: classes.dialogPaper }} open={open} onBackdropClick={() => setOpen(false)} >
            <img style={{maxHeight: '50vh', maxWidth: '70vw'}} src={location.photos.urls[0]}></img>
            <DialogContent>
            <div style={{textAlign: 'center', direction: 'rtl', fontSize: '3vh', marginTop: '4vh', marginBottom: '4vh' , fontFamily: 'Roboto'}}>
                    {location.name}
            </div>
            <div className='buttons-container'>
            <button className='card-buttons' onClick={() => {setOpen(false); setSelectedPlace(null);}}>סגור</button>
            <button className='card-buttons' onClick={() => setInfoWindow(true)}>פרטים נוספים</button>
            </div>
            </DialogContent>
        </Dialog>
    )
}
export default withStyles(styles)(LocationCard);