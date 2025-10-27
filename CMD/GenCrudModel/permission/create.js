// const prisma=require("./../../../prisma")

// uncomment to get acces to prisma

/**
 
beforeCreate
funciton will run before creating a record
// if you dont want a record to be created
throw error 

preferable format for printing in front end
{
_message,status(http status code)
message can be strinng an array of strings or html stirn
custom:true,_message:}

/
*
if you dont want to stop the
creation process  but update the response
return {
 _message:the message:string array of strin or html,
 return_data:{//object by default the created record wull be return here},
 status:[optional if you want to change the returned status code]
 
 }
*
/ 


 * **/

async function beforeCreate({ req }) {}

/**
 
After create function will be called 
after the record has ben created
hence the record 

throw error as above
if you want to contribute to response 
return {
 _message:the message:string array of strin or html,
 return_data:{//object by default the created record wull be return here},
 status:[optional if you want to change the returned status code]
 
 }

 * **/

async function afterCreate({ req, record }) {}

module.exports = { beforeCreate, afterCreate };
