var api = require("./node_modules/clicksend/api.js");
const readXlsxFile = require("node-xlsx");
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.join(__dirname, "config/index.env") });

const generateVolunteers = () => {
  finalVolunteers = [];

  const fileBuffer = readXlsxFile.parse(`${__dirname}/data/Volunteers.xlsx`);

  const volunteers = fileBuffer[0].data;

  for (let i = 0; i < volunteers.length; i++) {
    if (i > 0) {
      if (volunteers[i].length === 3) {
        finalVolunteers.push({
          name: volunteers[i][1],
          number: "254" + volunteers[i][2],
        });
      }
    }
  }

  return finalVolunteers;
};

const new_target = (target) => {
  var smsMessage = new api.SmsMessage();

  smsMessage.from = "+254718287786";
  smsMessage.to = target;
  smsMessage.body = majority;

  return smsMessage;
};

const majority =
  "Hello, I'm sorry to inform you that the training which was set to take place tomorrow has been cancelled and its set to take place from Friday at 8:00 am at Baraka institute in Molo.\nSorry incase of any inconveniences caused.\n\nRegards, 0718287786 Sharon Chebet";

const minor =
  "Hello, I'm sorry to inform you that the training which was set to take place tomorrow has been cancelled and the training date will be communicated soon. Sorry incase of any inconveniences caused.\n\nRegards, 0718287786 Sharon Chebet";

console.log(majority);
const volunteers = generateVolunteers();

var smsApi = new api.SMSApi(
  process.env.MAIN_USER,
  process.env.MAIN_API_KEY,
);

var backupApi = new api.SMSApi(
  process.env.BACKUP_USER,
  process.env.BACKUP_API_KEY,
);

console.table(volunteers);

// The main engine
for (const i in volunteers) {
  // console.log(volunteers)
  var smsCollection = new api.SmsMessageCollection();

  smsCollection.messages = [new_target(volunteers[i].number)];

  backupApi
    .smsSendPost(smsCollection)
    .then(function (response) {
      console.log(response.body);
      console.log(
        `${i}. message delivered to ${volunteers[i].name} - [${volunteers[i].number}] ...`
      );
    })
    .catch(function (err) {
      console.error(err.body);
    });
}
