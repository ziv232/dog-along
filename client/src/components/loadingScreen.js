import React, {useState} from 'react';
import { Dialog } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import '../css/loadingScreen.css';


const styles = {
    dialogPaper: {
    backgroundColor: 'transparent',
    boxShadow: 'none'
    }
  };

function LoadingScreen(props){
    const {openLoadingScreen, classes} = props;

    return(
        <Dialog classes={{ paper: classes.dialogPaper }} hideBackdrop={true} open={openLoadingScreen} maxWidth={'sm'}>
            <div id="dots">
                <div id="dot1" class="dot"></div>
                <div id="dot2" class="dot"></div>
                <div id="dot3" class="dot"></div>
                <div id="dot4" class="dot"></div>
                <div id="dot5" class="dot5"></div>
            </div>
            <div style={{fontSize: '3vh', textAlign: 'center', fontWeight: 'bold'}}>טוען מקום</div>
        </Dialog>
    )
}
export default withStyles(styles)(LoadingScreen);