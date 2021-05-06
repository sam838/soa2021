const express = require('express');
const router = express.Router();
const axios = require('axios').default;

router.get("/rates", async function (req,res){
    const hasil = await axios.get("https://api.ratesapi.io/api/latest");
    if (Math.floor(hasil.status/100==2)){
        return res.status(200).send(hasil.data);
    }
    else {
        return res.status(500).send("Error calling rates API");
    }
});

router.get("/usdtoidr", async function (req,res){
    const hasil = await axios.get("https://api.ratesapi.io/api/latest?base=USD&symbols=IDR");
    if (Math.floor(hasil.status/100==2)){
        let asal = req.query.jumlah * hasil.data.rates["IDR"];
        return res.status(200).send({"hasil": asal});
    }
    else {
        return res.status(500).send("Error calling rates API");
    }
});

router.get("/universal", async function (req,res){
    const from = req.query.from;
    const to = req.query.to;

    const hasil = await axios.get("https://api.ratesapi.io/api/latest?base=USD&symbols=IDR");

    if (Math.floor(hasil.status/100==2)){
        let asal = req.query.jumlah * hasil.data.rates[to];
        return res.status(200).send({"hasil": asal});
    }
    else {
        return res.status(500).send("Error calling rates API");
    }
});

router.get("/film", async function (req,res){
    const hasil = await axios.get("http://www.omdbapi.com/?i=tt3896198&apikey=f444c79e");

    if (Math.floor(hasil.status/100==2)){
        return res.status(200).send(hasil.data);
    }
    else {
        return res.status(500).send("Error calling OMDB API");
    }
});


module.exports=router;