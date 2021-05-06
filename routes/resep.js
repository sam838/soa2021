const express = require('express');
const router = express.Router();

//const dosenModel = require("./../models/dosen");
const resepModel = require("./../models/resep");
const multer = require("multer");

const fs = require('fs')
const storage = multer.diskStorage(
    {
        destination:function(req,file,callback) {
            callback(null, "./uploads");
        },
        filename:function (req, file, callback) {
            const filename = file.originalname.split(".");
            const extension = filename[filename.length-1];
            callback(null, Date.now()+"."+extension);
        }

    }
);
const uploads = multer({storage:storage});

//const mysql = require('mysql');
//resep         id(nvarchar 3), name(nvarchar MAX), type(nvarchar 10),  jumlah(int)

//const pool = mysql.createPool({host:"localhost", database:"dbresep", user:"root", password:""});
/*
function getConn(){
    return new Promise(function(resolve,reject){
       pool.getConnection(function (err, connection){
          if (err){
              reject(err);
          } else {
              resolve(connection);
          }
       });
    });
}

function executeQuery(conn,q)  {
    return new Promise(function(resolve,reject){
        conn.query(q,function (err, result) {
            if (err){
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
*/

router.get("/", async function f(req, res){
    try{
        const conn = await getConn();
        let perintah = "";
        if (req.query.id) {
            perintah = `select * from resep where id=${req.query.id}`;
        } else {
            perintah = 'select * from resep';
        }
        const hasil = await executeQuery(conn, perintah);
        conn.release();
        return res.status(200).send(hasil);
    }
    catch (ex){
        return res.status(500).send(ex);
    }
});

router.post("/",uploads.single("foto"), async function(req,res){
    const nama = req.body.name;
    const type = req.body.type;
    const jumlah = req.body.jumlah;
    try {
        return res.status(201).send(await resepModel.insert(nama,type,jumlah));
    }
    catch (ex) {
        return res.status(500).send(ex);
    }
});

router.put('/:id',uploads.single("foto"),async function (req,res) {


    try {
        let hasilresep = await resepModel.findbyid(req.params.id);
        let namafilelama = "a.jpg"
        fs.unlinkSync(`./uploads/${namafilelama}`); // hapus file foto lama did folder uploads
        // return res.send("a")
        let namafilefotobaru =req.file.filename;//mestinya namafilefotobaru di update ke tabel resep
        return res.status(200).send(await resepModel.insert(req.body.nama,req.body.type,req.body.jumlah))

    } catch (ex) {
        return res.status(500).send(ex);
    }

});

module.exports = router;
