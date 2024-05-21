import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import { common } from '../common/common.mjs';

import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
//import { signinHandler, welcomeHandler, refreshHandler } from './handlers'

const app = express();
app.use(cors());
app.use(bodyParser.json())
app.use(cookieParser())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'tuticket_new'
});

let _sessions = [];

app.post('/entry', (req, res) => {
    let { country_idx, session_id, mail } = req.body;

    console.log("session_id: ");
    console.log(session_id);    
    console.log("mail: ");
    console.log(mail);
    console.log("country_idx: ");
    console.log(country_idx);
    
    let guest = session_id == -1 || mail == -1;

    if(!guest)
    {
        req.session_id = uuid.v4();
    }

    if(country_idx == -1)
    {
        country_idx = common.kDefaultCountryIndex;
    }

    return res.json({ 
        country_idx: country_idx, 
        user: guest ? null :
         {
            mail: mail,
            session_id: session_id,
         }
        });
    
    const query = "SELECT * FROM events";
    db.query(query, (err, res) => {
        if(err) return res.json({ message: "error" });
        return res.json(res);
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username) {
        res.status(401).end();
        return;
    }

    const expectedPassword = users[username]
    if (!expectedPassword || expectedPassword !== password) {
        res.status(401).end()
        return
    }

    // generate a random UUID as the session token
    const sessionToken = uuid.v4()


});


app.post('/events', (req, res) => {
    return res.json([{ title: 'title', price: 500 }]);
});

app.listen(8081, () => {
    console.log("Server started");
});



