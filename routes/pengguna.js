const express = require('express');
const router = express.Router();

const arrPengguna = [
    { "id": "admin", "pass": "admin"},
    { "id": "bigboss", "pass": "bigboss"}
];

router.get("/", function (req, res){
    if (req.query.nama) {
        const hasil = [];
        for (let i = 0; i < arrPengguna.length; i++){
            //if (arrPengguna[i].id.includes(req.query.nama)){
            // /g ini mencari semua kemunculan /m [abc]
            //if (arrPengguna[i].id.match("/"+req.query.nama+"/i")){
            if (arrPengguna[i].id.match("["+req.query.nama+"]+")){
                hasil.push(arrPengguna[i])
            }
        }
        if (hasil.length <= 0) {
            return res.status(404).send({"msg":"Not Found"});
        } else {
            return res.status(200).send(hasil);
        }
    } else {
        return res.status(200).send(arrPengguna);
    }
});

router.delete("/:id", function (req, res){
    for (let i = 0; i < arrPengguna.length; i++){
        if (arrPengguna[i].id == req.params.id){
            let hasildel = arrPengguna.splice(i,1)[0];
            return res.status(200).send(hasildel); //langsung keluar dari function setelah data dihapus
        }
    }
    //kalau sampai di sini, berarti tidak ditemukan
    return res.status(484).send({"msg":"Not Found"});
});

module.exports=router;