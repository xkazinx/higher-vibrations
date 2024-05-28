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

const db_auth = 
{
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'tuticket_new',
    port: 3305
};

const db = mysql.createConnection(db_auth);

let _sessions = [];

async function GetUser(sessionId, req, callback) 
{
    const idx = _sessions.indexOf(sessionId);
    if(idx >= 0) {
        return _sessions[sessionId];
    }

    let data = null;
    await db.query("SELECT * FROM `users` WHERE sessionId = ?;",
            [sessionId], (err, qres) => {
            if(err) 
            {
                console.log(err);
                return null;
            }

            if(qres.length > 0) {

                data = {
                    email: qres[0].email,
                    verified: qres[0].verified,
                    sessionId: sessionId,
                    firstName: qres[0].firstName,
                    lastName: qres[0].lastName,
                    role: qres[0].role
                };

                _sessions[sessionId] = data;
                //req.session_id = sessionId;
            }

            callback(data);
        });
    
    callback(data);
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
        //req.drop();
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

app.post('/verify_email/action', async (req, res) => {
    const { sessionId } = req.body;
    //req.session_id = sessionId;
    await GetUser(sessionId, req, async (user) => 
    {
        console.log('/verify_email/action/:sessionId'   );
        if(!user) {
            console.log("!user");
            return res.status(401).end();
        }
    
        user.verified = 1;
    
            await db.query("UPDATE `users` SET verified = ? WHERE sessionId = ?;",
                [user.verified, sessionId], (err, qres) => {
                if(err) 
                {
                    console.log(err);
                    return res.status(401).end();
                }

                console.log("verified!");
                /*return res.json({
                    user: user
                });*/
            });
    });
});

// #todo add parameter with id
/*app.post('/verify_email/action', (req, res) => {
    return res.json([{ title: 'title', price: 500 }]);
});*/

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



