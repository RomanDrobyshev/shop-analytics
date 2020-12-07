# Project requirments
1. NodeJs v14.15.0
2. Npm v6.14.18
3. MongoDB v4.2.0
# Installation
1. Run ```npm i``` for installing project dependency
2. Run ```npm run download-dynamic-prices```
3. In the root directory create .development.env file with such format:
```
MONGO_USER=
MONGO_PASSWORD=
MONGO_HOST=
MONGO_PORT=
MONGO_DB_NAME=
```
4. In the /cron directory create .development.env file with such format:
```
MONGO_USER=
MONGO_PASSWORD=
MONGO_HOST=
MONGO_PORT=
MONGO_DB_NAME=
```
# Bootstrap
1. Run ```npm run cron:dev``` for starting cron. It will run genarate report for each one minute. If a report was already generated it will not be generated again.
2. Run ```npm run start:dev``` for starting rest server
3. Open doc on http://localhost:3000/doc
