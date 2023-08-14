const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/database.db');

let level1=[
  {
    id:1,
    title:"Climate",
    image:"https://sphera.com/wp-content/uploads/2022/08/gettyimages-586087414-2048x2048-smaller-scaled.jpg"
},

{
    id:2,
    title:"Health",
    image:"https://www.shutterstock.com/image-photo/health-insurance-concept-doctor-hospital-260nw-1451879171.jpg"

},
{
    id:3,
    title:"Discrimination",
    image:""
}
,
{
    id:4,
    title:"Poverty",
    image:""
}



]



  let level2=[]

  for(let i=0;i<16;i++){
    let id=i%4+1
    let parentTopic=level1.find(item=>item.id==id).title
    level2.push(
      {
        id:i+1,
        title:parentTopic+"_secondScreen_"+i%4,
        image:"",
        referenceID:id
    }

    )
  }
  level2[0]={
   id:1,
   title:"Clean Energy",
   image:"https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/9d498117-3179-4718-81f4-f1c7fe8e892b/Pillar%201%20Energy%20Transition%20wind%20energy%20solar%20panels%20dreamstime.png?auto=compress%2Cformat&w=1200",
   referenceID:1
  }

  
  let level3=[]
  /*
  for(let i=1;i<=16*4;i++){
    let id=(i-1)%16+1

    let parentId=level2.find(item=>item.id==id).referenceID
    let parentTopic=level1.find(item=>item.id==parentId).title

    level3.push(
      {
        id:i,
        title:parentTopic+"_thirdScreen_"+(i%4),
        image:"",
        referenceID:id,
        details:"Add datails later",
    
    }

    )
  }*/

  level3[0]={
    
      id:1,
      title:"source 1",
      image:"",
      referenceID:1,
      details:"Add datails later1",

  
  }

  level3[1]={
    
    id:2,
    title:"source 2",
    image:"",
    referenceID:1,
    details:"Add datails later2",


}

level3[2]={
    
  id:3,
  title:"source 3",
  image:"",
  referenceID:1,
  details:"Add datails later3",

}

level3[3]={
    
  id:4,
  title:"source 4",
  image:"",
  referenceID:1,
  details:"Add datails later 4",
  

}

const loadLevel1=(req,res,next)=>{
  const {level}=req.params
  if(level !=1){
    return next()
  }

let query="select * from level1;"
db.all(query,(err,result)=>{

req.data=result
next();
})

}

const loadLevel2=(req,res,next)=>{

  
  const {level,category}=req.params///2/1
  if(level !=2 && level !=3){
    return next()
  }



  let query="select * from level2 where (referenceID=(?));"
  db.all(query,[category],(err,result)=>{
  req.level2=result
  next();
  })
  
}

const loadLevel3=(req,res,next)=>{

  const {level,category}=req.params
  if(level !=3){
    return next()
  }


  let query="select * from level3 where (referenceID=(?));"
  
  db.all(query,[category],(err,result)=>{
  req.data=result
  next();
  })
  
}





const loadTopics=(req,res)=>{
  const {level,category,selection}=req.params///2/1

   if(level==1){
    res.render("partials/topics",{
      topics:req.data,
      level:2
    })

   }else if(level==2){

    res.render("partials/topics",{
      topics:req.level2,
      level:3
    })

   }else if(level==3){
          //res.redirect(`/topics/3/${category}/0`)
          let data=req.data
          if(!data ||data.length==0 ){

            return res.send("no data")
          }
          let selected=data[selection]
          let RID=selected.referenceID
          let ref=req.level2.find(item=>item.id==RID)
          let cardTitle=ref.name
          res.render("partials/topics",{
            topics:data,
            topic:selected,
            category:category,
            cardTitle,
            level:4
          })


   }

 
}


const loadTopic=(req,res)=>{
  const {level,category,selection}=req.params

  let data=level3.filter(item=>item.referenceID==category)
  let selected=data[selection]
  res.render("partials/topics",{
    topics:data,
    topic:selected,
    category:category,
    level:4
  })


}




const loadTable=(req,res)=>{
  let level=req.params.level
  let category=req.params.category
  if(level==1){
    res.render("partials/topicsTable",{
      topics:req.data
    })
  }else if(level==2){
    res.render("partials/topicsTable2",{
      topics:req.level2,
      category:category
    })
    
  }else if(level==3){

    
    /*
    let data=req.data
    if(!data ||data.length==0 ){

      return res.send("no data")
    }
    let selected=data[selection]
    let RID=selected.referenceID
    let ref=req.level2.find(item=>item.id==RID)
    let cardTitle=ref.name
*/

    res.render("partials/topicsTable3",{
      topics:req.data,
      category:category
    })
  }
  
  
  }
  
