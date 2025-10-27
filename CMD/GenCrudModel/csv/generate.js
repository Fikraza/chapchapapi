//const escapeCsvValue = require("./../../../Utils/Scheme/csv/escapeCsvValue");
/**
   Un comment IF YOU NEED IT.
   The line above to use escapeCsvValue which evaluates a string and escapes ',' and \n so your csv document is not ruined.  
**/

/**
 ---CSV should return an object with property head and data.
 
  head should be an array of the title for the table
  data can either be an array or a function. The array contains the nested keys 
  of the table

  if data is a function it will be called for each record. it should return  
  an array of the different 


  ensure you return an object with ={
   head:[] // Array
   data:[] // array or function ({record,req,tx}){},
   filters:function optional update the where object with prisma filters
   if data funciton returns null then record not added to generated pile
   }
 **/

const filters = ({ where, req }) => {};

const csv = {
  head: [],
  data: [],
  filters: filters,
};

module.exports = csv;
