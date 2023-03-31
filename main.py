from flask import Flask, render_template, request
from mysql_connector import conn_db

app = Flask(__name__)

# 
@app.route('/get_users', methods=["GET"])
def get_users():
    sql = 'SELECT * FROM users' # SQL文を定義
    result = {}
    try:
        conn = conn_db() # データベースに接続
        cursor = conn.cursor(dictionary=True) #カーソルを取得
        cursor.execute(sql)  # selectを投げる
        rows = cursor.fetchall()  # selectの結果を全件タプルに格納
        result['users'] = rows
        result['message'] = 'OK'
    except Exception as e:
        result['message'] = 'NG'
        result['error'] = str(e) #エラー内容を出力
    return result

# adduserからユーザの追加を行う
@app.route('/add',methods=['POST'])
def add():
    if request.method == 'POST':
        print("test-1")
        sql = 'INSERT INTO users (name, email, phone) VALUES (%s, %s ,%s)' # SQL文を定義
        result = {}
        name = request.form['name'] #入力されたNameを取得
        email = request.form['email'] #入力されたEmailを取得
        phone = request.form['phone'] #入力されたPhoneを取得
        try:
            conn = conn_db() # データベースに接続
            cursor = conn.cursor(dictionary=True) #カーソルを取得
            cursor.execute(sql, (name, email, phone, )) #INSERTを投げる
            conn.commit() #データベースへ反映
            conn.close() #データベースを閉じる
            result['message'] = 'OK'
        except Exception as e:
            result['message'] = 'NG'
            result['error'] = str(e) #エラー内容を出力
    return result

# DELETE
@app.route('/delete/<user_id>',methods=["DELETE"]) #user_idを取得
def delete(user_id):
    if request.method == 'DELETE':
        sql = 'DELETE FROM users where id = %s' # SQL文を定義
        result = {}
        try:
            conn = conn_db() # データベースに接続
            cursor = conn.cursor(dictionary=True) #カーソルを取得
            cursor.execute(sql, (user_id, )) #DELETEを投げる
            conn.commit() #データベースへ反映
            conn.close() #データベースを閉じる
            result['message'] = 'OK'
        except Exception as e:
            result['message'] = 'NG'
            result['error'] = str(e) #エラー内容を出力
    return result

# Home -> update_userページ呼び出し
@app.route('/users/<user_id>',methods=["GET"])
def get_user(user_id):
    sql = 'SELECT * FROM users where id = %s' # SQL文を定義
    result = {}
    try:
        conn = conn_db() # データベースに接続
        cursor = conn.cursor(dictionary=True) #カーソルを取得
        cursor.execute(sql, (user_id, )) #SELECTを投げる
        rows = cursor.fetchone() 
        result['user'] = rows
        result['message'] = 'OK'
    except Exception as e:
        result['message'] = 'NG'
        result['error'] = str(e) #エラー内容を出力
    return render_template('update_user.html', result=result) #UPDATEページ呼び出し

# update
@app.route('/update/<user_id>',methods=["PUT"])
def update(user_id):
    if request.method == 'PUT':
        sql = 'UPDATE users SET name=%s, email=%s, phone=%s where id=%s' # SQL文を定義
        result = {}
        name = request.form['name'] #入力されたNameを取得
        email = request.form['email'] #入力されたEmailを取得
        phone = request.form['phone'] #入力されたPhoneを取得
        try:
            conn = conn_db() # データベースに接続
            cursor = conn.cursor(dictionary=True) #カーソルを取得
            cursor.execute(sql, (name, email, phone, user_id,)) #UPDATEを投げる
            conn.commit() #データベースへ反映
            conn.close() #データベースを閉じる
            result['message'] = 'OK'
        except Exception as e:
            result['message'] = 'NG'
            result['erorr'] = str(e) #エラー内容を出力
    return result


# indexの呼び出し
@app.route('/')
def index():
    return render_template('index.html')

# add_userの呼び出し
@app.route('/add_user')
def add_user():
    return render_template('add_user.html')

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)