function AddToTopic(req,res){
    
   
    let level=req.params.level
if(level==1){
  const {name,imageURL}=req.body
    AddToLevel1(name,imageURL,res)
}else if(level==2){
  
  AddToLevel2(req,res)
}else if(level==3){
 
   AddToLevel3(req,res)

}

}

function AddToLevel1(name,imageURL,res){

    let query="Insert into level1 (name,imageURL) values(?,?);"
     db.run(query,[name,imageURL],(err)=>{
    if(err){
        console.log("Error at add to level1 :",err)
        return res.render("error");

    }
    res.redirect("/adminDashboard")
  })
    
}



function AddToLevel2(req,res){
  const {name,imageURL,referenceID}=req.body
  let query="Insert into level2 (name,imageURL,referenceID) values(?,?,?);"
  db.run(query,[name,imageURL,referenceID],(err)=>{
 if(err){
     console.log("Error at add to level1 :",err)
     return res.render("error");

 }
 console.log("added")
 res.redirect("/adminDashboard")
})
 
    
}

function AddToLevel3(req,res){

 const {sourceTitle,link,referenceID,description}=req.body

    let query="Insert into level3 (sourceTitle,description,link,referenceID) values(?,?,?,?);"
     db.run(query,[sourceTitle,description,link,referenceID],(err)=>{
    if(err){
        console.log("Error at add to level1 :",err)
        return res.render("error");

    }
    res.redirect("/adminDashboard")
  })
    
 
    
}


function deleteTopic(req,res){

  
  let level=req.params.level
  let id=req.params.id
  if(level==1){
      let sql="delete from level1 where id=(?)"
      db.run(sql,[id],(err)=>{
deleteSubcategory(id,level);
        res.redirect("/adminDashboard")
        
      })
      
  }else if(level==2){
    let sql="delete from level2 where id=(?)"
    db.run(sql,[id],(err)=>{
deleteSubcategory(id,level);
      res.redirect("/adminDashboard")
      
    })
    

  }else if(level==3){

    let sql="delete from level3 where id=(?)"
    db.run(sql,[id],(err)=>{

      res.redirect("/adminDashboard")
    
    })

    
  }


}

function deleteSubcategory(id,level) {//
  console.log(level)
  if(level==3){
    return;
  }
  let sql=`select * from level${level*1+1} where referenceID='${id}'`
  console.log("sql",sql)
   db.all(sql,(err,result)=>{
    if(err) console.log("err",err)
    console.log("result",result)
    if(!result || result.length==0 || err) return;
     
    for(let item of result){
      if(item){
        console.log(item)
        deleteSubcategory(item.id,level+1)

         let sql2=`delete from level${level*1+1} where id='${item.id}'`
         db.run(sql2,(err)=>{console.log(err)})
      }
    }
   })
}

function UpdateTopic(request,response){
  console.log("update called")
  let {level}=request.params

  if(level==1){
    console.log("update level1 at item with id ",request.id)
   updateLevel1(request,response)
  }else if(level==2){
    updateLevel2(request,response)
  }else if(level==3){
    updateLevel3(request,response)

  }

}

function updateLevel1(request,response){
  let id=request.params.id
  console.log(request.params)
   let {name,imageURL}=request.body
   console.log(request.body)
  let sql="update level1 set name=(?),imageURL=(?) where id=(?) "
  db.run(sql,[name,imageURL,id],(err)=>{
    if(err){
      console.log(err)
      return response.end()
    }
  console.log("level 1 updated")
  response.redirect("/adminDashboard/tables/1/1");
  })
}

function updateLevel2(request,response){
  let id=request.params.id
  console.log(request.params)
   let {name,imageURL}=request.body
   console.log(request.body)
  let sql="update level2 set name=(?),imageURL=(?) where id=(?) "
  db.run(sql,[name,imageURL,id],(err)=>{
    if(err){
      console.log(err)
      return response.end()
    }
  console.log("level 2 updated")
  response.redirect("/adminDashboard/tables/1/1");
  })
}

function updateLevel3(request,response){
  let id=request.params.id
  console.log(request.params)
   let {sourceTitle,link,description}=request.body
   console.log(request.body)
  let sql=`update level3 set sourceTitle=(?),link=(?), description = (?) where id=(?) `
  db.run(sql,[sourceTitle,link,description,id],(err)=>{
    if(err){
      console.log(err)
      return response.end()
    }
  console.log("level 1 updated")
  response.redirect("/adminDashboard/tables/1/1");
  })
}









function OpenUpdateView(request,response){
  let {level,id}=request.params

  response.render("updateForm",{
    level,topic:id,user:request.user
  })
}

module.exports={
  OpenUpdateView,
    AddToTopic,
    loadTable,
    loadTopics,
    loadTopic,
    loadLevel1,
    loadLevel2,
    loadLevel3,
    deleteTopic,
    UpdateTopic
}