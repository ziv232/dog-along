import { Dialog, DialogTitle, DialogContent, Select, FormControl, InputLabel, Input, ListItemText, MenuItem, Checkbox } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import '../css/addMsg.css';



const styles = {
    dialogPaper: {
      top: '-20%',
      background: 'radial-gradient(#eeeeec,#eff0ea)',
      color: 'black',
      minHeight: '15vh',
      borderRadius: '1rem',
      textAlign: 'center',
      padding: '1vh 1vh 1vh 1vh'
    },

};

function AddMsg(props){

    const { addMsg, setAddMsg, setAddForm, classes} = props;

    return(
        <Dialog classes={{ paper: classes.dialogPaper }} open={addMsg} hideBackdrop={true} fullWidth={true} maxWidth={'sm'}>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', justifyItems: 'center'}}>
            <div style={{fontSize: '3vh', direction: 'rtl', marginTop: '3vh'}}>האם אתה בטוח שברצונך להוסיף מקום זה?</div>
                <div className='buttons-container'>
                    <button className='add-buttons' onClick={() => {setAddMsg(false);}}>לא</button>
                    <button className='add-buttons' onClick={() => {setAddForm(true); setAddMsg(false);}}>כן</button>
                </div>
            </div>
        </Dialog>
    )
}
export default withStyles(styles)(AddMsg);
