$(function () {

  /** 
   * アラートメッセージを表示
   * @param message メッセージDOM
   * @param messageId メッセージに付与されているID属性名（alert-success or alert-danger）
  */
  const showAlertMessage = (message, messageId) => {
    $('#messageArea').append(message);
    $(messageId).delay(3000).fadeOut(500, function() {
      $(this).remove()
    });
  }

  /** 
   * ユーザテーブルに１行追加
   * @param user ユーザ情報
  */
  const addUser = (user) => {
    var row = '<tr><td>' + user.id + `</td><td><a href="/users/${user.id}" class='text-decoration-none'>` + 
      user.name + '</a></td><td>' + user.email + '</td><td>' + user.phone + '</td><td>' + 
      `<button class="deleteButton" id="${user.id}"  class='text-decoration-none'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash pe-none" viewBox="0 0 16 16">
      <path class="pe-none" d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
      <path class="pe-none" fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
      </svg></button>` + '</td></tr>';
    $('#users-table-body').append(row);  
  }

  /** 
   * ユーザ削除
   * @param event クリック時イベント
  */
  const deleteUser = (event) => {
    const user_id = event.target.id;
    const result = confirm(`ID: ${user_id} のユーザ情報を削除します。\n本当によろしいですか？`);
    if (result) {
    // POSTリクエストを送信
    $.ajax({
      url: `/delete/${user_id}`,
      type: 'delete',
    })
    .done(function (response) {
      // 成功時の処理
      if (response.message == 'OK') {
        sessionStorage.setItem('message', 'ユーザ情報を削除しました！！')
        window.location.href = '/';
      } else if (response.message == 'NG') {
        const failMessage = '<div id="alert-danger" class="alert alert-danger" role="alert">' + `ユーザ削除に失敗しました！！\n${response.error}` + '</div>'
        showAlertMessage(failMessage, "#alert-danger")  
      }
    })
    .fail(function (xhr) {
      //通信失敗時の処理
      //失敗したときに実行したいスクリプトを記載
      const failMessage = '<div id="alert-danger" class="alert alert-danger" role="alert">' + `ユーザ削除に失敗しました！！` + '</div>'
      showAlertMessage(failMessage, "#alert-danger")  
    })
    .always(function (xhr, msg) {
      //通信完了時の処理
      //結果に関わらず実行したいスクリプトを記載
    });
    }
  }

  /** 
   * 初期表示
  */
  if (location.pathname == '/') {
    const message = sessionStorage.getItem('message')
    if (message) {
      const successMessage = '<div id="alert-success" class="alert alert-success" role="alert">' + message + '</div>'
      showAlertMessage(successMessage, '#alert-success')
      sessionStorage.removeItem('message')
    }

    $.ajax({
      url: '/get_users', //アクセスするURL
      type: 'get',      //post or get
      cache: true,           //cacheを使うか使わないかを設定
      dataType: 'json',        //data type script・xmlDocument・jsonなど
    })
    .done(function (response) {
      //通信成功時の処理
      if (response.message == 'OK') {
        const users = response.users
        $.each(users, function (index, user) {
          addUser(user)
        });
        $('.deleteButton').on('click', deleteUser);
      } else if (response.message == 'NG') {
        const failMessage = '<div id="alert-danger" class="alert alert-danger" role="alert">' + `ユーザ情報取得に失敗しました！！\n${response.error}` + '</div>'
        showAlertMessage(failMessage)
      }
      //成功したとき実行したいスクリプトを記載
    })
    .fail(function (xhr) {
      //通信失敗時の処理
      //失敗したときに実行したいスクリプトを記載
      const failMessage = '<div id="alert-danger" class="alert alert-danger" role="alert">' + `ユーザ情報取得に失敗しました！！` + '</div>'
      showAlertMessage(failMessage)
  
    })
    .always(function (xhr, msg) {
      //通信完了時の処理
      //結果に関わらず実行したいスクリプトを記載
    });
  }


  /** 
   * ユーザ追加ボタンクリック時イベント
  */  
  $('#addForm').submit(function (event) {
    event.preventDefault(); // フォーム送信をキャンセル
    console.log('test1');
    // フォームの値を取得
    var name = $('#name').val();
    var email = $('#email').val();
    var phone = $('#phone').val();

    // POSTリクエストを送信
    $.ajax({
      url: '/add',
      type: 'POST',
      data: { name: name, email: email, phone: phone }
    })
    .done(function (response) {
      console.log("test2");
      // 成功時の処理
      if (response.message == 'OK') {
        sessionStorage.setItem('message', 'ユーザを追加しました！！')        
        window.location.href = '/';
      } else if (response.message == 'NG') {
        const failMessage = '<div id="alert-danger" class="alert alert-danger" role="alert">' + `ユーザ追加に失敗しました！！\n${response.error}` + '</div>'
        showAlertMessage(failMessage, "#alert-danger")  
      }
    })
    .fail(function (xhr) {
      console.log("test3");
      //通信失敗時の処理
      //失敗したときに実行したいスクリプトを記載
      const failMessage = '<div id="alert-danger" class="alert alert-danger" role="alert">' + `ユーザ追加に失敗しました！！\n` + '</div>'
      showAlertMessage(failMessage, "#alert-danger")  

    })
    .always(function (xhr, msg) {
      //通信完了時の処理
      //結果に関わらず実行したいスクリプトを記載
    });
    // ここで、取得した値をサーバーに送信したり、他の処理を行うことができます。
  });


  /** 
   * ユーザ更新ボタンクリック時イベント
  */  
  $('#updateForm').submit(function (event) {
    event.preventDefault(); // フォーム送信をキャンセル

    // フォームの値を取得
    var name = $('#name').val();
    var email = $('#email').val();
    var phone = $('#phone').val();
    let path = $(location).attr('pathname');
    let pathList = path.split("/").filter(e => Boolean(e));    
    const user_id = pathList[pathList.length - 1];    

    // POSTリクエストを送信
    $.ajax({
      url: `/update/${user_id}`,
      type: 'put',
      data: { name: name, email: email, phone: phone }
    })
    .done(function (response) {
      // 成功時の処理
      if (response.message == 'OK') {
        sessionStorage.setItem('message', 'ユーザ情報を更新しました！！')        
        window.location.href = '/';
      } else if (response.message == 'NG') {
        const failMessage = '<div id="alert-danger" class="alert alert-danger" role="alert">' + `ユーザ更新に失敗しました！！\n${response.error}` + '</div>'
        showAlertMessage(failMessage, '#alert-danger')  
      }
    })
    .fail(function (xhr) {
      //通信失敗時の処理
      //失敗したときに実行したいスクリプトを記載
      const failMessage = '<div id="alert-danger" class="alert alert-danger" role="alert">' + `ユーザ更新に失敗しました！！` + '</div>'
      showAlertMessage(failMessage, "#alert-danger")  
    })
    .always(function (xhr, msg) {
      //通信完了時の処理
      //結果に関わらず実行したいスクリプトを記載
    });
    // ここで、取得した値をサーバーに送信したり、他の処理を行うことができます。
  });


})
