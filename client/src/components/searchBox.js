import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, Select, FormControl, InputLabel, Input, ListItemText, MenuItem, Checkbox, AppBar, Toolbar, Button } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import '../css/searchBox.css';
import SvgSearchButton from './svgSearchButton';
import SvgExitButton from './svgExitButton';

const styles = {
    dialogPaper: {
    background: 'radial-gradient(#e7e7e4,#dcddd4)',
      color: 'black',
      paddingBottom: '1rem',
      minHeight: '48vh',
      borderRadius: '1rem'
    },
    dialogLabel: {
        color: 'black',
        fontSize: '1.3rem'
    },
  };

function SearchBox(props){

    const {openSearchBox, setOpenSearchBox, places, setPlaces, classes} = props;
    const [districts, setDistricts] = useState([]);
    const [categories, setCategories] = useState([]);
    const districtOptions = ['צפון','מרכז','דרום'];
    const categoryOptions = ['גינות כלבים','חופים','מסלולי טיולים','עמותות','מקורות מים']

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
        const data = {
            districts: districts,
            categories: categories
        }
        axios.post('/api/locations/review',data).then( res => setPlaces(res.data))
        .catch(err => console.log(err));



        setOpenSearchBox(false);
    }
    

    return(
        <Dialog classes={{ paper: classes.dialogPaper }} open={openSearchBox} onBackdropClick={() => setOpenSearchBox(false)} fullWidth={true} maxWidth={'sm'}>
            <AppBar position='sticky' style={{background: 'radial-gradient(#e7e7e4,#dcddd4)'}}><Toolbar><Button variant="contained" color='inherit' className='exitButton' onClick={() => setOpenSearchBox(false)}><SvgExitButton/></Button></Toolbar></AppBar>
            <div className="dialogContainer">
            <DialogTitle><div style={{fontSize: '2em', fontWeight: 'bold'}}>חיפוש מקומות</div></DialogTitle>
                <FormControl style={{minWidth: 200}} className='select-fields'>
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
                </FormControl>
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
                            {categoryOptions.map(category => (
                                <MenuItem key={category} value={category}>
                                <Checkbox color='primary' checked={categories.indexOf(category) > -1} />
                                <ListItemText primary={category} />
                                </MenuItem>))}
                        </Select>
                </FormControl>
                <div className="buttonContainer">
                <Button variant="contained" color='inherit' onClick={handleSubmit}><SvgSearchButton/></Button>
                </div>
                </div>
        </Dialog>
    )
}
export default withStyles(styles)(SearchBox);
//<div>Icons made by <a href="https://www.flaticon.com/authors/iconixar" title="iconixar">iconixar</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
