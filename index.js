const qr2 = require("qrcode");
const express = require("express");
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const Excel = require("exceljs");
const fs = require("fs");
const { fileURLToPath } = require('url');
const { dirname } = require('path');
const { exit } = require("process");


const app = express()
app.use(express.urlencoded({ extended: true }));
const port = 3000


const __filenameCommonJS = __filename;  // Use __filename directly
const __dirnameCommonJS = dirname(__filenameCommonJS);

// Maintain a record of interacted users
const interactedUsers = {};

app.get("/auth/:phoneNumber", async (req, res) => {

  const phoneNumber = req.params.phoneNumber;
  const qrCode = await generateQRCode(phoneNumber);
  console.log(phoneNumber);
  try {

    console.log(qrCode);
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
    <title>WhatsApp</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">
    <style>
    body,h1 {font-family: "Raleway", sans-serif}
    body, html {height: 100%}
    .bgimg {
      background-image: url('https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-cool-dark-green-new-theme-whatsapp.jpg');
      min-height: 100%;
      background-position: center;
      background-size: cover;
    }
    </style>
    </head>
    <body>
    
    <div class="bgimg w3-display-container w3-animate-opacity w3-text-white">
    <div class="w3-display-topleft w3-padding-large w3-xlarge">
    WhatsAPP_BOT
    </div>
    <div class="w3-display-middle">
    <center>
    <h2  class="w3-jumbo w3-animate-top">QRCode Generated</h2>
    
    <hr class="w3-border-grey" style="margin:auto;width:40%">
    <p class="w3-center"><div><img src='${qrCode}'/></div></p>
    </center>
    </div>
    <div class="w3-display-bottomleft w3-padding-large">
    Powered by <a href="/" target="_blank">WhatsAPP_BOT</a>
    </div>
    </div>
    
    </body>
    </html>
    
    `);
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).send("Internal Server Error");
  }

});



async function generateQRCode(phoneNumber) {
  return new Promise(async (resolve, reject) => {
    const client = new Client({
      authStrategy: new LocalAuth({
        clientId: `session-${phoneNumber}`
      }),
      puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });


    // Event handler for the QR code
    client.on("qr", async (qrCode) => {
      qrcode.generate(qrCode, { small: true });
      let src;
      try {
        src = await new Promise((resolve, reject) => {
          qr2.toDataURL(qrCode, (err, dataUrl) => {
            if (err) reject(err);
            else resolve(dataUrl);
          });
        });
        resolve(src);
      } catch (err) {
        console.error("Error generating QR code:", err);
        reject(err);
      }
    });


    // Event handler for client readiness
    client.on("ready", () => {
      console.log("Client is ready!")
      
    });

    // Initialize the client
    client.initialize();
    let address = "bahtim"
    client.on("message", async (message) => {
      const userNumber = message.from;
      if (!interactedUsers[userNumber]) {
        await message.reply(`اهلا بحضرتك ي فندم 
        فريق **كابتن مريم صلاح** مع حضرتك 
        برجاء ارسال رقم الخدمه المطلوبه 
        (1) تمرين كاراتيه للاطفال مع رجاء ارسال العنوان للوصول ل اقرب فرع
        (2) متابعه تغذيه اونلاين ومعرفه التفاصيل
        (3) التواصل مع كابتن مريم شخصيا بسبب وجود استفسار او مشكله ضروريا 
        (0) لمعرفة العنواين الخاصه بنا 
        شكراً للتواصل يفندم فريق العمل هيرد عليك حالا`);
        interactedUsers[userNumber] = true;
      } else {
        switch (message.body) {
          case "1": await message.reply(`برجاء ارسال العنوان`); break;
          case "2": await message.reply(`**تفاصيل متابعه التغذيه**
          (4) مكالمه مع كابتن مريم بعد دفع الاشتراك وملئ الفورم
          (5) متابعه يوميه مع تصوير الاكل علي واتساب
          (6) تغير النظام الغذائي كل ١٥ يوم
           سعر الاشتراك اول مره 250ج
           كل اسبوعين 100`); break;
         case "3": await message.reply(`سيب استفسار حضرتك وسوف يتم الرد عليك من قبل كابتن مريم`); break;
         case "4": await message.reply(`رجاء الانتظار وسوف بتم التواصل معك وارسال تفاصيل الاشتراك ولينك الفورم`); break;
         case "5": await message.reply(`سوف يتم ارسال التفاصيل كامله برجاء الانتظار`); break;
         case "6": await message.reply(`الدفع عن طريق خدمة فودافون كاش رقم الدفع 01067552685`); break;
         case "0": await message.reply(`${address}`); break;
          case "add": {
            client.on('message_create', async (msg) => {
              if (msg.from === '201004718732@c.us') {
                if (msg.body.startsWith('Address:')) {
                  address = msg.body.substring(msg.body.indexOf(" ") + 1)
                }
              }
            })
            break;
          }

        }
      }
    });
  });
}


app.post("/submit", (req, res) => {
  console.log(req.body);
  const phoneNumber = req.body.phoneNumber;
  res.redirect("/auth/" + phoneNumber);
});
app.get("/", (req, res) => {
  res.sendFile(__dirnameCommonJS + "/main.html");
});
app.listen(port, function () {
  console.log("app listening on port " + port + "!");
});