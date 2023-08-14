const express=require("express")
const router=express.Router();
const Topic=require("../models/topic")

router.get("/update/:level/:id",Topic.OpenUpdateView)
router.get("/table/:level/:category",Topic.loadLevel1,Topic.loadLevel2,Topic.loadLevel3,Topic.loadTable)

router.get("/del/:level/:id",Topic.deleteTopic)

router.get("/:level/:category/:selection",Topic.loadLevel1,Topic.loadLevel2,Topic.loadLevel3,Topic.loadTopics)


//router.get("/:level/:category/:selection",Topic.loadTopic)


router.post("/:level",Topic.AddToTopic)
router.post("/edit/:level/:id",Topic.UpdateTopic)


module.exports=router