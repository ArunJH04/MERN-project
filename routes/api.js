const express = require('express');
const router = express.Router();
const Ninja = require('../models/ninja');



// post
router.post('/ninjas',function(req,res,next){
  Ninja.create(req.body).then(function(ninja) {
    res.send(ninja);
  }).catch(next);
});

// put
router.put('/ninjas/:id',function(req,res,next){
  Ninja.findByIdAndUpdate({_id: req.params.id},req.body).then(function(){
    Ninja.findOne({_id: req.params.id}).then(function(ninja){
      res.send(ninja);
    });
  });
});

// delete
router.delete('/ninjas/:id',function(req,res,next){
  Ninja.findByIdAndRemove({_id: req.params.id}).then(function(ninja){
    res.send(ninja);
  });
});

// get
router.get('/ninjas',function(req,res,next){

// normal get code
/* Ninja.find({}).then(function(ninjas){
  res.send(ninjas);
});*/

// using geo location near
Ninja.aggregate(
  [
    {
      $geoNear: {
        near: {type: 'Point', coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]},
        spherical: true,
        maxDistance: 100000,
        distanceField: "dist.calculated"
      }
    }
  ]).then(function(ninjas){
    res.send(ninjas);
  });

});

module.exports = router;
