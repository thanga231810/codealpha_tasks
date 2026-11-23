const fs=require('fs'),path=require('path'),jwt=require('jsonwebtoken'),bcrypt=require('bcryptjs');
const SECRET='codealpha-secret',cache={};
function store(name){
  if(cache[name])return cache[name];
  const f=path.join(__dirname,'data',name+'.json');
  fs.mkdirSync(path.dirname(f),{recursive:true});
  const d=fs.existsSync(f)?JSON.parse(fs.readFileSync(f)):{};
  return cache[name]={get:k=>d[k]=d[k]||[],save:()=>fs.writeFileSync(f,JSON.stringify(d,null,1))};
}
const id=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
function authRoutes(r){
  const db=store('users');
  const token=u=>({token:jwt.sign({id:u.id,name:u.name},SECRET),name:u.name});
  r.post('/register',async(q,s)=>{
    const{name,email,password}=q.body;
    if(!name||!email||!password)return s.status(400).json({error:'All fields required'});
    if(db.get('users').find(x=>x.email===email))return s.status(400).json({error:'Email already registered'});
    const u={id:id(),name,email,pass:await bcrypt.hash(password,8)};
    db.get('users').push(u);db.save();s.json(token(u));
  });
  r.post('/login',async(q,s)=>{
    const u=db.get('users').find(x=>x.email===q.body.email);
    if(!u||!(await bcrypt.compare(q.body.password||'',u.pass)))return s.status(401).json({error:'Invalid email or password'});
    s.json(token(u));
  });
}
function auth(q,s,next){
  try{q.user=jwt.verify((q.headers.authorization||'').replace('Bearer ',''),SECRET);next();}
  catch{s.status(401).json({error:'Please login'});}
}
module.exports={store,id,authRoutes,auth};
