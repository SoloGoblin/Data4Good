

let topics=[
{
    id:1,
    title:"Health",
    image:"https://www.shutterstock.com/image-photo/health-insurance-concept-doctor-hospital-260nw-1451879171.jpg"

},
{
    id:2,
    title:"Discrimination",
    image:""
}
,
{
    id:3,
    title:"Poverty",
    image:""
},

{
    id:4,
    title:"Climate",
    image:""
}


]

const loadTopics=(req,res)=>{

  res.render("partials/topics",{
    topics:topics
  })


}


const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

function AddToTopic(req,res){
    const {level,name,imageURL}=req.body
if(level=="level1"){
    AddToLevel1(name,imageURL,res)
}

}

function AddToLevel1(name,imageURL,res){

    let query="Insert into level1 (name,imageURL) values(?,?);"
     db.run(query,[name,imageURL],(err)=>{
    if(err){
        console.log("Error at add to level1 :",err)
        return res.render("error");

    }
    res.end()
  })
    
}



function AddToLevel2(req,res){

    
}

function AddToLevel3(req,res){

    
}


module.exports={
    loadTopics,
    AddToTopic
}