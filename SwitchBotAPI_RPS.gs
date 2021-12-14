function script1(){
  autoRPS(arguments.callee.name,5, 56);
}
function script2(){
  autoRPS(arguments.callee.name,6, 56);
}
function script3(){
  autoRPS(arguments.callee.name,7, 33);
}
function script4(){
  autoRPS(arguments.callee.name,7, 56);
}

function autoRPS(fnName, hours, minutes) {
  //パラメーターを設定する。
  let coreUrl = 'https://api.switch-bot.com'
  let token = '';
  let deviceID = '';
  let url = coreUrl+'/v1.0/devices/'+deviceID+'/commands';

  //ボタンの色をランダムで設定する。
  let buttonColors=['blue','red','green'];       //グー, チョキ, パー
  let sendButton = buttonColors[Math.floor(Math.random()*buttonColors.length)];
  console.log(sendButton);
  
  // API連携情報設定
  payload = {
    "command": sendButton, // the name of the customized button
    "parameter": "default",
    "commandType": "customize"
  };
  headers = {
    'Authorization': token,
    'Content-Type': 'application/json,charset=utf8'
  };
  let options = {
    'method': 'get',
    'headers': headers,
    'payload': JSON.stringify(payload)
  };

  // 90秒間で18回 APIでテレビにボタン情報を送る。
  for(let i = 0; i < 18; i++){
      let response = UrlFetchApp.fetch(url, options).getContentText();
      console.log(new Date + response)
      Utilities.sleep(5000);
  }

  // 使用したトリガーを削除
  let triggers = ScriptApp.getProjectTriggers();
  for(let trigger of triggers) if(trigger.getHandlerFunction()==fnName) ScriptApp.deleteTrigger(trigger);

  // 1日後の同じ時間にトリガーを設定
  let rpsTime = new Date();
  rpsTime.setDate(rpsTime.getDate()+1);
  rpsTime.setHours(hours);
  rpsTime.setMinutes(minutes);
  ScriptApp.newTrigger(fnName).timeBased().at(rpsTime).create();
}