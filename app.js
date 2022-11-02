const express = require('express');
const mysql = require('mysql');
var cors = require('cors')

// url for encryption of path
// https://emn178.github.io/online-tools/sha256.html

const endPoints = {
    setTheme: '460cdea15f7e2d7cf366d75da91d8e24475ce5c8921303f808b2eb68064f2f4a',
    fetchTheme: '209d605ee355854c2765e7caa274af6c23c29b9f3226145fb8ca8628bbde24b5',
    setcode: 'c6a1245e144765e5894c139b433020e5b200b3185a493978d05c2c74a7116b7b',
    move: '683a62ce15fbabb1ac867022e56e6e4f4f581762d77c3abb2f8dc8b165b3b1b9',
    getApprove: 'f931f09cc70252db573bd399ca768cb913173b3c9112003085f757200673eb3a',
}

// sql connection
// https://www.freemysqlhosting.net/account/
const db = mysql.createConnection({
    host: 'sql8.freemysqlhosting.net',
    user: 'sql8535414',
    password: 'i5iuGbiFjF',
    database: 'sql8535414'
});

// connect data base
db.connect((err, res) => {
    if (err) {
        throw err;
    }
    console.log('sql connected!')
})

const app = express();

app.use(express.json());
app.use(cors());


var endpoint = `/${endPoints.setTheme}`;
app.post(endpoint, (req, res) => {
    console.log("setTheme:", req.body);
    let sql = `INSERT INTO game (gameId,board,currentUser,gameStartBy) VALUES (?,?,?,?)`;
    const gameId = 0;
    const board = JSON.stringify(req.body.board);
    const currentUser = req.body.currentUser;
    const gameStartBy = req.body.gameStartBy;
    let val = [gameId, board, currentUser, gameStartBy]
    db.query(sql, val, (err, result) => {
        if (err) throw err;
        var theme = {
            change: true,
            lightcolor: "lightgreen",
            darkcolor: "white",
            activeCoin: "yellow",
            availableMoves: "purple",
            attackMoves: "red",
            bgImage: "url(../images/bgBoard.jpg)",
            active: currentUser,
            alertBox: 'pink',
            gameId: result.insertId
        }
        console.log("res:", theme);
        res.send(theme);
    });
})


var endpoint = `/${endPoints.setcode}`;
app.post(endpoint, (req, res) => {
    const gameId = req.body.gameId;
    const activate = req.body.activate;
    const openToUse = req.body.openToUse;
    let sql = `UPDATE game SET activate = '${activate}',openToUse='${openToUse}' WHERE gameId = ${gameId}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
})

var endpoint = `/${endPoints.move}`;
app.post(endpoint, (req, res) => {
    const gameId = req.body.gameId;
    const activate = req.body.activate;
    const currentUser = (req.body.currentUser == 'white') ? 'black' : 'white';
    const board = JSON.stringify(req.body.board);
    console.log('move:', req.body);
    let sql = `UPDATE game SET board = '${board}',currentUser = '${currentUser}' WHERE gameId = ${gameId} and activate = '${activate}'`;
    db.query(sql, (err, result) => {
        if (err) { throw err } else {
            let sql = `SELECT * FROM game Where gameId = ${gameId} and activate = '${activate}'`;
            db.query(sql, (err, result) => {
                if (err) { res.send(err) } else {
                    console.log('res:', result[0]);
                    res.send(result[0]);
                };
            });
        }
    });
})
var endpoint = `/${endPoints.fetchTheme}`;
app.post(endpoint, (req, res) => {
    const gameId = req.body.gameId;
    let sql = `SELECT gameStartBy FROM game Where gameId = ${req.body.gameId} and activate = '${req.body.activate}'`;
    console.log("fetch theme:",req.body);
    db.query(sql, (err, result) => {
        if (err) { res.send(err) } else {
            let sql = `UPDATE game SET openToUse = 'N' WHERE gameId = ${gameId}`;
            db.query(sql);
            side = ((result[0].gameStartBy) == 'white') ? 'black' : 'white';
            output = { "currentUser": side, "valid": true }
            console.log("res:",output);
            res.send(output);
        };
    });
})

var endpoint = `/${endPoints.getApprove}`;
app.post(endpoint, (req, res) => {
    console.log('getApprove:', req.body);
    let sql = `SELECT * FROM game Where gameId = ${req.body.gameId}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        output = { "currentUser": result[0].currentUser, "board": result[0].board }
        console.log('res',output);
        res.send(output);
    });
})


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server listention to port...${port}`);
});

