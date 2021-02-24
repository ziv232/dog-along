import { Button, Dialog, DialogTitle, Select, FormControl, InputLabel, Input, ListItemText, MenuItem, Checkbox, DialogContent } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";

import '../css/terms.css';



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
    }
}

function Terms(props){

    const {terms, setTerms, classes} = props;

    return(
        <Dialog classes={{ paper: classes.dialogPaper }} open={terms} >
            <div className={'dialogContainer'}>
            <DialogTitle><h1>תנאי שימוש</h1></DialogTitle>
            <DialogContent>
                <ul className={'list'}>
                    <li>המידע מגיע ממשתמשים ואין לאתר קשר לנכונות התוכן</li><br/>
                    <li>אין להגיש מקומות בשטחים פרטיים</li><br/>

                </ul>
            </DialogContent>
            <button className={'agreeButton'} onClick={() => setTerms(false)}>הבנתי</button>
            </div>
        </Dialog>
    )
}
export default withStyles(styles)(Terms);