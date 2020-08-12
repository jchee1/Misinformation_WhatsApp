//function to see if string is url
function isUrl(string) {
  var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  return regexp.test(string);
}

//function to get num of contacts + contacts
export function getContacts(file) {
  var contacts = {};

  var lines = file.split(/\n|\r/);
  lines=lines.filter(function (el) {
    return el != "";
  });

  let line;

  for (let i=0; i<lines.length; i++) {
    // Each line in input.txt will be successively available here as `line`.
    line=lines[i];
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


export function readData(file) {
  var msgs = [];

  var total_num = 0;
  var num_2020 = 0;
  var num_before_2020 = 0;
  var num_contacts = 0;

  var num_urls = 0;
  var num_img = 0;
  var num_txt = 0;
  var start_date;
  var end_date;

  var contacts = {};
  var user_per_day = {};
  var source = {};

  let date;
  let time;
  let name;
  let nmsplit;

  var url_list = [];

  var lines = file.split(/\n|\r/);
  lines=lines.filter(function (el) {
    return el != "";
  });

  let line;
  //console.log(lines);
  for (let i=0; i<lines.length; i++) {
    // Each line in input.txt will be successively available here as `line`.
    line=lines[i];
    //console.log(line);
    //line = line.split("[");
    let split = line.split("]");
    if(split.length<2){
      date = msgs[msgs.length-1].date
      time = msgs[msgs.length-1].time
      nmsplit = split[0].split(/: /);
      //console.log(nmsplit);
      name = nmsplit[0];
    }
    else{
      let dtsplit = split[0].split(",");
      date = dtsplit[0].replace('[', '');
      time = dtsplit[1];
      nmsplit = split[1].split(/: /);
      name = nmsplit[0];
    }


    if (total_num === 0) {
      start_date = date;
    }

    //console.log(date);
    let yrsplit = date.split("/");
    let year = yrsplit[2];

    if (parseInt(year) === 20) {
      num_2020++;
    } else if (parseInt(year) < 20) {
      num_before_2020++;
    }

    if (name in contacts) {
      contacts[name] += 1;
    } else {
      contacts[name] = 1;
    }

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
      var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
      url = msg.match(regexp)[0];
      num_urls++;
      url_list.push(url);
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
  num_contacts = Object.keys(contacts).length;
  end_date = date;

  //console log everything but later maybe would want to create object
  //that would have each variables as an attribute
  //add everything to parse object
  var info = {
    startdate: start_date,
    enddate: end_date,
    Total_messages: total_num,
    Contacts: num_contacts,
    Msgs2020: num_2020,
    Before_2020: num_before_2020,
    URLs: num_urls,
    Images: num_img,
    Text: num_txt,
  };

  var parse = [];
  parse.push(info);
  parse.push(user_per_day);
  parse.push(source);
  parse.push(msgs);

  

  return url_list;
}
