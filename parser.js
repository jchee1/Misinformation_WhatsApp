const fs = require("fs");
const readline = require("readline");

//all variables to store info

var msgs = [];

var total_num = 0;
var num_2020 = 0;
var num_before_2020 = 0;

var num_urls = 0;
var num_img = 0;
var num_txt = 0;
var start_date;
var end_date;

var contacts = {};
var user_per_day = {};
var source = {};

//function to see if string is url
function isUrl(string) {
  var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regexp.test(string);
}

//function to get num of contacts + contacts
async function getContacts(file) {
  const fileStream = fs.createReadStream(file);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

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
  }
  const num_contacts = Object.keys(contacts).length;
  console.log("Number of contacts:", num_contacts);
  for (var key in contacts) {
    console.log(key + " : " + contacts[key]);
  }
}


async function readUrl(file) {
  const fileStream = fs.createReadStream(file);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let date;

  for await (let line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    line = line.split("[");
    let split = line[1].split("]");
    let dtsplit = split[0].split(",");
    date = dtsplit[0];
    
    if (total_num === 0) {
      start_date = date;
    }

    let time = dtsplit[1];
    //console.log(date);
    let yrsplit = date.split("/");
    let year = yrsplit[2];

    if (parseInt(year) === 20) {
      num_2020++;
    } else if (parseInt(year) < 20) {
      num_before_2020++;
    }

    let nmsplit = split[1].split(/: /);
    //console.log(nmsplit);
    let name = nmsplit[0];
    let msg = nmsplit[1];
    let classification;

    if (date in user_per_day) {
      if (name in user_per_day[date]) {
        user_per_day[date][name]++;
      } else {
        user_per_day[date][name] = 1;
      }
    } else {
      user_per_day[date] = {};
      if (name in user_per_day[date]) {
        user_per_day[date][name]++;
      } else {
        user_per_day[date][name] = 1;
      }
    }

    let url;
    if (isUrl(msg)) {
      classification = "url";
      url = msg;
      num_urls++;
    }
    if (msg === "<attached") {
      classification = "image";
      num_img++;
    }
    if (isUrl(msg) === false && msg != "<attached") {
      classification = "text";
      num_txt++;
    }

    //source dictionary
    if (classification in source) {
      if (name in source[classification]) {
        source[classification][name]++;
      } else {
        source[classification][name] = 1;
      }
    } else {
      source[classification] = {};
      if (name in source[classification]) {
        source[classification][name]++;
      } else {
        source[classification][name] = 1;
      }
    }

    if (parseInt(year) === 20) {
      msgs.push({
        date: date,
        time: time,
        sender: name,
        classification: classification,
        message: url,
      });
    }

    total_num++;

  }

  //console log everything but later maybe would want to create object
  //that would have each variables as an attribute
  console.log(msgs);

  end_date = date;

  console.log(start_date, "->", end_date);
  console.log("Total number of msgs: " + total_num);
  console.log("Msgs on 2020: " + num_2020);
  console.log("Msgs before 2020: " + num_before_2020);
  console.log("Number of urls: " + num_urls);
  console.log("Number of images: " + num_img);
  console.log("Number of text: " + num_txt);

  for (var dat in user_per_day) {
    for (var key in user_per_day[dat]) {
      console.log(
        "Number of messages on",
        dat,
        "from",
        key,
        ":",
        user_per_day[dat][key]
      );
    }
  }

  for (var src in source) {
    for (var user in source[src]) {
      console.log(
        "Number of",
        src,
        "messages from",
        user,
        ":",
        source[src][user]
      );
    }
  }
}

//jason test file
readUrl("./chat.txt");
getContacts("./chat.txt");
