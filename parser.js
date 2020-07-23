const fs = require("fs");
const readline = require("readline");

async function getContacts() {
  const fileStream = fs.createReadStream("./getURL.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
  var contacts = {};

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    let split = line.split("]");
    let nmsplit = split[1].split(":");
    let name = nmsplit[0];
    if (name in contacts) {
      contacts[name] += 1;
    } else {
      contacts[name] = 1;
    }
    //console.log(`${line}`);
  }
  const num_contacts = Object.keys(contacts).length;
  console.log(num_contacts);
  for (var key in contacts) {
    console.log(key + " : " + contacts[key]);
  }
}

let msgs = [];

let total_num = 0;
let num_2020 = 0;
let num_before_2020 = 0;

let num_urls = 0;
let num_img = 0;
let num_txt = 0;

async function readUrl() {
  const fileStream = fs.createReadStream("./getURL.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  var d = {};

  var source = { URL: {}, IMG: {}, TXT: {} };

  for await (let line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    line = line.split("[");
    let split = line[1].split("]");
    let dtsplit = split[0].split(",");
    let date = dtsplit[0];
    let time = dtsplit[1];
    //console.log(date);
    let yrsplit = date.split("/");
    let year = yrsplit[2];

    if (year === 20) {
      num_2020++;
    } else if (year < 20) {
      num_before_2020++;
    }

    let nmsplit = split[1].split(": ", 2);
    let name = nmsplit[0];
    let msg = nmsplit[1];

    msgs.push({ date: date, time: time, sender: name, message: msg });
    console.log(msgs);

    //console.log(`${line}`);
  }
}

getContacts();
readUrl();

//console.log(msgs);
