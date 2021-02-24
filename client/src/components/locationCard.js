import React, {useState} from 'react';
import { Collapse, Dialog, DialogContent, Grow} from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import { formatRelative, parseISO } from 'date-fns'
import { he } from 'date-fns/locale'
import "react-image-gallery/styles/css/image-gallery.css";
import Slider from 'react-image-gallery';
import '../css/locationCard.css';


const styles = {
    card: {
    },
    media: {
        maxHeight: '50vh'
    },
    dialogPaper: {
        background: 'radial-gradient(#eeeeec,#eff0ea)',
        color: 'black',
        borderRadius: '0.5rem',
        maxHeight: '90vh',
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
  

function LocationCard(props){

    const {open, location, setOpen, setInfoWindow, setSelectedPlace, storiesArray, classes} = props
    const [photos, setPhotos] = useState(location.photos.urls.map( image => {return {original: image, thumbnail: image}}));

    return(
        <Dialog classes={{ paper: classes.dialogPaper }} fullWidth={true} maxWidth={'sm'} TransitionComponent={Grow} open={open} onBackdropClick={() => setOpen(false)} >
        <Slider items={photos} autoPlay={true} slideInterval={5000} showThumbnails={false} showPlayButton={false} showBullets={false} showIndex={false} showFullscreenButton={false} showNav={false}/>
            <div style={{textAlign: 'center', direction: 'rtl', fontSize: '3vh', marginTop: '4vh', marginBottom: '1vh'}}>
                    {location.name}
            </div>
            <div style={{textAlign: 'center', direction: 'rtl', fontSize: '2.2vh',fontWeight: 'bold', color: 'grey' , marginTop: '1vh'}}>
               מקום זה מכיל {storiesArray.length} סיפורים
            </div>
            <div style={{textAlign: 'center', direction: 'rtl', fontSize: '2vh', fontWeight: 'bold', color: 'grey' , marginTop: '2vh'}}>
               הסיפור העדכני ביותר:
            </div>          
            <div style={{textAlign: 'center', direction: 'rtl', fontSize: '1.8vh', color: 'grey' , marginTop: '0.5vh'}}>
               נוסף על ידי {location.donor}
            </div>
            <div style={{textAlign: 'center', direction: 'rtl', fontSize: '1.8vh', color: 'grey' , marginTop: '0.5vh', marginBottom: '4vh'}}>
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