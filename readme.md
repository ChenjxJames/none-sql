# none-sql
#### MySQL连接中间件
#### 基于npm开源库mysql开发而来，增加了Promise风格的方法，增加了常用的数据库操作的链式调用编程方法。
#### 目的是为了减少手动拼装sql语句

* 创建数据库对象  
    ```javascript
    let db = new DB(database: string, user: string, password: string, host = 'localhost');
    ```

* 关闭数据库连接  
  请在最后的数据库操作返回的promise对象的then/catch方法中调用此方法  
    ```javascript
    db.close();
    ```

* 基本操作  
  * 查——获取users表里所有记录 
    ```javascript 
    db.connect('users').get();  
    ```
    ```javascript
    return Promise<Result> 
    ```
  * 条件查——获取users表里city属性为shanghai的记录   
  .where()参数为条件对象如{ username: 'james', age: 20 }  
  该对象内的条件为且的关系，或请用.where().orWhere()    
    ```javascript
    db.connect('users').where({city: 'shanghai'}).get();  
    ```
    ```javascript
    return Promise<Result>  
    ```
  * 增——向users表里添加若干条记录  
    ```javascript
    db.connect('users').add(any[]);  
    ```
    ```javascript
    return Promise<Result>       
    ```             
  * 删——删除users表里的若干条记录  
    ```javascript
    db.connect('users').where().delete();  
    ```
    ```javascript
    return Promise<Result>          
    ```        
  * 改——更改users表里的若干条记录  
    ```javascript
    db.connect('users').where().update({city: 'shanghai'});
    ```  
    ```javascript
    return Promise<Result>
    ``` 
  * 排序——  
    ```javascript
    db.connect('users').orderBy({password: true, username: false}).get();  
    ```
    ```javascript
    return Promise<Result>  
    ```
  上式含义为按password将结果升序排序，按username将结果降序排序，这里password的优先级高于username

* 事务操作  
    ```javascript
    db.transaction(() => {  
        //对数据库的操作  
        db.connect('users').add(any[]);  
        db.connect('users').where().delete();  
    })
    ```

* 嵌套查询  
    ```javascript
    db.connect('tasks').where({  
        userId: db.connect('users').where({name: 'james'}).get()[0].id  
    })
    ```


