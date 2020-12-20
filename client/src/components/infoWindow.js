import React, {useState, useEffect} from 'react';
import {Dialog, DialogTitle, Grid, DialogContent, Button, DialogContentText } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import SvgExitButton from './svgExitButton';
import SvgAddButton from './svgAddButton';
import '../css/infoWindow.css';
import "react-image-gallery/styles/css/image-gallery.css";
import Slider from 'react-image-gallery';
import 'react-awesome-slider/dist/styles.css';

//Components
import AddStoryForm from './addStoryForm';

const styles = {
    dialogPaper: {
    background: 'radial-gradient(#e7e7e4,#dcddd4)',
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
    const [description, setDescription] = useState(myPlace.description);
    const [photos, setPhotos] = useState(myPlace.photos.urls.map( image => {return {original: image, thumbnail: image}}));

    const updateFields = (idx) => {
        setPhotos(stories[idx].photos.urls.map( image => {return {original: image, thumbnail: image}}))
        setDescription(stories[idx].description)
        setName(stories[idx].name);

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

    return(
        <Dialog classes={{ paper: classes.dialogPaper }} open={openInfoWindow} fullWidth={true} maxWidth={'md'}>
            <Button variant="contained" color='inherit' className='exitButton' onClick={() => {setInfoWindow(false); setSelectedPlace(null)}}><SvgExitButton/></Button>
            <div className="dialogContainer">
                <DialogTitle style={{fontSize: '4vh'}}>{name}</DialogTitle>
                <DialogContent style={{direction: 'rtl',justifyItems: 'center', width: '80%', overflow: 'hidden', wordWrap: 'break-word', fontSize: '2.5vh'}}>
                    {description}
                </DialogContent>
                <Slider items={photos} showThumbnails={false} showPlayButton={false} showBullets={true} showIndex={true}/>
                <div className='indexs'>
                    {`${index + 1}/${stories.length}`}
                </div>
                <Grid container style={{marginBottom: '3vh'}} spacing={2} direction='row' alignContent='center' justify='center'>
                    <Grid item>
                        <Button type='button' variant="contained" color='primary' onClick={() => previousIndex()}>הקודם</Button>
                    </Grid>
                    <Grid item>
                        <Button type='button' variant="contained" color='primary' onClick={() => nextIndex()} >הבא</Button>
                    </Grid>
                </Grid>
                <Button style={{marginBottom: '2vh'}} variant="contained" color='inherit' onClick={() => setAddStory(true)} className='addButton'><SvgAddButton/></Button>
            </div>
            <AddStoryForm addStory={addStory} setAddStory={setAddStory} location={myPlace}/>
        </Dialog>
    )
}
export default withStyles(styles)(InfoWindow);