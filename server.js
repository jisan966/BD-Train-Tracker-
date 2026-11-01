const express=require("express"),path=require("path"),fs=require("fs");
const app=express(),PORT=process.env.PORT||3000;
app.use(express.json({limit:"20kb"}));app.use(express.static(__dirname));
const demo=require("./trains.demo.json");
const STORE=process.env.RAILTRACK_STORE||path.join(__dirname,"live-locations.json");
let live={};
try{if(fs.existsSync(STORE))live=JSON.parse(fs.readFileSync(STORE,"utf8"))||{};}catch(e){console.error("Could not read GPS store",e.message);}
function save(){try{fs.writeFileSync(STORE,JSON.stringify(live,null,2));}catch(e){console.error("GPS store write failed",e.message);}}
app.get("/api/health",(q,s)=>s.json({ok:true,gpsSharingEnabled:!!process.env.RAILTRACK_DRIVER_KEY}));
app.get("/api/trains",(q,s)=>{s.set("Cache-Control","no-store");s.json({trains:demo.trains});});
app.get("/api/live-locations",(q,s)=>{s.set("Cache-Control","no-store");const now=Date.now();s.json({locations:Object.values(live).map(x=>({...x,ageSeconds:Math.max(0,Math.round((now-x.timestamp)/1000)),stale:now-x.timestamp>120000}))});});
app.post("/api/location",(q,s)=>{
 const expected=process.env.RAILTRACK_DRIVER_KEY;
 if(!expected)return s.status(503).json({error:"Server admin has not enabled GPS sharing."});
 if(q.get("x-driver-key")!==expected)return s.status(401).json({error:"Invalid sharing key."});
 const {trainId,lat,lng,accuracy,speed,heading}=q.body||{};
 const train=demo.trains.find(t=>String(t.id)===String(trainId)||String(t.number)===String(trainId));
 if(!train)return s.status(400).json({error:"Unknown train ID."});
 if(!Number.isFinite(lat)||!Number.isFinite(lng)||lat<20||lat>27||lng<88||lng>93)return s.status(400).json({error:"Invalid Bangladesh GPS coordinates."});
 live[train.id]={trainId:train.id,trainName:train.name,number:train.number,lat,lng,accuracy:Number.isFinite(accuracy)?accuracy:null,speed:Number.isFinite(speed)&&speed>=0?speed:null,heading:Number.isFinite(heading)?heading:null,timestamp:Date.now(),source:"opt-in-phone-gps"};save();
 s.json({ok:true,receivedAt:new Date().toISOString()});
});
app.delete("/api/location/:trainId",(q,s)=>{const expected=process.env.RAILTRACK_DRIVER_KEY;if(!expected)return s.status(503).json({error:"GPS sharing is not enabled."});if(q.get("x-driver-key")!==expected)return s.status(401).json({error:"Invalid sharing key."});delete live[q.params.trainId];save();s.json({ok:true});});
app.get("*",(q,s)=>s.sendFile(path.join(__dirname,"index.html")));
app.listen(PORT,()=>console.log(`RailTrack BD: http://localhost:${PORT}`));
