# How to Setup MongoDB
## 1. install mongoDB
Install the MongoDB Community Server

    https://www.mongodb.com/try/download/community
## 2. install MongoDB Compass (GUI for MongoDB)
The previous download may have asked if you wanted to install this, if so you shouldnt need to download it again. If not download the latest version here

    https://www.mongodb.com/try/download/compass
## 3. Login Info
User Name: Your First Name (ex: Justin)

Password: DB123


Connection String:
```
mongodb+srv://<username>:<password>@cookbook-cluster.77jxjs5.mongodb.net/
```
# How to Connect to the Atlas Database using Compass
### 1. Open MongoDB Compass
Should open up to a screen that says it wants to create a connection
### 2. Create a new Connection
click the button saying to create a connection and follow the formating below:
#### URL:
This will be the connection string provided above. You will need to edit it so that \<username> is your first name and \<password> is DB123.
#### Name:
doesnt matter what you set it as, but I have mine set as cookbook-cluster
#### Color:
same as name, doesnt matter. I left mine at No Color
### 3. Click Save and Connect
This should let you connect to the cloud atlas version of the mongoDB. Nothing created there yet besides a collection called recipes.