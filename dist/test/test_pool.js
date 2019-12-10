"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var pool = new __1.Pool('team_cooperation', 'root', '', 'localhost');
var result = pool.getConnection();
result.then(function (connection) {
    var results1 = connection.connect('users').get();
    results1.then(function (data) {
        console.log(data);
    }).catch(function (err) {
        console.log(err);
    });
    pool.close();
}).catch(function (err) {
    console.log(err);
    pool.close();
});
