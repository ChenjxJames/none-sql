# none-sql
#### MySQL连接中间件
#### 基于npm开源库mysql开发而来，增加了Promise风格的方法，增加了常用的数据库操作的链式调用编程方法。
#### [附带koa2使用方法](#koa2-mysql)


* 安装
  ```shell
  npm install --save none-sql
  ```

* 引用
  ```javascript
  import { DB, Pool } from 'none-sql';
  ```

* 配置
  ```javascript
    interface IConfig {
      mapUnderscoreToCamelCase: boolean;  // 返回数据字段自动下划线转驼峰，查询数据字段自动驼峰转下划线
    }

    const configDefault: IConfig = {
      mapUnderscoreToCamelCase: false,
    };
  ```

* 创建数据库对象
  ```javascript
  const db = new DB(database: string, user: string, password: string, host = 'localhost', config: IConfig = configDefault);
  ```

* 创建连接池
  ```javascript
  const pool = new Pool(database: string, user: string, password: string, host = 'localhost', connectionLimit = 10, config: IConfig = configDefault);
  ```
  * 获取数据库连接
    ```javascript
    const result = pool.getConnection();
    result.then((connection) => {
      const data = connection.connect('tableName').get();
      connection.connection.release();  // 使用完后将该数据库连接还给连接池
    });
    ```

* 关闭数据库连接  
  请在最后的数据库操作返回的promise对象的then/catch方法中调用此方法  
  ```javascript
  db.close();
  ```

* 基本操作  
  * 查——获取users表里所有记录
    ```javascript
    db.connect('tableName').get();
    ```
    ```javascript
    return Promise<Result>
    ```
  * 条件查——获取users表里city属性为shanghai的记录   
    .where()参数为条件对象如{ username: 'james', age: 20 }  
    该对象内的条件为且的关系，条件为或的关系请用.where().orWhere()
    ```javascript
    db.connect('tableName').where({city: 'shanghai'}).get();
    ```
    ```javascript
    return Promise<Result>
    ```
  * 增——向users表里添加若干条记录
    ```javascript
    db.connect('tableName').add(any[]);
    ```
    ```javascript
    return Promise<Result>
    ```
  * 删——删除users表里的若干条记录
    ```javascript
    db.connect('tableName').where().delete();
    ```
    ```javascript
    return Promise<Result>
    ```
  * 改——更改users表里的若干条记录
    ```javascript
    db.connect('tableName').where().update({city: 'shanghai'});
    ```
    ```javascript
    return Promise<Result>
    ```
  * 排序——
    ```javascript
    db.connect('tableName').orderBy({password: true, username: false}).get();
    ```
    ```javascript
    return Promise<Result>
    ```
  上式含义为按password将结果升序排序，按username将结果降序排序，这里password的优先级高于username

* 事务操作
  ```javascript
  db.transaction(() => {
      //对数据库的操作
      db.connect('tableName').add(any[]);
      db.connect('tableName').where().delete();
  })
  ```

* 嵌套查询
  ```javascript
  db.connect('tableName1').where({
      userId: db.connect('tableName2').where({name: 'james'}).get()[0].id
  })
  ```

* 执行自定义sql语句
  ```javascript
  let sql = 'SELECT * FROM ?? WHERE ??=?';
  db.query(sql,['users','name','james']);
  ```
  相当于执行了
  ```SQL
  SELECT * FROM `users` WHERE `name`="james"
  ```
  ?? 会自动在参数两侧添加反引号``  
  ?  会自动在参数两侧添加双引号""

* <span id="koa2-mysql">在koa2中使用</span>  
  入口文件  
  index.ts
  ```javascript
  import { Pool } from 'none-sql';

  const pool = new Pool(database: string, user: string, password: string, host = 'localhost', connectionLimit = 10);

  app.use(
    async (ctx: any, next: any) => {
      ctx.request.db = await pool.getConnection();
      await next();
      ctx.request.db.connection.release();
    }
  );
  ```
  请求处理文件  
  contorller.ts
  ```javascript
  login = async (ctx: any) => {
    let result = (await ctx.request.db.connect('tableName').get())
    result.then((data) => {
      console.log(data);
    }).catch((err) => {
      console.error(err);
    });
  }
  ```

