const express = require('express');
const app = express();
app.use(express.urlencoded({extended:true}))
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

const pengguna = require('./routes/pengguna');
const resep = require('./routes/resep');
const aksesapi = require('./routes/aksesapi');
const useraktif = [{
    "username" :"admin",
    "password" :"admin",
    "api_key" : "abcde01234"
}]
app.post("/api/register",function (req,res){
    let username = req.body.username;
    let password = req.body.password;
    let userbaru = {
        "username" : username,
        "password" : password,
        "api_key"  : Math.random().toString(36).substr(2,8)
    };
    useraktif.push(userbaru);
    console.log(useraktif);
    return res.status(201).send({"username":userbaru.username,"api_key":userbaru.api_key});
});
app.get("/",cekApiKey,function(req,res){
    console.log(req.isUserAktif);
    return res.render("displaymenu",{type:"Indonesian",
    menu:["batagor","rujak","kluntung"]});
});
function cekApiKey (req,res,next){
    console.log(req.headers['x-api-key']);
    if(!req.headers["x-api-key"])
    {
        return res.status(401).send({"msg" : "Maaf anda tidak boleh mengakses api ini"});
    }
    let apikey = req.headers["x-api-key"];
    let ada = false;
    for (let i=0; i<useraktif.length; i++)
    {
        if (useraktif[i].api_key === apikey)
        {
            ada = true;
        }
    }
    if (ada == false)
    {
        return res.status(400).send("msg : Api key Tidak Ditemukan");
    }
    req.isUserAktif = true;
    next();
}
app.use("/api/pengguna",pengguna);
app.use("/api/resep",resep);
app.use("/api/aksesapi",aksesapi);

app.listen(3000,function () {
    console.log("listening on port 3000");
})