import React from 'react';
import { Collapse, Dialog, DialogContent, Grow} from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import { formatRelative, parseISO } from 'date-fns'
import { he } from 'date-fns/locale'
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
        <Dialog classes={{ paper: classes.dialogPaper }} TransitionComponent={Grow} open={open} onBackdropClick={() => setOpen(false)} >
            <img style={{maxHeight: '50vh', maxWidth: '70vw'}} src={location.photos.urls[0]}></img>
            <div style={{textAlign: 'center', direction: 'rtl', fontSize: '3vh', marginTop: '4vh', marginBottom: '1vh'}}>
                    {location.name}
            </div>
            <div style={{textAlign: 'center', direction: 'rtl', fontSize: '1.8vh', color: 'grey' , marginTop: '1vh'}}>
               נוסף על ידי {location.donor}
            </div>
            <div style={{textAlign: 'center', direction: 'rtl', fontSize: '1.8vh', color: 'grey' , marginTop: '1vh', marginBottom: '4vh'}}>
               {formatRelative(parseISO(location.date), new Date(), { locale: he })} 
            </div>
            <div className='buttons-container'>
            <button className='card-buttons' onClick={() => {setOpen(false); setSelectedPlace(null);}}>סגור</button>
            <button className='card-buttons' onClick={() => setInfoWindow(true)}>פרטים נוספים</button>
            </div>
        </Dialog>
    )
}
export default withStyles(styles)(LocationCard);