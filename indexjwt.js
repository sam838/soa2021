const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();
app.use(express.urlencoded({extended:true}))
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

const pengguna = require('./routes/pengguna');
const resep = require('./routes/resep');
const aksesapi = require('./routes/aksesapi');
const useraktif = [
    {
        "username" :"admin",
        "password" :"admin",
        "is_admin" : 1
    },
    {
        "username" :"upin",
        "password" :"upin",
        "is_admin" : 0
    }]
app.post("/api/login",function (req,res){
    let username = req.body.username;
    let password = req.body.password;
    let ada = null;
    for (let i=0; i<useraktif.length; i++)
    {
        if (username == useraktif[i].username && password == useraktif[i].password)
        {
            ada = useraktif[i];
        }
    }
    if (ada == null)
    {
        return res.status(400).send({"msg" :"username atau password salah"} );
    }
    let token = jwt.sign({"username" : ada.username,"isadmin" : ada.is_admin});
});
app.get("/",cekApiKey,function(req,res){
    console.log(req.isUserAktif);
    return res.render("displaymenu",{type:"Indonesian",
        menu:["batagor","rujak","kluntung"]});
});
function cekJWT (req,res,next){
    console.log(req.headers['x-api-key']);
    if(!req.headers["x-api-key"])
    {
        return res.status(401).send({"msg" : "Token tidak ada"});
    }
    let token = req.headers["x-api-token"];
    let user = null;
    try{
        user = jwt.verify(token,process.env.secret);
    }
    catch(ex){
        return res.status(401).send(ex);
    }
    req.user = user;
    next();
}
app.use("/api/pengguna",pengguna);
app.use("/api/resep",resep);
app.use("/api/aksesapi",aksesapi);

app.listen(3000,function () {
    console.log("listening on port 3000");
})