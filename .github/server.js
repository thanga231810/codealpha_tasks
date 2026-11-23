const express=require('express'),path=require('path');
const app=express();app.use(express.json());
app.get('/shared.js',(q,s)=>s.sendFile(path.join(__dirname,'shared.js')));
app.get('/shared.css',(q,s)=>s.sendFile(path.join(__dirname,'shared.css')));
['task1-ecommerce','task2-social','task3-projects','task4-chat'].forEach((d,i)=>{
  const n='/task'+(i+1);
  app.use(n+'/api',require('./'+d+'/routes'));
  app.use(n,express.static(path.join(__dirname,d,'public')));
});
app.get('/',(q,s)=>s.send('<link rel=stylesheet href=/shared.css><h1>CodeAlpha Tasks</h1><p><a href=/task1/>Task 1 E-commerce</a></p><p><a href=/task2/>Task 2 Social Media</a></p><p><a href=/task3/>Task 3 Project Management</a></p><p><a href=/task4/>Task 4 Chat App</a></p>'));
app.listen(3000,()=>console.log('Open http://localhost:3000'));
