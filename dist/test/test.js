"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var db = new __1.DB('team_cooperation', 'root', '', 'localhost');
var results1 = db.connect('users').where({
    username: 'chen',
    password: '789'
}).orWhere({
    username: 'nash',
    password: '908'
}).orderBy({
    username: true
}).get();
results1.then(function (data) {
    console.log(data);
}).catch(function (err) {
    console.log(err);
});
var results3 = db.connect('users').orderBy({ password: true, username: false }).get();
results3.then(function (data) {
    console.log(data);
    db.close();
}).catch(function (err) {
    console.log(err);
    db.close();
});
