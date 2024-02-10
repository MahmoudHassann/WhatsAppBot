const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const Excel = require("exceljs");
const fs = require("fs");

const client = new Client({
  puppeteer:{
    headless:true,
    args: ["--no-sandbox"]
  },
  authStrategy: new LocalAuth({
    clientId: "Bot_ID"
  }),


});

// Maintain a record of interacted users
const interactedUsers = {};
const excelFilePath = "./chat_history.xlsx";
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
}




client.on("message", async (message) => {
  const userNumber = message.from;
  await initializeExcel();
  await logChatHistory(userNumber, message.body);
  if (!interactedUsers[userNumber]) {
    await message.reply(`
        اهلا بحضرتك يا فندم برجاء ارسال رقم الخدمة
         تمرين كاراتيه للاطفال(1)
         متابعة غذائية اونلاين(2)
         التواصل مع كابتن مريم(3)
    `);
    interactedUsers[userNumber] = true;
  } else {
    if (message.body === "!ping") {
      await message.reply("pong");
    } else if (message.body === "1") {
      await message.reply(`
          برجاء ارسال العنوان
      `);
    }
    else if (message.body === "2") {
      await message.reply(`
          املا بيانات الفورم دا
      `);
    }
    else if (message.body === "3") {
      await message.reply(`
          سيب استفسار حضرتك وسوف يتم الرد عليك من قبل كابتن مريم
      `);
    }
  }
});

/* client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
}); */
qrcode.generate('http://github.com', function (qrcode) {
    console.log(qrcode);
});

client.on("ready", async () => {
  console.log("Client is ready!");
});

client.initialize();
