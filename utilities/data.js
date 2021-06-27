
const dotenv  = require('dotenv');
const fs = require('fs');
const readXlsxFile = require("node-xlsx");
const path = require('path')


dotenv.config({ path: path.join(__dirname, "config/index.env") });

exports.generateVolunteers = (dir) => {
  finalVolunteers = [];

  const fileBuffer = readXlsxFile.parse(path.join(__dirname, '..', dir));

  const volunteers = fileBuffer[0].data;

  for (let i = 0; i < volunteers.length; i++) {
    if (i > 0) {
      if (volunteers[i].length > 3) {
        finalVolunteers.push({
          name: volunteers[i][4],
          number: "254" + volunteers[i][7],
        });
        finalVolunteers.push({
          name: volunteers[i][10],
          number: "254" + volunteers[i][13],
        });
      }
    }
  }

  getData()

  return finalVolunteers;
};

exports.getData = ()=>{
  fs.readFile(__dirname + '/../data/config.json', (err, data)=>{
    if (err){
      throw err
    }
    const Out = JSON.parse(data)
    console.log(Out)
    return Out.data

  })
}


exports.MessageClient = (target,data, smsMessage) => {

    smsMessage.from = "+254718287786";
    smsMessage.to = target;
    smsMessage.body = data;
  
    return smsMessage;

}

exports.saveUnresolvedMessages = (dataArr)=>{
  fs.writeFile(__dirname + "/../data/report.json", JSON.stringify(dataArr))
}