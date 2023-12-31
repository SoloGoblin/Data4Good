const express = require('express');
const fs = require("fs")
router = express.Router();


const Profile = require("../models/profile_model")


router.get("/unauth/", (request, response) => {
  response.status(401);
  response.setHeader('Content-Type', 'text/html')
  response.render("unauth", {
    user: request.user
  })

})



router.get("/profile/", (request, response) => {
  if (!request.user) return response.redirect("/unauth")


  response.status(200);
  response.setHeader('Content-Type', 'text/html'),

    response.render("profile", {
      user: request.user,
      ...request.user.profile
    });
})

router.post("/applyAdminActions", (req, res) => {
  const actions = req.body;
  const arr = Object.keys(actions)

  const cb = (req, res) => {

    res.send("action applied")
  }
  Profile.applyActions(req, res, actions, arr, 0, cb)



})



router.post('/updateName', function (request, response) {
  if (!request.user) return response.redirect("/unauth")


  /*
  sql database  : req.user:id //so we only create the player if the user id is not in the database
  */

  let playerName = request.body.playerName;
  if (!playerName) {
    response.status(400);
    response.setHeader('Content-Type', 'text/html')
    return response.render("error", {
      "errorCode": "400",
      user: request.user
    });

  }

  ///player name 
  ////call sql command to update player profile 
  return Profile.updateName(request, response, nextChangeName, playerName)


});

function nextChangeName(request, response) {
  response.status(200);
  response.setHeader('Content-Type', 'text/html')

  response.render("profile", {
    user: request.user,
    ...request.user.profile
  });
}

/*new project starts here*/
router.get("/adminDashboard",Profile.loadDashboard)
router.get("/adminDashboard/tables/:level/:category",Profile.loadDashboardTables)

module.exports = router