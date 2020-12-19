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
      paddingBottom: '1rem',
      minHeight: '70vh',
      borderRadius: '1rem'
    },
  };

function InfoWindow(props){
    const {openInfoWindow, setInfoWindow, myPlace, stories, classes} = props;

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
            <Button variant="contained" color='inherit' className='exitButton' onClick={() => setInfoWindow(false)}><SvgExitButton/></Button>
            <div className="dialogContainer">
                <DialogTitle style={{fontSize: '4vh'}}>{name}</DialogTitle>
                <DialogContent>
                <DialogContentText style={{direction: 'rtl', width: '60vw', flexWrap: 'wrap' , overflow: 'hidden', wordWrap: 'break-word',justifyContent: 'center', fontSize: '2.5vh'}}>
                    {description}
                </DialogContentText>
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
                <Button variant="contained" color='inherit' onClick={() => setAddStory(true)} className='addButton'><SvgAddButton/></Button>
            </div>
            <AddStoryForm addStory={addStory} setAddStory={setAddStory} location={myPlace}/>
        </Dialog>
    )
}
export default withStyles(styles)(InfoWindow);