# sms_gateway

This is a simple command line tool that i built to allow
me to easily send bulk messages to clients.

The tool is built around [`clicksend-sms-api`](http://clicksend.com) to perform the actual work. 

# Getting Started

To initialize.

```bash
npm start
```

This command will will run the program. 
Edit the `data/config.json` file with the actual message you want to send.

 

```bash
npm start --resend
```


Any unsuccessfull attempts are stored in `data/record.json` file. This command 
will try resending to the contacts on the file
