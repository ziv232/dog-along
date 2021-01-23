import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha";
import {Grid, Toolbar, Dialog, Button, DialogTitle, DialogContent,Form, FormControl, TextField, Select, InputLabel, Input, ListItemText, MenuItem, CircularProgress} from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import UserContext from '../context/userContext';
import '../css/adminPanel.css';


//Components
import AdminMap from '../components/adminMap';

function AdminPanel(){

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [progressScreen, setProgressScreen] = useState(false);
    const {userData,setUserData} = useContext(UserContext);

    let requestMsg = (<div className='progress-msg'>
    <CircularProgress color='secondary'/>
    <h2>מנסה להתחבר</h2>
    </div>)

    const handleSubmit = (e) => {
        e.preventDefault();
        setProgressScreen(true);
        const loginUser = {username, password};
        axios.post('/api/users/login',loginUser).then(res => {
            localStorage.setItem('auth-token', res.data.token);
            setErrorMsg('');
            setProgressScreen(false);
            setUserData({
                token: res.data.token,
                user: res.data.user
            });
        }).catch(err => {
            setErrorMsg(err.response.data.msg);
            setProgressScreen(false);
        });

    }


    return(<div>{userData.user === undefined ? (
        <div className='container'>
            <div className='title'>התחברות</div>
            <form className='form' onSubmit={handleSubmit}>
                <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Grid container spacing={3}>
                    <Grid className='form' item xs={12}>
                        <TextField className='fields' onChange={(e) => setUsername(e.target.value)}  label="שם משתמש" name="username" size="small" variant="outlined" />
                    </Grid>
                    <Grid className='form' item xs={12}>
                        <TextField
                        onChange={(e) => setPassword(e.target.value)}
                        className='fields'
                        label="סיסמה"
                        name="password"
                        size="small"
                        type="password"
                        variant="outlined"
                        />
                    </Grid>
                    </Grid>
                </Grid>
                    <button className='login-button'>התחבר</button>
                </Grid>
         </form>
         <div className={`${(errorMsg === null || errorMsg === '') ? 'noclass' : 'errorMsg'}`}>{errorMsg}</div>
         <Dialog open={progressScreen}>
            <DialogContent>
                {requestMsg}
            </DialogContent>
        </Dialog>
      </div>)
   : (<AdminMap/>) }
    </div>)
}

export default AdminPanel;