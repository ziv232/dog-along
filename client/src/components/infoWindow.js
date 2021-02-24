import React, {useState, useEffect} from 'react';
import {Dialog, DialogTitle, Grid, DialogContent, Button, DialogContentText } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import { formatRelative, parseISO } from 'date-fns'
import { he } from 'date-fns/locale'
import '../css/infoWindow.css';
import "react-image-gallery/styles/css/image-gallery.css";
import Slider from 'react-image-gallery';
import 'react-awesome-slider/dist/styles.css';

//Components
import AddStoryForm from './addStoryForm';

//Icons
import InstagramIcon from './svgInstagram';

const styles = {
    dialogPaper: {
    background: 'radial-gradient(#eeeeec,#eff0ea)',
      color: 'black',
      minHeight: '70vh',
      marginBottom: '5vh',
      borderRadius: '0.5rem',
      borderStyle: 'solid',
      borderColor: 'black',
      border: 'thin',
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

function InfoWindow(props){
    const {openInfoWindow, setInfoWindow, myPlace, stories, setSelectedPlace, classes} = props;

    //Add Another Story States
    const [addStory, setAddStory] = useState(false);

    //Stories States
    const [index, setIndex] = useState(0);
    const [name, setName] = useState(myPlace.name);
    const [date, setDate] = useState(myPlace.date);
    const [donor, setDonor] = useState(myPlace.donor);
    const [donorInsta, setDonorInsta] = useState(myPlace.donorInstagram);
    const [description, setDescription] = useState(myPlace.description);
    const [photos, setPhotos] = useState(myPlace.photos.urls.map( image => {return {original: image, thumbnail: image}}));

    const updateFields = (idx) => {
        setPhotos(stories[idx].photos.urls.map( image => {return {original: image, thumbnail: image}}))
        setDescription(stories[idx].description)
        setName(stories[idx].name);
        setDate(stories[idx].date);
        setDonor(stories[idx].donor);
        setDonorInsta(stories[idx].donorInstagram);

    }

    const nextIndex = () => {
        if(index + 1 == stories.length){
            return
        }
        else{
            setIndex(index + 1);
            updateFields(index + 1);
        }
    } 
    const previousIndex = () => {
        if(index == 0){
            return
        }
        else{
            setIndex(index - 1);
            updateFields(index - 1);
        }
    }

    const openInGoogleMaps = () => {
        window.open(`https://maps.google.com?q=${myPlace.location.coordinates[1]},${myPlace.location.coordinates[0]}`);
    }

    const openInstagramUser = () => {
        window.open(`http://instagram.com/${donorInsta}`);
    }

    return(
        <Dialog classes={{ paper: classes.dialogPaper }} open={openInfoWindow} fullWidth={true} maxWidth={'md'}>
            <button className='exit-button' onClick={() => {setInfoWindow(false); setSelectedPlace(null)}}>+</button>
            <div className="dialogContainer">
                <div style={{fontSize: '4vh', direction: 'rtl', textAlign: 'center', marginTop: '2vh'}}>{name}</div>
                <div style={{direction: 'rtl', fontSize: '2.3vh', marginTop: '2vh', color: 'grey'}}>
                    נוסף על ידי {donor}<br/>{formatRelative(parseISO(date), new Date(), { locale: he })}
                </div>
                {(donorInsta == undefined || donorInsta == '') ? ''
                    :   
                        <div style={{direction: 'ltr', display: 'flex', justifyContent: 'space-around', fontSize: '2.3vh', marginTop: '2vh', marginBottom: '2vh', color: 'blue', cursor: 'pointer'}}
                        onClick={() => openInstagramUser()}>
                            <InstagramIcon/><div style={{width: '1vh'}}></div> <div>{donorInsta}</div>
                        </div>}
                {/* <div style={{direction: 'rtl', fontSize: '2vh', color: 'grey'}}>
                {formatRelative(parseISO(date), new Date(), { locale: he })}
                </div> */}
                <DialogContent style={{direction: 'rtl',justifyItems: 'center', width: '80%', overflow: 'hidden', wordWrap: 'break-word', fontSize: '2.5vh'}}>
                    {description}
                </DialogContent>
                <Slider items={photos} showThumbnails={false} showPlayButton={false} showBullets={true} showIndex={true}/>
                <div className='indexs'>
                    {`${index + 1}/${stories.length}`}
                </div>
                <div class="pagination">
                    <ul>
                        <a onClick={() => previousIndex()}><li>לסיפור הקודם</li></a>
                        <a onClick={() => nextIndex()}><li>לסיפור הבא</li></a>
                    </ul>
                 </div>
                 <button className='addButton' onClick={() => openInGoogleMaps()}>פתיחה בגוגל מפות</button>
                <button className='addButton' onClick={() => setAddStory(true)}>הוספת הסיפור שלך</button>
                <div style={{fontSize: '1.8vh'}}>Icons made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
            </div>
            <AddStoryForm addStory={addStory} setAddStory={setAddStory} location={myPlace}/>
        </Dialog>
    )
}

export default withStyles(styles)(InfoWindow);