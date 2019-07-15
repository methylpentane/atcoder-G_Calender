function myFunction() {
  // メール検索
  var query = 'from:noreply@atcoder.jp is:unread';
  var threads = GmailApp.search(query,0,3);
  
  //thread foreach
  if (threads.length !== 0){
    threads.forEach(function(thread, i, array){
      //既読にしときますね。
      thread.markRead();
      
      var messages = thread.getMessages();
      
      //message foreach
      //atcoderコンテストページ(複数の可能性もある)から日時やその他情報を取得
      messages.forEach(function(message, i, array){
        body = message.getBody();
        contestPageUrls = body.match(/https:\/\/atcoder.jp\/contests\/.*/g);
        
        //contestpage foreach
        contestPageUrls.forEach(function(contestPageUrl, i, array){
          var response = UrlFetchApp.fetch(contestPageUrl);
          var html = response.getContentText('UTF-8');
          dates = html.match(/\d{4}-\d{2}-\d{2}[\sT]\d{2}:\d{2}:\d{2}(?:[\+-]\d{2}\d{2}|Z)/g);
          title = contestPageUrl.match(/https:\/\/atcoder.jp\/contests\/(.*)/)[1];
          
          //情報からカレンダーに予定を作成
          startDate = new Date(dates[0].replace(/\s/,'T'));
          endDate = new Date(dates[1].replace(/\s/,'T'));
          
          Logger.log(title);
          Logger.log(dates);Logger.log(title);
          Logger.log(startDate);
          Logger.log(endDate);
          
          var myCalender = CalendarApp.getCalendarById('your gmail');
          var eventId = myCalender.createEvent(title,startDate,endDate,{description: body}).getId();
          var event = myCalender.getEventById(eventId);
          event.setColor(CalendarApp.EventColor.MAUVE);
          event.addPopupReminder(30);
          event.addPopupReminder(60);
          
          //LINE Notifyへの通知送信 やりたければどうぞ
          //sendHttpPost("\n" + body);
          //同じノリでslackとかにも
        });
      });
    });
  }
}

function sendHttpPost(message){
  var token = "your access token";
  var options =
   {
     "method"  : "post",
     "payload" : "message=" + message,
     "headers" : {"Authorization" : "Bearer "+ token}

   };

   UrlFetchApp.fetch("https://notify-api.line.me/api/notify",options);
}