import mysql.connector as mydb


def conn_db():
    '''
    データベースに接続するためのコネクションを作成
    '''
    conn = mydb.connect(
        host='localhost',
        port='3306',
        user='root',
        password='fujita',
        database='mydb'
    )
    return conn


# conn = conn_db()
# corsor = conn.cursor(dictionary=True)
# 
# corsor.execute("INSERT INTO `users`(`name`, `email`, `phone`) VALUES ('test','test@.com','09000000000')")
# corsor.execute("DELETE FROM users where id=12")
# corsor.execute("UPDATE users SET name='tanaka' where id=10")
# conn.commit()
# corsor.execute("SELECT * FROM users")
# rows = corsor.fetchall()
# print(rows)