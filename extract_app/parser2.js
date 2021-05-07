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
    let names={};
    let ncount=0;
    
  
    for (let i=0; i<lines.length; i++) {
      // Each line in input.txt will be successively available here as `line`.
      line=lines[i];
      let split = line.split("]");
      let nmsplit = split[1].split(":");
      let name = nmsplit[0];
      let new_name;
      if (name in names){
        new_name = names[name]
      }
      else{
        new_name = "User"+ncount.toString();
        ncount += 1
        names[name] = new_name
      }
      if (new_name in contacts) {
        contacts[new_name] += 1;
      } else {
        contacts[new_name] = 1;
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
    let name, nam;
    let nmsplit;
  
    var url_list = [];
  
    var lines = file.split(/\n|\r/);
    lines=lines.filter(function (el) {
      return el != "";
    });
  
    let line;
    //console.log(lines);
    let names={};
    let msg;
    let ncount=0;
    for (let i=1; i<lines.length; i++) {
      // Each line in input.txt will be successively available here as `line`.
      line=lines[i];
      //console.log(line);
      //line = line.split("[");
      let split = line.split("]");
      if(split.length<2){
        //console.log(msgs);
        date = msgs[msgs.length-1].date
        time = msgs[msgs.length-1].time
        msg = split[0]
    
        //console.log(nmsplit);
        //nam = nmsplit[0];
        //let tmpNam = list(names.values()).index(msgs[msgs.length-1].sender);
        //nam = list(names.keys())[tmpNam];
        nam = msgs[msgs.length-1].sender;
      }
      else{
        let dtsplit = split[0].split(",");
        date = dtsplit[0].replace('[', '');
        time = dtsplit[1];
        nmsplit = split[1].split(/: /);
        nam = nmsplit[0];
        msg = nmsplit[1];
      }
      if (nam.includes("added") || nam.includes('removed') || nam.includes("created") || nam.includes("left")) {
        continue;
      }
      //console.log(msg);

      //console.log(nam);
      //console.log(Object.values(names));
      if (Object.values(names) != undefined && Object.values(names).includes(nam)) {
        //console.log("line check");
        name = nam;
      }
      else if (nam in names){
        name = names[nam]
      }
      else{
        console.log('DDDD');
        name = "User"+ncount.toString();
        ncount += 1
        names[nam] = name
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
  
      
      let classification;

      
      if (msg.includes("security code changed") 
        || msg.includes("Messages and calls are end-to-end encrypted")) {
            continue;
        }
        
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
        var regexp = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%\/.\w-]*)?\??(?:[-+=&;%@.\w]*)#?\w*)?)/gm; 
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
  
      msgs.push({
        date: date,
        time: time,
        sender: name,
        classification: classification,
        message: url,
      });
    
  
      total_num++;
  
    }
    num_contacts = Object.keys(contacts).length;
    end_date = date;
    let actual_urls = gen_parse(file).url_list;
    num_urls = actual_urls.length;
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
  
    var parse = {};
    parse.info=info;
    parse.user_per_day=user_per_day;
    parse.source=source;
    parse.msgs=msgs;
    parse.url_list = actual_urls;
    //parse.url_list=url_list;
  
  
  
    return parse;
  }



  export function Android(file) {
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
    let name, nam;
    let nmsplit;
  
    var url_list = [];
  
    var lines = file.split(/\n|\r/);
    lines=lines.filter(function (el) {
      return el != "";
    });
  
    let line;
    //console.log(lines);
    let names={};
    let msg;
    let ncount=0;
    for (let i=1; i<lines.length; i++) {
      // Each line in input.txt will be successively available here as `line`.
      line=lines[i];
      //console.log(line);
      //line = line.split("[");
      let split = line.split("-");
      if(split.length<2){
        //console.log(msgs);
        date = msgs[msgs.length-1].date
        time = msgs[msgs.length-1].time
        msg = split[0];
        //console.log(nmsplit);
        nam = msgs[msgs.length-1].sender;        
      }
      else {
        let dtsplit = split[0].split(",");
        let rest = split.slice(1,).join();
        date = dtsplit[0];
        time = dtsplit[1];
        nmsplit = rest.split(/: /);
        nam = nmsplit[0];
        msg = nmsplit[1]
      }
      if (nam.includes("added") || nam.includes('removed') || nam.includes("created") || nam.includes("left")) {
        continue;
      }
      
      if (Object.values(names) != undefined && Object.values(names).includes(nam)) {
        //console.log("line check");
        name = nam;
      }
      else if (nam in names){
        name = names[nam]
      }
      else{
        name = "User"+ncount.toString();
        ncount += 1
        names[nam] = name
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
  
      let classification;
      
      if (msg.includes("security code changed") 
        || msg.includes("Messages and calls are end-to-end encrypted")) {
            continue;
        }
        
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
        var regexp = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%\/.\w-]*)?\??(?:[-+=&;%@.\w]*)#?\w*)?)/gm; ///(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        url = msg.match(regexp)[0];
        num_urls++;
        //url_list.push(url);
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
  
      msgs.push({
        date: date,
        time: time,
        sender: name,
        classification: classification,
        message: url,
      });
      
  
      total_num++;
  
    }
    num_contacts = Object.keys(contacts).length;
    end_date = date;
    let actual_urls = gen_parse(file).url_list;
    num_urls = actual_urls.length;
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
  
    var parse = {};
    parse.info=info;
    parse.user_per_day=user_per_day;
    parse.source=source;
    parse.msgs=msgs;
    //parse.url_list=url_list;
    parse.url_list = actual_urls;
  
  
    return parse;
  }

  export function gen_parse(file) {
    var links = [];
    var lines = file.split(/\n|\r/);
    lines=lines.filter(function (el) {
        return el != "";
    });
    let line;
    for (let i=0; i<lines.length; i++) {
        line = lines[i];
        let url;
        if (isUrl(line)) {
            var re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%\/.\w-]*)?\??(?:[-+=&;%@.\w]*)#?\w*)?)/gm; 
            let url;
            while ((url = re.exec(line)) != null) {
                links.push(url[0]);
            }
        }
    }
    var dict = {
        url_list: links
    }
    return dict

  }
  
    export function returner(i, file){
    if(i===0){
      return readData(file)
    }
    else if(i == 1) {
        return gen_parse(file)
    }
    else if (i == 2) {
        return gen_parse(file).url_list
    }
    else if (i == 4) {
        return Android(file)
    }
    else if (i == 5) {
        return Android(file).url_list
    }
    else if (i == 3) {
      return readData(file).url_list
    }
  }
  
  /*
  var str = "1/8/20, 02:29 - +1 (604) 561-3323: Hey Mauro! Also in north Tower :) \
  1/8/20, 02:29 - +65 8244 8532: Hi Mauro! Welcome - I'm Solomon from the South Tower \
  1/8/20, 02:33 - +61 411 868 217 joined using this group's invite link \
  1/8/20, 02:33 - +82 10-8827-2859 joined using this group's invite link \
  1/8/20, 02:33 - +82 10-8827-2859: Hi \
  1/8/20, 02:34 - +82 10-8827-2859: I’m Jenny from Korea! \
  1/8/20, 02:34 - +45 20 42 72 18 joined using this group's invite link \
  1/8/20, 02:34 - +65 9082 0421 joined using this group's invite link \
  1/8/20, 02:37 - +91 87640 98777: Hey I am Akash, from India. Nice to meet you all.\
  1/8/20, 02:38 - +65 8285 6315 joined using this group's invite link"
*/
  //console.log(gen_parse(5, str))
  //var str = 'Hello, I can\'t http://google.com for c*ap https://www.w3schools.com/jsref/jsref_match.asp';
  //console.log(gen_parse(str));