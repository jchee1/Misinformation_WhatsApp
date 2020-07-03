import re

with open('/Users/Jason/Downloads/_chat.txt', 'r') as fp:
    line = fp.readline()
    msgs = []
    while line:
        line = line.replace('\u200e', "")
        split = line.split("] ")
        if(split[0][0]=='['):
            dtsplit = split[0][1:].split(", ")
            date = dtsplit[0]
            time = dtsplit[1]
            msgsplit = split[1].split(": ", 1)
            sender = msgsplit[0]
            msg = msgsplit[1].rstrip("\n")

            #get url with findall fct
            urls = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', msg)

            if not urls:
                msgs.append({"date":date, "time":time, "sender":sender, "URL":urls})
            #else:
                #msgs.append({"date":date, "time":time, "sender":sender, "text":msg})
            
        else:
            msg = split[0].rstrip("\n")
            l = len(msgs)
            date = msgs[l-1]["date"]
            time = msgs[l-1]["time"]
            sender = msgs[l-1]["sender"]

            urls = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', msg)
            if not urls:
                msgs.append({"date":date, "time":time, "sender":sender, "URL":urls})
            #else:
               #msgs.append({"date":date, "time":time, "sender":sender, "text":msg})

        line = fp.readline()

    print(msgs)
