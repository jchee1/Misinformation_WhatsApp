import re

with open('/Users/Jason/Downloads/chat.txt', 'r') as fp:
    line = fp.readline()
    msgs = []

    #variables to count total num of urls, images, and text chats
    num_urls = 0
    num_img = 0
    num_txt = 0

    #create dictionary for contacts
    contacts = dict()

    #create dictionary for dates
    Dates = dict()

    #created nested dictionary to get num of msgs per user per day
    d = {}

    source = {'URL': { },
            'IMG' : { },
            'TXT' : { }}

    #have variable store total number of messages in chat
    total_num = 0

    #variables for num of msg in 2020 and num of msg before 2020
    num_2020 = 0
    num_before_2020 = 0

    #get date from first line -> start date
    split = line.split("] ")  
    dtsplit = split[0][1:].split(", ")
    start_date = dtsplit[0]

    while line:
        line = line.replace('\u200e', "")
        split = line.split("] ")
        if(split[0][0]=='['):
            dtsplit = split[0][1:].split(", ")
            date = dtsplit[0]

            #check to see if the date is in the Dates dict(), if it is then count +1, if not add to dict()
            if date in Dates:
                Dates[date] += 1
            else:
                Dates[date] = 1

            time = dtsplit[1]

            #get year of message + see if from 2020 or before
            yrsplit = dtsplit[0].split("/")
            year = yrsplit[2]
            if int(year) == 20:
                num_2020 += 1
            elif int(year) < 20:
                num_before_2020 += 1


            msgsplit = split[1].split(": ", 1)
            sender = msgsplit[0]

            #same logic as Dates
            if sender in contacts:
                contacts[sender] += 1
                user_id = list(contacts.keys()).index(sender)
                sender = "User" + str(user_id+1)
            else:
                contacts[sender] = 1
                user_id = list(contacts.keys()).index(sender)
                sender = "User" + str(user_id+1)

            #num of msgs per user per day
            if date in d:
                if sender in d[date]:
                    d[date][sender] += 1
                else:
                    d[date][sender] = 1
            else:
                d[date] = {}
                if sender in d[date]:
                    d[date][sender] += 1
                else:
                    d[date][sender] = 1 

            msg = msgsplit[1].rstrip("\n")

            #get url with findall fct
            urls = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', msg)
            #msgs.append({"date":date, "time":time, "sender":sender, "message":msg})

            #get img file from line if available
            imgsplit = re.split("<attached: |>", msg)
                
            if urls:
                classification = "url" 
                num_urls += 1
                if sender in source['URL']:
                    source['URL'][sender] += 1
                else:
                    source['URL'][sender] = 1

            if len(imgsplit[0]) == 0:
                classification = 'image'
                num_img += 1
                if sender in source['IMG']:
                    source['IMG'][sender] += 1
                else:
                    source['IMG'][sender] = 1
            if not urls and len(imgsplit[0]) != 0:
                classification = 'text'
                num_txt += 1
                if sender in source['TXT']:
                    source['TXT'][sender] += 1
                else:
                    source['TXT'][sender] = 1
            if int(year) == 20:
                msgs.append({"date":date, "time":time, "sender":sender, "class":classification, "message":urls})
        
            
        else:
            msg = split[0].rstrip("\n")
            l = len(msgs)
            date = msgs[l-1]["date"]

            if date in Dates:
                Dates[date] += 1
            else:
                Dates[date] = 1

            yrsplit = dtsplit[0].split("/")
            year = yrsplit[2]
            if int(year) == 20:
                num_2020 += 1
            elif int(year) < 20:
                num_before_2020 += 1


            time = msgs[l-1]["time"]
            sender = msgs[l-1]["sender"]

            if sender in contacts:
                contacts[sender] += 1
                user_id = list(contacts.keys()).index(sender)
                sender = "User" + str(user_id+1)
            else:
                contacts[sender] = 1
                user_id = list(contacts.keys()).index(sender)
                sender = "User" + str(user_id+1)

            if date in d:
                if sender in d[date]:
                    d[date][sender] += 1
                else:
                    d[date][sender] = 1
            else:
                d[date] = {}
                if sender in d[date]:
                    d[date][sender] += 1
                else:
                    d[date][sender] = 1 

            urls = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', msg)
            #msgs.append({"date":date, "time":time, "sender":sender, "message":msg})
            
            imgsplit = re.split("<attached: |>", msg)

            if urls:
                classification = "url" 
                num_urls += 1
                if sender in source['URL']:
                    source['URL'][sender] += 1
                else:
                    source['URL'][sender] = 1

            if len(imgsplit[0]) == 0:
                classification = 'image'
                num_img += 1
                if sender in source['IMG']:
                    source['IMG'][sender] += 1
                else:
                    source['IMG'][sender] = 1
            if not urls and len(imgsplit[0]) != 0:
                classification = 'text'
                num_txt += 1
                if sender in source['TXT']:
                    source['TXT'][sender] += 1
                else:
                    source['TXT'][sender] = 1
            if int(year) == 20:
                msgs.append({"date":date, "time":time, "sender":sender, "class":classification, "message":urls})
            

        total_num += 1
        line = fp.readline()

    end_date = date
    print("Number of total messages:", total_num)
    print("Number of messages in 2020:", num_2020)
    print("Number of messages before 2020:", num_before_2020)
    print("Start-date to End-date:", start_date, " -> ", end_date)
    print("Number of contacts:", len(contacts))

    #print number of messages sent by each person + num of messages per day
    for key in list(contacts.keys()):
        user_id = list(contacts.keys()).index(key)
        print("Number of messages from User" + str(user_id+1), ":", contacts[key])

    for key in list(Dates.keys()):
        print("Number of messages on",key, ":", Dates[key])

    #num of msg per user per day
    for dat, user in d.items():
        print("Date:", dat)

        for key in user:
            print(key + ":", user[key])
    
    print("URLS:", num_urls)
    print("IMGS:", num_img)
    print("TXT:", num_txt)

    #print each source message sent from each user
    for sources, participant in source.items():
        print(sources + ":")
        for key in participant:
            print(key + ":", participant[key])
    print("\n")
    print(msgs)