var api = require("./node_modules/clicksend/api.js");
const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "config/index.env") });

const cliProgress = require("cli-progress");

const {
  MessageClient,
  generateVolunteers,
  getData,
  saveUnresolvedMessages,
} = require("./utilities/data");

var backupApi = new api.SMSApi(
  process.env.BACKUP_USER,
  process.env.BACKUP_API_KEY
);

const progressb1 = new cliProgress.SingleBar({
  format:
    "CLI Progress |" +
    _colors.yellow("{bar}") +
    "| {percentage}% || {value}/{total} Chunks || Speed: {speed}",
  barCompleteChar: "\u2588",
  barIncompleteChar: "\u2591",
  hideCursor: true,
});

var smsApi = new api.SMSApi(process.env.MAIN_USER, process.env.MAIN_API_KEY);

const volunteers = generateVolunteers("/data/Friday1.xlsx");
const data_to_send = getData();

progressb1.start(volunteers.length, 0, {
  speed: "N/A",
});

let Incomplete = [];
// console.table(volunteers);

// The main engine

for (const i in volunteers) {
  var smsCollection = new api.SmsMessageCollection();

  smsCollection.messages = [
    MessageClient(volunteers[i].number, data_to_send, new api.SmsMessage()),
  ];

  try {
    const response = await smsApi.smsSendPost(smsCollection);

    if (response.body.response_code == "SUCCESS") {
      if (response.body.data.total_price > 0) {
        // show progress Bar
        console.log(
          `${i}. message delivered to ${volunteers[i].name} - [${volunteers[i].number}] ...`
        );
      } else {
        Incomplete.push(volunteers[i]);
      }

      progressb1.increment()
    }
  } catch (err) {
    console.log(err.body);
  }
}
progressb1.stop()

if (Incomplete.length > 0) {
  console.log(
    `You have unprocessed contacts --- check  in ${__dirname}/data/report.json`
  );

  saveUnresolvedMessages(Incomplete);
} else {
  console.log("success");
}
