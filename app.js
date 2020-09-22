require('dotenv').config();

// Setting Up the Environment
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const bcrpyt = require("bcrypt");
const saltRounds = 12;

const app = express();
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/oldDB",{useNewUrlParser:true, useUnifiedTopology:true});

//Image Storage On Cloudinary
cloudinary.config({
cloud_name: process.env.CLOUD_NAME,
api_key: process.env.API_KEY,
api_secret: process.env.API_SECRET
});
const storage = new CloudinaryStorage({
cloudinary: cloudinary,
folder: "demo",
allowedFormats: ["jpg", "png"],
transformation: [{ width: 500, height: 500, crop: "limit" }]
});
const parser = multer({ storage: storage });

// Add Electronics Product Section
const electronicsSchema = {
  name:String,
  email:String,
  password:String,
  contact:Number,
  product:String,
  year:Number,
  price:String,
  img:String,
  model:String,
  other:String,
};

const Electronics = mongoose.model("Electronic",electronicsSchema);


app.get("/sell/electronics",function(req,res){
  res.render("electronics");
});

app.post("/sell/electronics",parser.single("image"),function(req,res){
  bcrpyt.hash(req.body.password,saltRounds,function(err,hash){
    if(!err){
      const item = new Electronics({
        name:req.body.name,
        email:req.body.email,
        password:hash,
        contact:req.body.number,
        product:req.body.pName,
        year:req.body.year,
        price:req.body.price,
        img:req.file.path,
        model:req.body.model,
        other:req.body.other
      });
      item.save(function(err){
        if(err){
          console.log(err);
        }else{
          res.render("success");
        }
      });
    }
  });
});

// Buy Electronics Product Section
app.get("/buy/electronics",function(req,res){
  Electronics.find({},function(err,electronicsArr){
    if(!err){
        res.render("buyElectronics", {arr:electronicsArr});
    }
  });
});


////Removing A Specific Product
app.get("/remove/electronics",function(req,res){
  res.render("removeElectronics");
});

app.post("/remove/electronics/verify",function(req,res){
  Electronics.findOne({email:req.body.email},function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        bcrpyt.compare(req.body.password,foundUser.password,function(err,results){
          if(results===false){
            bcrpyt.compare(process.env.PASSWORD,foundUser.password,function(error,final){
              if(final===false){
                res.render("noUser");
              }
            });
          }
        });
      }
      else{
        res.render("noUser");
      }
      Electronics.find({email:req.body.email},function(err,productsArr){
        if(!err){
          if(productsArr.length==0){
            res.render("noProducts");
          }else{
            res.render("removeProducts",{arr:productsArr});
          }
        }
      });
    }
  })
});


app.get("/remove/electronics/:parameter",function(req,res){
  const id = req.params.parameter;
  Electronics.findByIdAndRemove({_id:id},function(err){
    if(!err){
       res.render("removeSuccess");
    }
  });
});

////Specific Product Details
app.get("/buy/electronics/:parameter",function(req,res){
  const id = req.params.parameter;
  Electronics.findOne({_id:id},function(err,product){
    if(!err){
       res.render("product",{element:product});
    }
  });
});


//Server Startup And Setup
app.get("/",function(req,res){
  res.render("index");
});

app.listen(3000,function(){
  console.log("Server is up and running on port 3000");
});
