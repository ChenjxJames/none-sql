import { DB } from '..';

const db = new DB('team_cooperation', 'root', '', 'localhost');

let results1 = db.connect('users').where({
  username: 'chen', 
  password: '789'
}).orWhere({
  username: 'nash', 
  password:'908'
}).orderBy({
  username: true
}).get();

results1.then((data: any) => {
  console.log(data);
}).catch((err: any) => {
  console.log(err);
});

// let results2 = db.connect('users').where({ password: '000' }).delete();
// results2.then((data) => {
//   console.log(data);
// }).catch((err) => {
//   console.log(err);
// });

let results3 = db.connect('users').orderBy({password: true, username: false}).get();
results3.then((data: any) => {
  console.log(data);
  db.close();
}).catch((err: any) => {
  console.log(err);
  db.close();
});

// results = db.transaction(() => {

//   db.connect('users').add([
//     {
//       username: 'Chloe',
//       password: '123'
//     },
//     {
//       username: 'Claire',
//       password: '123'
//     }
//   ]);
//   db.connect('users').add([
//     {
//       username: 'ellie',
//       password: '123'
//     },
//     {
//       username: 'jack',
//       password: '123'
//     }
//   ]);

// });

// results = db.connect('users').all();
// results.then((data) => {
//   console.log(data);
//   db.close();
// }).catch((err) => {
//   console.log(err);
//   db.close();
// });