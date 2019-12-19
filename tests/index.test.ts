import { DB, Pool } from '../src/index';

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

var db;
var pool;

beforeAll(() => {
  db = new DB('none-sql', 'root', '', 'localhost'); 
  pool = new Pool('none-sql', 'root', '', 'localhost', 20);
  db.connect('user').add([{username:'chenjx01',password: '123'},{username:'chenjx02',password: '123'}]);
});

afterAll(() => {
  db.connect('user').where({password: '123'}).orWhere({password: '123456'}).delete();
  db.close();
  pool.close();
});

describe('my DB', () => {
  test('get function test', async () => {
    const result = await db.connect('user').get();
    expect(result).toBeGetData();
  });

  test('orderBy function test', async () => {
    const result = await db.connect('user').orderBy({username: true, password: false}).get();
    expect(result).toBeGetData();
  });

  test('where function test', async () => {
    const result = await db.connect('user').where({username: 'chenjx01'}).orWhere({username: 'chenjx02'}).orderBy({username: true, password: false}).get();
    expect(result).toBeGetData();
  });

  test('get and orderBy and where function test', async () => {
    const result = await db.connect('user').where({username: 'chenjx01'}).orWhere({username: 'chenjx02'}).orderBy({username: true, password: false}).get();
    expect(result).toBeGetData();
  });

  test('add function test', async () => {
    await db.connect('user').add([{username: 'chenjx123', password: '123'}]);
    const result = await db.connect('user').where({username: 'chenjx123', password: '123'}).get();
    expect(result).toBeGetData();
  });

  test('update function test', async () => {
    await db.connect('user').where({username: 'chenjx123'}).update({password: '123456'});
    const result = await db.connect('user').where({username: 'chenjx123', password: '123456'}).get();
    expect(result).toBeGetData();
  });

  test('transaction function test', async () => {
    try {
      await db.transaction(async () => {
        await db.connect('user').add([{username: 'chenjx1', password: '123'}]);
        await db.connect('user').add([{username: 'chenjx123', password: '123456'}]);
      });
    } catch (err) {
      expect(err.flag).toBeFalsy();
    }
    try {
      await db.transaction(async () => {
        await db.connect('user').add([{username: 'chenjx2', password: '123'}]);
        await db.connect('user').add([{username: 'chenjx3', password: '123'}]);
      });
    } catch (err) {
      expect(err.flag).toBeFalsy();
    }
    const result1 = await db.connect('user').where({username: 'chenjx1', password: '123'}).get();
    const result2 = await db.connect('user').where({username: 'chenjx123', password: '123456'}).get();
    const result3 = await db.connect('user').where({username: 'chenjx2', password: '123'}).get();
    const result4 = await db.connect('user').where({username: 'chenjx3', password: '123'}).get();
    expect(result1).not.toBeGetData();
    expect(result2).toBeGetData();
    expect(result3).toBeGetData();
    expect(result4).toBeGetData();
  });

  test('delete function test', async () => {
    await db.connect('user').where({username: 'chenjx123'}).delete();
    const result = await db.connect('user').where({username: 'chenjx123'}).get();
    expect(result).not.toBeGetData();
  });
});


describe('my Pool', () => {
  test('get and orderBy and where function test', async () => {
    const connection = await pool.getConnection();
    const result = await connection.connect('user').where({username: 'chenjx01'}).orWhere({username: 'chenjx02'}).orderBy({username: true, password: false}).get();
    expect(result).toBeGetData();
    connection.connection.release();
  });

  test('add function test', async () => {
    const connection = await pool.getConnection();
    await connection.connect('user').add([{username: 'chenjx0', password: '123'}]);
    const result = await connection.connect('user').where({username: 'chenjx0', password: '123'}).get();
    expect(result).toBeGetData();
    connection.connection.release();
  });

  test('update function test', async () => {
    const connection = await pool.getConnection();
    await connection.connect('user').where({username: 'chenjx0'}).update({password: '123456'});
    const result = await connection.connect('user').where({username: 'chenjx0', password: '123456'}).get();
    expect(result).toBeGetData();
    connection.connection.release();
  });

  test('delete function test', async () => {
    const connection = await pool.getConnection();
    await connection.connect('user').where({username: 'chenjx0', password: '123456'}).delete();
    const result = await connection.connect('user').where({username: 'chenjx0', password: '123456'}).get();
    expect(result).not.toBeGetData();
    connection.connection.release();
  });

});