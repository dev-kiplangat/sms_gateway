var api = require("./node_modules/clicksend/api.js");
const dotenv = require("dotenv");
const path = require("path");
const colors = require("colors");

dotenv.config({ path: path.join(__dirname, "config/index.env") });

const cliProgress = require("cli-progress");

const {
  MessageClient,
  generateVolunteers,
  getData,
  getUnresolvedContacts,
  saveUnresolvedMessages,
} = require("./utilities/data");

// code vars initialization
const progressb1 = new cliProgress.SingleBar(
  {
    format: ':: |' + colors.cyan('{bar}') + '|({value}/{total})| {percentage}% ',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
  },
  cliProgress.Presets.shades_classic
);

var backupApi = new api.SMSApi(
  process.env.BACKUP_USER,
  process.env.BACKUP_API_KEY
);

var smsApi = new api.SMSApi(process.env.MAIN_USER, process.env.MAIN_API_KEY);

let volunteers = null
const cmdArgs = process.argv

if (cmdArgs.length > 2 || cmdArgs[2] == "--resend"){
  volunteers = getUnresolvedContacts();


  if(volunteers.length == 0){
    console.log('No unresolved contacts Found !\n'.yellow)
    process.exit(0)

  }
}
else
{
   volunteers = generateVolunteers("/data/Friday1.xlsx");
   console.log('No contacts Found!\n'.yellow)
   process.exit(0)
}



const data_to_send = getData();

progressb1.start(volunteers.length, 0, {
  speed: "N/A",
});

let Incomplete = [];

const ProcessInit = async () => {
  for (const volunteer of volunteers) {
    var smsCollection = new api.SmsMessageCollection();

    const smsMessage = new api.SmsMessage();
    smsCollection.messages = [
      MessageClient(volunteer.number, data_to_send, smsMessage),
    ];

    try {
      const response = await backupApi.smsSendPost(smsCollection);

      if (response.body.response_code == "SUCCESS") {
        if (response.body.data.total_price > 0) {
          // show progress Bar
        } else {
          Incomplete.push(volunteer);
        }

        progressb1.increment();
        progressb1.updateETA();

      }
    } catch (err) {
      throw new Error('There was a problem connection to servers ')
    }
  }
  progressb1.stop();
};

// console.table(volunteers);

// The main engine

ProcessInit()
  .then(() => {
    if (Incomplete.length > 0) {
      console.log(
        `\nYou have unsent Messages --- check file \n${__dirname}/data/report.json`
          .underline.red
      );
      saveUnresolvedMessages(Incomplete);
    } else {
      console.log("\nAll Messages Sent Successfully!".yellow);
    }
  })
  .catch((err) => {
    console.log("\n" + err);
  });
