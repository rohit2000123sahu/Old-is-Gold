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
  res.render("item",{itemName:"electronics"});
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
        res.render("buyItem", {arr:electronicsArr , itemName:"electronics"});
    }
  });
});


////Removing A Specific Electronic Product
app.get("/remove/electronics",function(req,res){
  res.render("login", {itemName:"electronics"});
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
            res.render("removeProducts",{arr:productsArr, itemName:"electronics"});
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

////Specific Electronic Product Details
app.get("/buy/electronics/:parameter",function(req,res){
  const id = req.params.parameter;
  Electronics.findOne({_id:id},function(err,product){
    if(!err){
       res.render("product",{element:product,itemName:"electronics"});
    }
  });
});


// Add Cycle Product Section
const cycleSchema = {
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

const Cycle = mongoose.model("Cycle",cycleSchema);


app.get("/sell/cycles",function(req,res){
  res.render("item",{itemName:"cycles"});
});

app.post("/sell/cycles",parser.single("image"),function(req,res){
  bcrpyt.hash(req.body.password,saltRounds,function(err,hash){
    if(!err){
      const item = new Cycle({
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

// Buy Cycle Product Section
app.get("/buy/cycles",function(req,res){
  Cycle.find({},function(err,cycleArr){
    if(!err){
        if(cycleArr.length==0){
          res.render("noItem");
        }else{
          res.render("buyItem", {arr:cycleArr ,itemName:"cycles"});
        }
    }
  });
});


////Removing A Specific Product
app.get("/remove/cycles",function(req,res){
  res.render("login", {itemName:"cycles"});
});

app.post("/remove/cycles/verify",function(req,res){
  Cycle.findOne({email:req.body.email},function(err, foundUser){
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
      Cycle.find({email:req.body.email},function(err,productsArr){
        if(!err){
          if(productsArr.length==0){
            res.render("noProducts");
          }else{
            res.render("removeProducts",{arr:productsArr , itemName:"cycles"});
          }
        }
      });
    }
  })
});


app.get("/remove/cycles/:parameter",function(req,res){
  const id = req.params.parameter;
  Cycle.findByIdAndRemove({_id:id},function(err){
    if(!err){
       res.render("removeSuccess");
    }
  });
});

////Specific Product Details
app.get("/buy/cycles/:parameter",function(req,res){
  const id = req.params.parameter;
  Cycle.findOne({_id:id},function(err,product){
    if(!err){
       res.render("product",{element:product, itemName:"cycles"});
    }
  });
});





// Add Books Product Section
const bookSchema = {
  name:String,
  email:String,
  password:String,
  contact:Number,
  product:String,
  edition:String,
  price:String,
  img:String,
  model:String,
  other:String,
};

const Book = mongoose.model("Book",bookSchema);


app.get("/sell/books",function(req,res){
  res.render("item",{itemName:"books"});
});

app.post("/sell/books",parser.single("image"),function(req,res){
  bcrpyt.hash(req.body.password,saltRounds,function(err,hash){
    if(!err){
      const item = new Book({
        name:req.body.name,
        email:req.body.email,
        password:hash,
        contact:req.body.number,
        product:req.body.pName,
        edition:req.body.year,
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

// Buy Books Product Section
app.get("/buy/books",function(req,res){
  Book.find({},function(err,bookArr){
    if(!err){
        if(bookArr.length==0){
          res.render("noItem");
        }else{
          res.render("buyItem", {arr:bookArr ,itemName:"books"});
        }
    }
  });
});


////Removing A Specific Product
app.get("/remove/books",function(req,res){
  res.render("login", {itemName:"books"});
});

app.post("/remove/books/verify",function(req,res){
  Book.findOne({email:req.body.email},function(err, foundUser){
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
      Book.find({email:req.body.email},function(err,productsArr){
        if(!err){
          if(productsArr.length==0){
            res.render("noProducts");
          }else{
            res.render("removeProducts",{arr:productsArr , itemName:"books"});
          }
        }
      });
    }
  })
});


app.get("/remove/books/:parameter",function(req,res){
  const id = req.params.parameter;
  Book.findByIdAndRemove({_id:id},function(err){
    if(!err){
       res.render("removeSuccess");
    }
  });
});

////Specific Product Details
app.get("/buy/books/:parameter",function(req,res){
  const id = req.params.parameter;
  Book.findOne({_id:id},function(err,product){
    if(!err){
       res.render("product",{element:product,itemName:"books"});
    }
  });
});




// Add Dress Product Section
const dressSchema = {
  name:String,
  email:String,
  password:String,
  contact:Number,
  product:String,
  year:Number,
  price:String,
  img:String,
  size:String,
  other:String,
};

const Dress = mongoose.model("Dress",dressSchema);


app.get("/sell/dress",function(req,res){
  res.render("item",{itemName:"dress"});
});

app.post("/sell/dress",parser.single("image"),function(req,res){
  bcrpyt.hash(req.body.password,saltRounds,function(err,hash){
    if(!err){
      const item = new Dress({
        name:req.body.name,
        email:req.body.email,
        password:hash,
        contact:req.body.number,
        product:req.body.pName,
        year:req.body.year,
        price:req.body.price,
        img:req.file.path,
        size:req.body.model,
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

// Buy Books Product Section
app.get("/buy/dress",function(req,res){
  Dress.find({},function(err,dressArr){
    if(!err){
        if(dressArr.length==0){
          res.render("noItem");
        }else{
          res.render("buyItem", {arr:dressArr ,itemName:"dress"});
        }
    }
  });
});


////Removing A Specific Product
app.get("/remove/dress",function(req,res){
  res.render("login", {itemName:"dress"});
});

app.post("/remove/dress/verify",function(req,res){
  Dress.findOne({email:req.body.email},function(err, foundUser){
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
      Dress.find({email:req.body.email},function(err,productsArr){
        if(!err){
          if(productsArr.length==0){
            res.render("noProducts");
          }else{
            res.render("removeProducts",{arr:productsArr , itemName:"dress"});
          }
        }
      });
    }
  })
});


app.get("/remove/dress/:parameter",function(req,res){
  const id = req.params.parameter;
  Dress.findByIdAndRemove({_id:id},function(err){
    if(!err){
       res.render("removeSuccess");
    }
  });
});

////Specific Product Details
app.get("/buy/dress/:parameter",function(req,res){
  const id = req.params.parameter;
  Dress.findOne({_id:id},function(err,product){
    if(!err){
       res.render("product",{element:product,itemName:"dress"});
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
