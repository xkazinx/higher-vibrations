import express from 'express';
import mysql from 'mysql2/promise';
import session from 'express-session'   ;
import cors from 'cors';
import { common } from '../common/common.mjs';
import { v4 as uuid } from 'uuid';
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

const app = express(); // #todo move to .env config file and modify accordingly
const whitelist = ['http://localhost:3000'];
const corsOptions = {
  credentials: true, // This is important.
  origin: (origin, callback) => {
    if(whitelist.includes(origin))
      return callback(null, true)

      callback(new Error('Not allowed by CORS'));
  }
}

app.use(cors(corsOptions));
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({
    // #todo move to .env config file and modify accordingly
    secret: 'testing', // Replace with your own secret key
    resave: true,
    saveUninitialized: true,
    httpOnly: true
}));

// #todo move to .env config file and modify accordingly
const db_auth = 
{
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'tuticket_new',
    port: 3305
};

async function dbConnection()
{
    return await mysql.createConnection(db_auth);
}

let _sessions = [];

async function GetUser(sessionId, req) 
{
    const idx = _sessions.indexOf(sessionId);
    if(idx >= 0) {
        return _sessions[sessionId];
    }

    let data = null;
    let db = await dbConnection();
    let [qres, fields] = await db.execute("SELECT id FROM `sessions` WHERE sessionId = ?;"
        , [sessionId]
    );
    
    if(qres.length > 0) {

        let [user_qres, fields] = await db.execute("SELECT * FROM `users` WHERE id = ?;"
            , [qres[0].id]
        );
        data = {
            email: user_qres[0].email,
            verified: user_qres[0].verified,
            sessionId: sessionId,
            firstName: user_qres[0].firstName,
            lastName: user_qres[0].lastName,
            role: user_qres[0].role,
            id: user_qres[0].id
        };

        _sessions[sessionId] = data;
        req.session.session_id = sessionId;
        req.session.user_id = user_qres[0].id;
    }

    await db.end();
    return data;
}

app.post('/entry', async (req, res) => {
    let { countryIdx, sessionId, userId } = req.body;

    let guest = sessionId == -1 || userId == -1;

    if(countryIdx == -1) {
        countryIdx = common.kDefaultCountryIndex;
    }

    if(!guest)
    {
        console.log("user is not guest, selecting from db...");
    
        let db = await dbConnection();

        let foundSession = false;
        {
            let [qres, fields] = await db.execute("SELECT id FROM `sessions` WHERE sessionId = ?;",
                [sessionId]);

            for(let i = 0; i < qres.length; ++i) {
                if(qres[i].id == userId) {
                    foundSession = true;
                    break;
                }
            }
        }

        if(foundSession) {
            let [qres, fields] = await db.execute("SELECT * FROM `users` WHERE sessionId = ? AND email = ?;",
                [sessionId,  email]);

            if(qres.length > 0) {

                req.session.session_id = sessionId;
                req.session.user_id = qres[0].id;

                console.log("found user!");
                
                let user =  {
                    email: qres[0].email,
                    verified: qres[0].verified,
                    sessionId: qres[0].sessionId,
                    firstName: qres[0].firstName,
                    lastName: qres[0].lastName,
                    role: qres[0].role,
                    id: qres[0].id
                }

                await db.end();

                return res.json({
                    countryIdx: countryIdx,
                    user: user
                });
            }
        }
    }
    
    return res.json({
        countryIdx: countryIdx,
        user: null
    });
});

