# sms_gateway

This is a simple command line tool that i built to allow
me to easily send bulk messages to clients.

The tool is built around [`clicksend-sms`](http://clicksend.com) api to perform the actual work. 

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
