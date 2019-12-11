import { DB, Pool } from '../src/index';
import { updateExpression } from '@babel/types';

declare global {
  namespace jest {
    interface Matchers<R, T> {
      toBeGetData(): R;
    }
  }
}

expect.extend({
  async toBeGetData(received) {
    if (received.flag && received.info.length) {
      return {
        message: () =>
          `pass`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `not pass`,
        pass: false,
      };
    }
  },
});



describe('my DB', () => {
  const db = new DB('team_cooperation', 'root', '', 'localhost');
  test('get function test', async () => {
    const result = await db.connect('users').get();
    expect(result).toBeGetData();
  });

  test('orderBy function test', async () => {
    const result = await db.connect('users').orderBy({username: true, password: false}).get();
    expect(result).toBeGetData();
  });

  test('where function test', async () => {
    const result = await db.connect('users').where({username: 'nash789'}).orWhere({username: 'nash456'}).orderBy({username: true, password: false}).get();
    expect(result).toBeGetData();
  });

  test('get and orderBy and where function test', async () => {
    const result = await db.connect('users').where({username: 'nash789'}).orWhere({username: 'nash456'}).orderBy({username: true, password: false}).get();
    expect(result).toBeGetData();
  });

  test('add function test', async () => {
    await db.connect('users').add([{username: 'chenjx123', password: '123'}]);
    const result = await db.connect('users').where({username: 'chenjx123', password: '123'}).get();
    expect(result).toBeGetData();
  });

  test('update function test', async () => {
    await db.connect('users').where({username: 'chenjx123'}).update({password: '123456'});
    const result = await db.connect('users').where({username: 'chenjx123', password: '123456'}).get();
    expect(result).toBeGetData();
  });

  // test('transaction function test', async () => {
  //   try {
  //     db.transaction(async () => {
  //       await db.connect('users').add([{username: 'chenjx1', password: '123'}]);
  //       await db.connect('users').add([{username: 'chenjx123', password: '123456'}]);
  //     });
  //   } catch (err) {
  //     expect(err.flag).toBeFalsy();
  //   }
  //   try {
  //     db.transaction(async () => {
  //       await db.connect('users').add([{username: 'chenjx2', password: '123'}]);
  //       await db.connect('users').add([{username: 'chenjx3', password: '124'}]);
  //     });
  //   } catch (err) {
  //     expect(err.flag).toBeFalsy();
  //   }
  //   const result1 = await db.connect('users').where({username: 'chenjx1', password: '123'}).get();
  //   const result2 = await db.connect('users').where({username: 'chenjx123', password: '123'}).get();
  //   const result3 = await db.connect('users').where({username: 'chenjx2', password: '123'}).get();
  //   const result4 = await db.connect('users').where({username: 'chenjx3', password: '124'}).get();
  //   expect(result1.info).not.toBeGetData();
  //   expect(result2.info).not.toBeGetData();
  //   expect(result3.info).toBeGetData();
  //   expect(result4.info).toBeGetData();
  // });

  test('delete function test', async () => {
    await db.connect('users').where({username: 'chenjx1'}).delete();
    await db.connect('users').where({username: 'chenjx2'}).delete();
    await db.connect('users').where({username: 'chenjx3'}).delete();
    await db.connect('users').where({username: 'chenjx123', password: '123456'}).delete();
    const result = await db.connect('users').where({username: 'chenjx123', password: '123456'}).get();
    expect(result).not.toBeGetData();
    db.close();
  });
});


describe('my Pool', () => {
  const pool = new Pool('team_cooperation', 'root', '', 'localhost', 20);
  test('get and orderBy and where function test', async () => {
    const connection = await pool.getConnection();
    const result = await connection.connect('users').where({username: 'nash789'}).orWhere({username: 'nash456'}).orderBy({username: true, password: false}).get();
    expect(result).toBeGetData();
    connection.connection.release();
  });

  test('add function test', async () => {
    const connection = await pool.getConnection();
    await connection.connect('users').add([{username: 'chenjx0', password: '123'}]);
    const result = await connection.connect('users').where({username: 'chenjx0', password: '123'}).get();
    expect(result).toBeGetData();
    connection.connection.release();
  });

  test('update function test', async () => {
    const connection = await pool.getConnection();
    await connection.connect('users').where({username: 'chenjx0'}).update({password: '123456'});
    const result = await connection.connect('users').where({username: 'chenjx0', password: '123456'}).get();
    expect(result).toBeGetData();
    connection.connection.release();
  });

  test('delete function test', async () => {
    const connection = await pool.getConnection();
    await connection.connect('users').where({username: 'chenjx0', password: '123456'}).delete();
    const result = await connection.connect('users').where({username: 'chenjx0', password: '123456'}).get();
    expect(result).not.toBeGetData();
    connection.connection.release();
    pool.close();
  });

});