import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, Select, FormControl, InputLabel, Input, ListItemText, MenuItem, Checkbox, Slider } from '@material-ui/core';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import '../css/searchBox.css';
import SvgSearchButton from './svgSearchButton';
import SvgExitButton from './svgExitButton';
import {globalDistricts, globalCategories} from '../utils/variables';

const styles = {
    dialogPaper: {
    background: 'radial-gradient(#e7e7e4,#dcddd4)',
      color: 'black',
      paddingBottom: '1rem',
      minHeight: '65vh',
      borderRadius: '1rem'
    },
    dialogLabel: {
        color: 'black',
        fontSize: '1.3rem'
    },
  };

  const PrettoSlider = withStyles({
    root: {
      color: '#2ecc71',
      height: 8,
      width: 250,
      marginTop: '3vh',
      marginBottom: '5vh'
    },
    thumb: {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      marginTop: -8,
      marginLeft: -12,
      '&:focus, &:hover, &$active': {
        boxShadow: 'inherit',
      },
    },
    active: {},
    valueLabel: {
      left: 'calc(-50% + 5px)',
    },
    track: {
      height: 8,
      borderRadius: 4,
    },
    rail: {
      height: 8,
      borderRadius: 4,
    },
  })(Slider);

function SearchBox(props){

    const {openSearchBox, setOpenSearchBox, places, setPlaces, setGeoLocation, panLocation, setGeoLat, setGeoLng, classes} = props;
    const [districts, setDistricts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchBy, setSearchBy] = useState('region');
    const [radius, setRadius] = useState(null);

    const handleDistrict = (event) => {
        setDistricts(event.target.value)
        console.log(event.target.value)
    }

    const handleCategories = (event) => {
        setCategories(event.target.value)
        console.log(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(searchBy=='region'){
            const data = {
                districts: districts,
                categories: categories
            }
            axios.post('/api/locations/review',data).then( res => setPlaces(res.data))
            .catch(err => console.log(err));
            setOpenSearchBox(false);
        }
        else{
            navigator.geolocation.getCurrentPosition(
                (location) => {
                    const data = {
                        radius: radius,
                        lat: location.coords.latitude,
                        lng: location.coords.longitude,
                        categories: categories
                    }
                    setGeoLat(location.coords.latitude);
                    setGeoLng(location.coords.longitude);
                    panLocation({
                        lat: location.coords.latitude,
                        lng: location.coords.longitude
                    });
                    setGeoLocation(true);
                    axios.post('/api/locations/reviewByDistance',data).then( res => setPlaces(res.data))
                    .catch(err => console.log(err));
                    setOpenSearchBox(false);
                },
                () => {
                    console.log('Failed to get users location');
                }
            )
        }
    }
    
    const handleSwitcher = (event) => {
        console.log(event.target.value);
        setSearchBy(event.target.value);
    }

    const handleSlider = (event, newValue) => {
        console.log(newValue);
        setRadius(newValue);
    }

    return(
        <Dialog classes={{ paper: classes.dialogPaper }} open={openSearchBox} onBackdropClick={() => setOpenSearchBox(false)} fullWidth={true} maxWidth={'sm'}>
           <button className='exit-button' onClick={() => setOpenSearchBox(false)}>+</button>
            <div className="dialogContainer">
            <DialogTitle><div style={{fontSize: '5vh', fontWeight: 'bold'}}>חיפוש מקומות</div></DialogTitle>
            <div className="search-switcher">
                <p className="fieldset">
                    <input type="radio" name="duration-1" value="region" id="region" onChange={handleSwitcher}/>
                    <label for="region">לפי אזור</label>
                    <input type="radio" name="duration-1" value="distance" id="distance" onChange={handleSwitcher}/>
                    <label for="distance">לפי מרחק</label>
                    <span className="switch"></span>
                </p>
		    </div>
              {searchBy=='region' ? <FormControl style={{minWidth: 200, marginBottom: '5vh'}} className='select-fields'>
                    <InputLabel className={classes.dialogLabel}>
                    בחירת אזורים
                    </InputLabel>
                        <Select
                            multiple
                            value={districts}
                            onChange={handleDistrict}
                            name="district"
                            input={<Input />}
                            renderValue={selected => selected.join(", ")}
                            >
                            {globalDistricts.map(district => (
                                <MenuItem key={district} value={district}>
                                <Checkbox color='primary' checked={districts.indexOf(district) > -1} />
                                <ListItemText primary={district} />
                                </MenuItem>))}
                        </Select><br/>
                </FormControl>
                :   <PrettoSlider onChange={handleSlider} valueLabelDisplay="auto" aria-label="pretto slider" defaultValue={30} max={300}/>}
                <FormControl style={{minWidth: 200}} className='select-fields'>
                <InputLabel className={classes.dialogLabel}>
                    בחירת סוגי מקומות
                    </InputLabel>
                        <Select
                            multiple
                            value={categories}
                            onChange={handleCategories}
                            name="cetegory"
                            input={<Input />}
                            renderValue={selected => selected.join(", ")}
                            >
                            {globalCategories.map(category => (
                                <MenuItem key={category} value={category}>
                                <Checkbox color='primary' checked={categories.indexOf(category) > -1} />
                                <ListItemText primary={category} />
                                </MenuItem>))}
                        </Select>
                </FormControl>
                </div>
                <div className='button-container'>
                <button className='search-button' onClick={handleSubmit}>חפש</button>
                </div>
        </Dialog>
    )
}
export default withStyles(styles)(SearchBox);
//<div>Icons made by <a href="https://www.flaticon.com/authors/iconixar" title="iconixar">iconixar</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
/* <FormControl style={{minWidth: 200}} className='select-fields'>
<InputLabel className={classes.dialogLabel}>
בחירת אזורים
</InputLabel>
    <Select
        multiple
        value={districts}
        onChange={handleDistrict}
        name="district"
        input={<Input />}
        renderValue={selected => selected.join(", ")}
        >
        {districtOptions.map(district => (
            <MenuItem key={district} value={district}>
            <Checkbox color='primary' checked={districts.indexOf(district) > -1} />
            <ListItemText primary={district} />
            </MenuItem>))}
    </Select><br/>
</FormControl> */