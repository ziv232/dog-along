import { Dialog, DialogTitle, DialogContent, Select, FormControl, InputLabel, Input, ListItemText, MenuItem, Checkbox } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import '../css/addMsg.css';



const styles = {
    dialogPaper: {
    background: 'radial-gradient(#e7e7e4,#dcddd4)',
      color: 'black',
      paddingBottom: '1rem',
      minHeight: '15vh',
      borderRadius: '1rem',
      textAlign: 'center',
    },
    dialogLabel: {
        color: 'black',
        fontSize: '1.3rem'
    }
};

function AddMsg(props){

    const {addMsg,setAddMsg, addMode, setAddMode, classes} = props;

    return(
        <Dialog classes={{ paper: classes.dialogPaper }} open={addMsg} fullWidth={true} maxWidth={'sm'}>
            <DialogTitle className={classes.dialogLabel}>?האם אתה בטוח שברצונך להוסיף מקום זה</DialogTitle>
            <DialogContent>
                <div className='buttons-container'>
                    <button className='buttons'>כן</button>
                    <button className='buttons' onClick={() => {setAddMsg(false);
                                            setAddMode(false);}}>לא</button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
export default withStyles(styles)(AddMsg);
