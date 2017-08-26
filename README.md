# basicAuth
Steps to follow to run code:
Make sure you have mongodb installed

Make sure to have a C:\data directory before running mongodb

then run on a fresh terminal:
mongodb

with a new terminal go to basicAuth's main directory and run:

npm install

node index.js

Notes:
change the config.js in the config directory to change the name of the database you want, and the secret you want to use.

Passport is a great library with alot of use cases. This showcases a use of a few local Strategies to login and query from multiple databases and direct users to the right login page accordingly.

There are some details that are missing:
Mainly, there is alot of overhead with using .ejs files and having to send 