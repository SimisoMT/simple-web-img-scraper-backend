
const cheerio = require("cheerio");
const request = require("request");
const cors = require("cors");
const express = require("express");
const urlapi = require("url");
const app = express();
app.use(cors());

const port = process.env.PORT || 3001;

app.get("/", (req, res) =>{
  //get request data
  const url = req.query.url;//"http://localhost/myresume/"; "http://localhost/javascript/imgpg.html" //req.query.text;  https://github.com/SimisoMT/
  console.log(req.query.url + '------------------REQUESTED #1');
  
  if(req.query.url !==""){
   
    //make request
    try {
      request(
        url,
        (error, response, html)=>{
          // if(!error){
            //cheerio scrapping
            try{
              const images =  cheerio.load(html)('img')
              .toArray()
              .map(image => image.attribs.src).filter(img => img !="");

              if(images[0] !== undefined){
/*                const domain = "http://wwww.localhost.com/img/core/".split(".");
                const domainType = domain[2].split("/");
                //if images returned
                //response
                images.forEach(image=>{
                  if(image.indexOf("//" == -1 )){
                    //if(image.indexOf("./") || )
                    console.log(domain[0]+"."+domain[1]+"."+domainType[0]+"/"+image);
                  }
                  
                })*/
                
                const domain = url.split(".");
                
                console.dir(domain +"------------------DOMAIN #2 & success below--------------------------");

                const modifiedImages = images.map(image=>{
                  console.log(urlapi.resolve(url, image) + "  url api ++++++++++++++++++++++++++++++++++++++++");

                  if(image.indexOf("http") || image.indexOf("https")){

                    if(!image.indexOf("http") || !image.indexOf("https")){ return image;}

                    

                    console.log(domain[0]+"/"+domain[1]+"/"+domain[2]+"/"+domain[3]+"/"+image);
                    return domain[0]+"."+domain[1]+"."+domain[2]+image;
                                  
                  }else{
                    return image;
                  }
                })

                console.dir(modifiedImages + '------------------server3');
                res.setHeader('Content-Type','application/json');
                res.json({images: modifiedImages,length: modifiedImages.length - 1,source:url,payload:true});
                
              }else{
                //if no images returned
                res.setHeader('Content-Type','application/json');
                res.json({payload: false});
                console.log('----images[] empty');
              }  

          } catch (error) {
            res.setHeader('Content-Type','application/json');
            res.json({payload: false});
            console.log('----catch cheerio');
            return;
          }

          
        }
      );//end make request 

    } catch (error) {
      //on api exception message for request module
      res.setHeader('Content-Type','application/json');
      res.json({payload: false});
      console.log('----catch request');

    }
    
  }else{
    res.setHeader('Content-Type','application/json');
    res.json({payload: false});
    console.log('----empty url');

  }

});//end route

app.listen(port, () => console.log(`Example app listening on port ${port}!`));