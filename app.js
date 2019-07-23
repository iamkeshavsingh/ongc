const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const adminRoute = require('./routes/admin');
const session = require('express-session');


//setting up the cors and parser for upcomming data
app.use(cors());
app.use(express.json());
app.use(express.urlencoded( { extended : true } ));
app.use(express.static('recruitment_ONGC'));

//File uploading code 
const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,'./recruitment_ONGC/marksheets/');
    },
    filename  : (req,file,cb) => {
        const idx = file.originalname.lastIndexOf('.')+1;
        const extension = file.originalname.substring(idx);
        const filename = file.fieldname + '-' + Date.now()+'.'+extension;
        file.filename = filename;
        cb(null,filename);
    }
});

const upload = multer({storage : storage});

//managing the sessions
app.use(session({
    secret : process.env.SECRET,
    saveUninitialized : true,
    resave : false
}));




app.use('/auth',authRoute);
app.use('/user',upload.single('file'),userRoute);
app.use('/admin',adminRoute);



//starting the server
const port = process.env.PORT || 3000;
app.listen(3000,() => {
    console.log(`Listening on the port ${port}`);
});