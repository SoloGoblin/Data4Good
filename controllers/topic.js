const express=require("express")
const router=express.Router();
const Topic=require("../models/topic")
router.get("/",Topic.loadTopics)

router.post("/",Topic.AddToTopic)



module.exports=router