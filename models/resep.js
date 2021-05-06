const express = require('express');
const router = express.Router();
const mysql = require('mysql');
//resep         id(nvarchar 3), name(nvarchar MAX), type(nvarchar 10),  jumlah(int)

const pool = mysql.createPool({host:"localhost", database:"dbresep", user:"root", password:""});

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

async function findById(id) {
    const conn = await getConn();
    const query = `select * from resep where id='${id}'`;
    const result = executeQuery(conn, query);
    conn.release();
    if (result.length > 0)
        return result[0];
    else
        return null;
}

async function insert(namaresep, typeresep, jumlah) {
    const conn = await getConn();
    const query = `INSERT INTO resep (name,type,jumlah) VALUES ('${namaresep}','${typeresep}', ${jumlah})`;
    const result = executeQuery(conn, query);
    conn.release();
    return await findById(result.insertId);
}

async function update(id, namaresep, typeresep, jumlah) {
    const conn = await getConn();
    const query = `UPDATE resep SET name='${namaresep}', type='${typeresep}', jumlah=${jumlah} where id =${id})`;
    const result = executeQuery(conn, query);
    conn.release();
    return await findById(id);
}

module.exports={
    "findById": findById,
    "insert": insert,
    "update": update
}

