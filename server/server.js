import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import { common } from '../common/common.mjs';
import { v4 as uuid } from 'uuid';
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
    database: 'tuticket_new',
    port: 3305
});

let _sessions = [];

function GetUser(sessionId)
{
    const idx = _sessions.indexOf(sessionId);
    if(idx >= 0) {
        return _sessions[sessionId];
    }

    db.query("SELECT * FROM `users` WHERE sessionId = ?;",
            [sessionId], (err, qres) => {
            if(err) 
            {
                console.log(err);
                return null;
            }

            if(qres.length > 0) {

                let data = {
                    email: email,
                    verified: qres.verified,
                    sessionId: sessionId,
                    firstName: qres.firstName,
                    lastName: qres.lastName,
                    role: qres.role
                };

                _sessions[sessionId] = data;
                req.session_id = sessionId;

                return data;
            }
            else
            {
                return null;
            }
        });
}

app.post('/entry', (req, res) => {
    let { countryIdx, sessionId, email } = req.body;

    let guest = sessionId == -1 || email == -1;

    if(countryIdx == -1) {
        countryIdx = common.kDefaultCountryIndex;
    }

    let data = { countryIdx: countryIdx };
    if(!guest)
    {
        console.log("user is not guest, selecting from db...");
        db.query("SELECT * FROM `users` WHERE sessionId = ? AND email = ?;",
            [sessionId,  email], (err, qres) => {
            if(err) 
            {
                console.log(err);
                return res.status(401).end();
            }

            console.log(qres);
            if(qres.length > 0) {

                req.session_id = sessionId;

                console.log("found user!");
                return res.json({
                    ...data,
                    user: {
                        email: qres[0].email,
                        verified: qres[0].verified,
                        sessionId: qres[0].sessionId,
                        firstName: qres[0].firstName,
                        lastName: qres[0].lastName,
                        role: qres[0].role
                    }
                });
            }
            else
            {
                console.log("didn't find user!");
                return res.json({
                    ...data,
                    user: null
                });
            }
        });
    }
    else
    {
        return res.json({
            ...data,
            user: null
        });
    }
});

app.post('/signin/action', (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(401).end();
    }

    const expectedPassword = users[username]
    if (!expectedPassword || expectedPassword !== password) {
        return res.status(401).end()
    }

    // generate a random UUID as the session token
    const sessionToken = uuid()
});

app.post('/register/action', (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    let errors = {};

    // #todo validate entries
    if(firstName.length < 5) {
        errors.firstName = 1;
    }

    if(lastName.length < 5) {
        errors.lastName = 1;
    }

    if(email.length < 5) {
        errors.email = 1;
    }

    if(password.length < 8) {
        errors.password = 1;
    }

    if(Object.keys(errors).length > 0) {
        return res.json({ errors: { ...errors } });    
    }

    const sessionId = uuid();
    
    db.query("INSERT INTO `users` (firstName, lastName, email, password, sessionId) VALUES(?, ?, ?, ?, ?);",
        [firstName, lastName, email, password, sessionId], (err, qres) => {
        if(err) {
            console.log(err);
            return res.status(401).end()
        }

        req.session_id = sessionId;
        
        const data = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            verified: 0,
            sessionId: req.session_id,
            role: common.kDefaultRole,
        };

        _sessions[sessionId] = data;

        return res.json({
            user: data
        });
    });
});

app.post('/verify_email/debug', (req, res) => {
    let user = GetUser(req.session_id);
    if(!user) {
        return res.status(401).end();
    }

    user.verified = 1;

    db.query("UPDATE `users` SET verified = ? WHERE sessionId = ?);",
        [user.verified, req.session_id], (err, qres) => {
        if(err) 
        {
            console.log(err);
            return res.status(401).end();
        }

        return res.json({
            user: user
        });
    });

    return res.json({});
});

// #todo add parameter with id
app.post('/verify_email/action', (req, res) => {
    return res.json([{ title: 'title', price: 500 }]);
});

app.post('/dashboard/profile', (req, res) => {
    return res.json([{ title: 'title', price: 500 }]);
});

app.post('/events', (req, res) => {
    return res.json([{ title: 'title', price: 500 }]);
});

app.post('/logout', (req, res) => {
    console.log("logout");
    return res.json({});
});

app.listen(8081, () => {
    console.log("Server started");
});