app.post('/signin/action', async (req, res) => {
    console.log(req);
    if(req.session.session_id && req.session.user_id)
    {
        let user = await GetUser(req.session.session_id);
        if(user) {
            return res.json({
                user: user
            });
        }
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).end();
    }

    let errors = {};

    if(email.length < 5) {
        errors.email = 1;
    }

    if(password.length < 8) {
        errors.password = 1;
    }

    if(Object.keys(errors).length > 0) {
        return res.json({ errors: { ...errors } });    
    }

    let db = await dbConnection();

    let [qres, fields] = await db.execute("SELECT * FROM `users` WHERE email = ?;",
        [email]);

    if(qres.length == 0)
    {
        errors.email = 2;
        return res.json({ errors: { ...errors } });   
    }

    // #todo encrypt
    const expectedPassword = qres[0].password;
    if (!expectedPassword || expectedPassword !== password) {
        errors.password = 2;
        db.end();
        return res.json({ errors: { ...errors } });   
    }

    const sessionId = uuid()

    req.session.session_id = sessionId;
    req.session.user_id = qres[0].id;

    console.log("/signin/action " + req.session.session_id);
    console.log("/signin/action " + req.session.user_id);

    const user = {
        email: qres[0].email,
        verified: qres[0].verified,
        sessionId: qres[0].sessionId,
        firstName: qres[0].firstName,
        lastName: qres[0].lastName,
        role: qres[0].role,
        id: qres[0].id
    };

    _sessions[sessionId] = user;

    await db.execute("INSERT INTO `sessions` (id, sessionId) VALUES (?, ?);",
        [user.id, user.sessionId]);

    await db.end();

    return res.json({
        user: user
    });
});

app.post('/register/action', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    let errors = {};

    // #todo validate entries
    if(firstName.length == 0) {
        errors.firstName = 1;
    }

    if(lastName.length == 0) {
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
    
    let db = await dbConnection();

    {
        let [qres, fields] = await db.execute("SELECT id FROM `users` WHERE email = ?;",
            [email]);

        if(qres.length > 0)
        {
            errors.email = 2;
            db.end();
            return res.json({ errors: { ...errors } });
        }
    }

    const sessionId = uuid();

    let [qres, fields] = await db.execute("INSERT INTO `users` (firstName, lastName, email, password, sessionId) VALUES(?, ?, ?, ?, ?);",
        [firstName, lastName, email, password, sessionId]);

    req.session.session_id = sessionId;
    req.session.user_id = qres.insertId;

    console.log("res.insertId " + qres.insertId);

    let user = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        verified: 0,
        sessionId: req.session.session_id,
        role: common.kDefaultRole,
        id: req.session.user_id,
    };

    _sessions[sessionId] = user;

    await db.end();

    return res.json({
        user: user
    });
});

app.post('/verify_email/action', async (req, res) => {
    const { sessionId } = req.body;
    
    let user = await GetUser(sessionId, req);

    if(!user) {
        console.log("/verify_email/action: user is null");
        return res.status(401).end();
    }

    let db = await dbConnection();

    let [qres, fields] = await db.execute("UPDATE `users` SET verified = ? WHERE sessionId = ?;",
        [user.verified, sessionId]);
    
    if(qres.affectedRows > 0) {
        user.verified = 1;
    }

    await db.end();

    console.log("/verify_email/action: verified " + user.email);

    return res.json({
        user: user
    });
});

app.post('/dashboard/profile', (req, res) => {
    return res.json([{ title: 'title', price: 500 }]);
});

app.post('/events', (req, res) => {
    return res.json([{ title: 'title', price: 500 }]);
});

app.post('/logout', async (req, res) => {
    console.log("/logout: " + req.session.session_id);
    console.log("/logout: " + req.session.user_id);
    if(!req.session.session_id || !req.session.user_id) {
        console.log("/logout: !req.session.session_id || req.session.user_id");
        return res.json({});
    }

    let db = await dbConnection();

    /*let [qres, fields] = */
    await db.execute("DELETE FROM `sessions` WHERE sessionId = ? AND id = ?;",
        [req.session.session_id, req.session.user_id]);

    req.session.session_id = null;
    req.session.user_id = null;

    await db.end();
    console.log("/logout: success");
    return res.json({});
});

app.listen(8081, () => {
    console.log("Server started");
});



