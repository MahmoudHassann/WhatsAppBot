const qr2 = require("qrcode");
const express = require("express");
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const Excel = require("exceljs");
const fs = require("fs");
const { fileURLToPath } = require('url');
const { dirname } = require('path');

const app = express()
app.use(express.urlencoded({ extended: true }));
const port = 3000


const __filenameCommonJS = __filename;  // Use __filename directly
const __dirnameCommonJS = dirname(__filenameCommonJS);

// Maintain a record of interacted users
const interactedUsers = {};
/*const excelFilePath = "./chat_history.xlsx";
let workbook = new Excel.Workbook();

async function initializeExcel() {
  try {
    workbook = await Excel.read.readFile(excelFilePath);
  } catch (error) {
    workbook = new Excel.Workbook();
    workbook.addWorksheet("Chat History").columns = [
      { header: "Timestamp", key: "timestamp", width: 20 },
      { header: "User", key: "user", width: 20 },
      { header: "Message", key: "message", width: 50 },
    ];
    await workbook.xlsx.writeFile(excelFilePath);
  }
}

async function logChatHistory(userNumber, message) {
  const timestamp = new Date().toLocaleString();
  const worksheetName = "Chat History";

  // Check if the worksheet already exists, otherwise create a new one
  let worksheet = workbook.getWorksheet(worksheetName);
  if (!worksheet) {
    workbook.addWorksheet(worksheetName).columns = [
      { header: "Timestamp", key: "timestamp", width: 20 },
      { header: "User", key: "user", width: 20 },
      { header: "Message", key: "message", width: 50 },
    ];
    worksheet = workbook.getWorksheet(worksheetName);
  }

  // Add a new row to the worksheet
  const newRow = worksheet.addRow({ timestamp, user: userNumber, message });

  // Save the workbook after adding the new row
  await workbook.xlsx.writeFile(excelFilePath);

  // Example: Read and log all messages in the updated worksheet
  workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(excelFilePath);

  const updatedWorksheet = workbook.getWorksheet(worksheetName);
  updatedWorksheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
    const rowData = row.values;
    console.log(`Row ${rowNumber}: ${rowData[1]} - ${rowData[2]} - ${rowData[3]}`);
  });
} */






app.get("/auth/:phoneNumber", (req, res) => {
  let count = []
  const phoneNumber = req.params.phoneNumber;
  console.log(phoneNumber);
  const client = new Client({
    authStrategy: new LocalAuth({
      clientId: `session-${phoneNumber}`
    }),
  });
  client.on("message", async (message) => {
    const userNumber = message.from;
    /* await initializeExcel();
    await logChatHistory(userNumber, message.body); */
    if (!interactedUsers[userNumber]) {
      await message.reply(`اهلا بحضرتك يا فندم برجاء ارسال رقم الخدمة
         تمرين كاراتيه للاطفال(1)
         متابعة غذائية اونلاين(2)
         التواصل مع كابتن مريم(3)
    `);
      interactedUsers[userNumber] = true;
    } else {
      console.log(count.length);
      if (message.body === "1" && !count.length) {
        count = []
        await message.reply(`برجاء ارسال العنوان`);
      } else if (message.body === "2" && !count.length) {
        count.push(message.body)
        console.log(count.length);
        await message.reply(`تفاصيل متابعه التغذيه
        (1.)مكالمه مع كابتن مريم بعد دفع الاشتراك وملئ الفورم
        (2.)متابعه يوميه مع تصوير الاكل علي واتساب
        (3.)تغير النظام الغذائي كل ١٥ يوم
        سعر الاشتراك اول مره 250ج
        كل اسبوعين 100`);
      }
      else if (message.body === "3" && !count.length) {
        count = []
        await message.reply(`سيب استفسار حضرتك وسوف يتم الرد عليك من قبل كابتن مريم`);
      }
      else if (message.body === "1" && count.length > 0) {
        await message.reply(`الدفع عن طريق خدمة فودافون كاش رقم الدفع 010000`);
      }
      else if (message.body === "2" && count.length > 0) {
        await message.reply(`سوف يتم ارسال التفاصيل كامله برجاء الانتظار`);
      }
      else {
        count = []
        await message.reply(`اهلا بحضرتك يا فندم برجاء ارسال رقم الخدمة
        تمرين كاراتيه للاطفال(1)
        متابعة غذائية اونلاين(2)
        التواصل مع كابتن مريم(3)
   `);
      }
    }
  });
  client.on("qr", (qrCode) => {
    qrcode.generate(qrCode, { small: true });
    qr2.toDataURL(qrCode, (err, src) => {
      console.log(src);
      if (err) res.send("Error occured");
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
WhatsGPT
</div>
<div class="w3-display-middle">
<center>
<h2  class="w3-jumbo w3-animate-top">QRCode Generated</h2>

<hr class="w3-border-grey" style="margin:auto;width:40%">
<p class="w3-center"><div><img src='${src}'/></div></p>
</center>
</div>
<div class="w3-display-bottomleft w3-padding-large">
Powered by <a href="/" target="_blank">WhatsGPT</a>
</div>
</div>

</body>
</html>

`);
    });
  });

  client.on("ready", async () => {
    console.log("Client is ready!");
  });

  client.initialize();
})

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