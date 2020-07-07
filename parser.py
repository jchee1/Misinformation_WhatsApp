import re

with open('/Users/Jason/Downloads/_chat.txt', 'r') as fp:
    line = fp.readline()
    msgs = []

    #create dictionary for contacts
    contacts = dict()

    #create dictionary for dates
    Dates = dict()

    #list for anonymous user names
    user_lst = []

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

            msg = msgsplit[1].rstrip("\n")

            #get url with findall fct
            urls = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', msg)
            #msgs.append({"date":date, "time":time, "sender":sender, "message":msg})

            if urls and int(year) == 20:
                msgs.append({"date":date, "time":time, "sender":sender, "URL":urls})
        
            
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

            urls = re.findall(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', msg)
            #msgs.append({"date":date, "time":time, "sender":sender, "message":msg})
            if urls and int(year) == 20:
                msgs.append({"date":date, "time":time, "sender":sender, "URL":urls})
            

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

    print(msgs)
