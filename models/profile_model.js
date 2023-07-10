const uuid = require('uuid');
const fs = require('fs');
const multer = require('multer');
const path = require("path");
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

//if uui exits -> more numer of logins updates else -> first login updates and uid/name... is set
/*
console.log("1+1="+(1+1)+",2+2="+(2+2))
console.log(`1+1= ${1+1} , 2+2= ${2+2}`)
*/
function getProfile(user, request, response, cb) {


  db.all(`SELECT * FROM players where uid='${user.id}'`, function (err, row) {
    /*gets called for every row our query returns*/

    if (row.length == 0) {
      db.run(`INSERT INTO players (name, uid,wins,losses,ties,role, numberOfLogins, NumberOfGames) VALUES('user name' ,'${user.id+""}',0,0,0,'normal',1,0);`, (err, data) => {

        let profile = {
          name: "user name",
          numberOfGames: 0,
          numberOfLogins: 0,
          wins: 0,
          losses: 0,
          ties: 0,
          firstLogin: new Date().toISOString(),
          recentUpdate: new Date().toISOString(),
          role: "default"
        }
        return cb(request, response, profile)

      })

    } else {

      db.run(`UPDATE players SET numberOfLogins = '${row[0]['numberOfLogins']*1+1}' where uid='${user.id}';`, (err) => {
        if (err) {
          console.log(err)
        }
        // let  {name,numberOfGames,wins,losses,ties,lastUpdat(e,role}=row[0]
      })

      db.run(`UPDATE players SET recentUpdate = '${new Date().toISOString()}'  where uid='${user.id}';`, (err) => {
        if (err) {
          console.log(err)
        }
        return cb(request, response, row[0])
      })
    }
  });


  /*
  db.all('SELECT * FROM players', function(err, rows){
    /*gets called after the entire query returns
    if(err){
      console.log(err);
    } else {
      console.log(rows)
    }
  });
  */

}







function updateName(request, response, cb, name) {
  db.run(`UPDATE players SET name = '${name}' where uid='${request.user.id}'`, (err) => {
    if (err) {
      console.log(err)

    }
    // let  {name,numberOfGames,wins,losses,ties,lastUpdate,role}=row[0]
    request.user.profile.name = name
    return cb(request, response)


  })

}


const loadProfiles = (request, response, cb) => {



  db.all(`SELECT * FROM players `, function (err, rows) {
    if (err) {
      console.log(err)
    }
    return cb(request, response, rows)

  })


}
const applyActions = (req, res, actions, arr, index, cb) => {
  if (index == arr.length) {
    return cb(req, res)
  }
  let uid = arr[index]
  let action = actions[uid]
  if (action == "promote") {
    db.run(`UPDATE players SET role = 'admin' where uid='${uid}'`, (err) => {
      return applyActions(req, res, actions, arr, index + 1, cb)
    })
  } else if (action == "demote") {
    db.run(`UPDATE players SET role = 'default' where uid='${uid}'`, (err) => {
      return applyActions(req, res, actions, arr, index + 1, cb)
    })
  }
}


let publicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/profilePictures')
  },
  filename: function (req, file, cb) {
    cb(null, req.user.id + ".png");
  }
});

let publicUpload = multer({
  storage: publicStorage
});

let saveProfile = async (profile, uid) => {

  let profiles = await loadProfiles()
  let user = profiles[uid]
  /*
  if(user==undefined){
   user={posts:[]}
  }
  */
  profiles = {
    ...profiles,
    [uid]: {
      ...profile
    }
  }


  await fs.writeFile('./public/data/users.json', JSON.stringify(profiles), () => {})
}
module.exports = {
  publicUpload,
  saveProfile,
  loadProfiles,
  getProfile,
  updateName,
  applyActions
};