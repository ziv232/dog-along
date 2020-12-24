import React, {useState, useEffect} from 'react';
import axios from 'axios';
import FormData from 'form-data';
import ReCAPTCHA from "react-google-recaptcha";
import {Grid, Dialog, Button, DialogTitle, DialogContent,Form, FormControl, TextField, Select, InputLabel, Input, ListItemText, MenuItem, CircularProgress} from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import '../css/addForm.css';

//Components
import AddStoryForm from './addStoryForm';

const styles = {
    dialogPaper: {
    background: 'radial-gradient(#e7e7e4,#dcddd4)',
      color: 'black',
      paddingBottom: '1rem',
      minHeight: '80vh',
      borderRadius: '1rem',
    },
    dialogLabel: {
        color: 'black',
        fontSize: '1.3rem'
    },
    input: {
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',            
        paddingBottom: 0,
        marginTop: 0,
        fontWeight: 500
    }
  };

  const districtOptions = ['צפון','מרכז','דרום'];
  const categoryOptions = ['גינות כלבים','חופים','מסלולי טיולים','עמותות','מקורות מים']


function AddForm(props){

    const {addForm, setAddForm, setAddMsg, coordinates, classes} = props;

//Fields States
    const [name, setName] = useState('');
    const [district, setDistrict] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [photos, setPhotos] = useState([]);
    const [donor, setDonor] = useState('');
    const [recaptcha, setRecaptcha] = useState(false);

//Error Handling States
    const [fieldsError, setFieldsError] = useState('');
    const [nameErrorMsg, setNameErrorMsg] = useState('');
    const [donorErrorMsg, setDonorErrorMsg] = useState('');
    const [districtErrorMsg, setDistrictErrorMsg] = useState('');
    const [categoryErrorMsg, setCategoryErrorMsg] = useState('');
    const [descriptionErrorMsg, setDescriptionErrorMsg] = useState('');
    const [photosErrorMsgNone, setPhotosErrorMsgNone] = useState('');
    const [photosErrorMsgBigger, setPhotosErrorMsgBigger] = useState('');
    const [recaptchaErrorMsg, setRecaptchaErrorMsg] = useState('');

//Submting Form States
    const [progressScreen, setProgressScreen] = useState(false);
    const [finishProgress, setFinishProgress] = useState(false);
    const [errorProgress, setErrorProgress] = useState(false);


//Fields Handlers
    const handleName = (event) => {
        setName(event.target.value);
    }

    const handleDistrict = (event) => {
        setDistrict(event.target.value);
    }

    const handleCategory = (event) => {
        setCategory(event.target.value);
    }

    const handleDescription = (event) => {
        setDescription(event.target.value);
    }

    const handlePhotos = (event) => {
        setPhotos(event.target.files);
    }

    const handleDonor = (event) => {
        setDonor(event.target.value);
    }

    const sendRequest = (urls, publicIds) => {
        const data = {
            coordinates: coordinates,
            name: name,
            category: category,
            district: district,
            description: description,
            photos: {urls: urls,
                publicIds: publicIds},
            donor: donor,
            comments: [],
            reference: null
        }
        axios.post('/api/requests',data).then(res => {
            setFinishProgress(true);
        })
        .catch(err => {
            console.log(err);
            setErrorProgress(true);
        })
    }


       let requestMsg = (<div className='progress-msg'>
        <CircularProgress color='secondary'/>
        <h2>שולח בקשה</h2>
        </div>)
            if(finishProgress){
                requestMsg = <div className='progress-msg'>
                    <div class="success-checkmark">
                        <div class="check-icon">
                            <span class="icon-line line-tip"></span>
                            <span class="icon-line line-long"></span>
                            <div class="icon-circle"></div>
                            <div class="icon-fix"></div>
                        </div>
                    </div>
                <h2>הבקשה נשלחה בהצלחה</h2>
                <Button variant="contained" color='primary' onClick={() => {
                    setProgressScreen(false);
                    setFinishProgress(false);
                    setAddMsg(false);
                    setAddForm(false);
                    }}>אישור
                </Button>
            </div>
            }
            if(errorProgress){
                requestMsg = <div className='progress-msg'>
                <h2>אירעה שגיאה, אנא נסו שנית</h2>
                <Button variant="contained" color='primary' onClick={() => {
                    setProgressScreen(false);
                    setErrorProgress(false);}}>
                    אישור
                </Button>
            </div>
            }
    

    const handleSubmit = (event) => {
        event.preventDefault();
        if(!recaptcha || photos.length === 0 || photos.length > 5 || name == '' || donor == '' || district == '' || category == '' || description == ''){
            setFieldsError(<div className='errorMsg'>חלה שגיאה במילוי השדות</div>)
            if(!recaptcha){
                setRecaptchaErrorMsg(<div className='errorMsg'>יש לסמן שדה זה</div>)
            }
            else if(recaptcha){
                setRecaptchaErrorMsg('')
            }

            if(photos.length === 0){
                setPhotosErrorMsgNone(<div className='errorMsg'>יש להעלות לפחות תמונה אחת</div>)
            }
            else if(photos.length != 0){
                setPhotosErrorMsgNone('')
            }

            if(photos.length > 5){
                setPhotosErrorMsgBigger(<div className='errorMsg'>אין להעלות יותר מ-5 תמונות</div>)
            }
            else if(photos.length < 5){
                setPhotosErrorMsgBigger('')
            }

            if(name === ''){
                setNameErrorMsg(<div className='errorMsg'>יש למלא את שם המקום</div>)
            }
            else if(name != ''){
                setNameErrorMsg('')
            }

            if(donor ===''){
                setDonorErrorMsg(<div className='errorMsg'>יש למלא את שמך</div>)
            }
            else if(donor != ''){
                setDonorErrorMsg('')
            }

            if(district === ''){
                setDistrictErrorMsg(<div className='errorMsg'>יש לציין את האזור</div>)
            }
            else if(district != ''){
                setDistrictErrorMsg('')
            }

            if(category === ''){
                setCategoryErrorMsg(<div className='errorMsg'>יש לציין את סוג המקום</div>)
            }
            else if(category != ''){
                setCategoryErrorMsg('')
            }

            if(description === ''){
                setDescriptionErrorMsg(<div className='errorMsg'>יש למלא תיאור כמה שיותר מפורט של המקום</div>)
            }
            else if(description != ''){
                setDescriptionErrorMsg('')
            }
        }
        else{
            setFieldsError('');
            setRecaptchaErrorMsg('');
            setPhotosErrorMsgBigger('');
            setPhotosErrorMsgNone('');
            setNameErrorMsg('');
            setDonorErrorMsg('');
            setDescriptionErrorMsg('');
            setCategoryErrorMsg('');
            setDescriptionErrorMsg('');
            const data = new FormData();
            for(const file of photos){
                data.append('image',file)
            }
            data.append('name', name);
            setProgressScreen(true);
            axios.post('/api/uploads', data, {headers: {
                'Content-Type': 'multipart/form-data'
              }}).then(res => {
                 // console.log(res.data.urls);
                    sendRequest(res.data.urls, res.data.publicIds);})
            .catch(err => {
                console.log(err);
                setErrorProgress(true);
                });
              console.log(coordinates);
        }

    }

    return(
        <Dialog classes={{ paper: classes.dialogPaper }} open={addForm} fullWidth={true} maxWidth={'md'}>
            <form onSubmit={handleSubmit} style={{direction: 'rtl'}}  className='formContainer'>
                <div style={{fontSize: '3em', fontWeight: 'bold'}}>הגשת מקום חדש</div>
                <FormControl>
                <TextField className='fields' label='שם המקום' onChange={handleName}/>
                </FormControl>
                {nameErrorMsg}<br/>
                <FormControl>
                <TextField className='fields'  label='השם שלך(לצורך קרדיט)' onChange={handleDonor}/>
                </FormControl>
                {donorErrorMsg}<br/>
                <FormControl className='select-fields'>
                    <InputLabel>בחירת איזור</InputLabel>
                    <Select className='fields' label='איזור' onChange={handleDistrict}>
                    {districtOptions.map(district => (
                                <MenuItem key={district} value={district}>
                                    <ListItemText primary={district} />
                                </MenuItem>
                                ))
                    }
                    </Select>
                </FormControl>
                {districtErrorMsg}<br/>
                <FormControl className='select-fields'>
                    <InputLabel>בחירת סוג</InputLabel>
                    <Select className='fields' label='סוג' onChange={handleCategory}>
                    {categoryOptions.map(district => (
                                <MenuItem key={district} value={district}>
                                    <ListItemText primary={district} />
                                </MenuItem>
                                ))
                    }
                    </Select>
                </FormControl>
                {categoryErrorMsg}<br/>
                <FormControl>
                <TextField className='fields' multiline variant='filled' rows='10' type='rtl' label='תיאור' onChange={handleDescription}/>
                </FormControl>
                {descriptionErrorMsg}<br/>
                <input accept="image/*" style={{ display: 'none' }} id="raised-button-file" multiple type="file" onChange={handlePhotos}/>
                    <label htmlFor="raised-button-file">
                        <Button style={{fontSize: '1.7rem'}} variant="contained" color='primary' component="span">
                        העלאת תמונות
                        </Button>
                    </label>
                    {photosErrorMsgBigger}{photosErrorMsgNone}<br/>
                <ReCAPTCHA  sitekey={process.env.REACT_APP_RECAPTCHA_KEY} onChange={() => setRecaptcha(true)} onExpired={() => setRecaptcha(false)}/>
                {recaptchaErrorMsg}<br/>
                <Grid container spacing={2} direction='row' alignContent='center' justify='center'>
                    <Grid item>
                         <Button type='submit' variant="contained" color='primary' >שליחת בקשה</Button>
                    </Grid>
                    <Grid item>
                         <Button type='reset' variant="contained" color='primary' onClick={() => setAddForm(false)}>ביטול</Button>
                    </Grid>
                </Grid>
                {fieldsError}
                <Dialog open={progressScreen}>
                    <DialogContent>
                        {requestMsg}
                    </DialogContent>
                </Dialog>
            </form>
        </Dialog>
    )

}

export default withStyles(styles)(AddForm);