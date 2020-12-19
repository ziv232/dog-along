import React from 'react';

import '../css/backDrop.css';

const backDrop = props => {
    return(
        <div className='backdrop' onClick={props.click}/>
    )
}

export default backDrop;