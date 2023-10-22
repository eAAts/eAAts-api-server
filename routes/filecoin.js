const express = require('express');
const { storeMetadata } = require('../controllers/filecoin');
const router = express.Router();

router.get('/', async function(req, res, next) {
    const image_cid = req.query.cid;
    const description = req.query.description;
    const menu = req.query.menu;
    const ratings = req.query.ratings;
    const callRes = await storeMetadata(image_cid,description,menu,ratings);
    res.render(callRes);
  });
  
module.exports = router;