import { DB, Pool } from '..';

const pool = new Pool('team_cooperation', 'root', '', 'localhost');

let result = pool.getConnection();
result.then((connection) => {
  let results1 = connection.connect('users').get();
  results1.then((data: any) => {
    console.log(data);
  }).catch((err: any) => {
    console.log(err);
  });
  pool.close();
}).catch((err) => {
  console.log(err);
  pool.close();
});

  
  