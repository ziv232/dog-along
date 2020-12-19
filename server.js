//Connecting the server
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
mongoose.Promise = global.Promise;


const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 5000;

const locations = require('./routes/api/locations')
const requests = require('./routes/api/requests')
const uploads = require('./routes/api/uploads')
const users = require('./routes/api/users')



//mongodb+srv://dogalongadmin:eevee232@dogalongcluster.vfzcz.mongodb.net/dogalongDB?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://dogalongadmin:eevee232@dogalongcluster.vfzcz.mongodb.net/dogalongDB?retryWrites=true&w=majority',
 {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true})
.then(()=>{console.log('Server connected')});

mongoose.connection.on('connected', () => {
    console.log('mongoose is connected');
})

app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use(morgan('tiny'));

app.use('/api/locations', locations);
app.use('/api/requests', requests);
app.use('/api/uploads', uploads);
app.use('/api/users', users)



app.listen(port, console.log(`server starting at ${port}`));

setTimeout(()=>{console.log(mongoose.connection.readyState)
}, 3000);