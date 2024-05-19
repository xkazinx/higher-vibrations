import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express();
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'tuticket_new'
});

app.get('/', (req, res) => {
    return res.json({ data: "data_msg"});
    
    const query = "SELECT * FROM events";
    db.query(query, (err, res) => {
        if(err) return res.json({ message: "error" });
        return res.json(res);
    });
});

app.listen(8081, () => {
    console.log("Server started");
});



