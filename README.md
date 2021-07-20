# sms_gateway

This is a simple command line tool that i built to allow
me to easily send bulk messages to clients.

Utilizes clicksend sms api to perform the actual work.

The tool keeps track of unsuccessfull send message attempts and stores it in  a file. 

# Getting Started

To initialize.

```bash
npm start
```

This command will will run the program.

```
npm start --resend
```


Any unsuccessfull attempts are stored in `data/record.json` file. This command 
will try resending to the contacts on the file
