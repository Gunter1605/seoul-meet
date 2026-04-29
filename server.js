'use strict';
const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

const ROOT      = __dirname;
const PUBLIC    = path.join(ROOT, 'public');
const DATA_DIR  = path.join(ROOT, 'data');
const DATA_FILE = path.join(DATA_DIR, 'menu.json');
const UPL_DIR   = path.join(ROOT, 'uploads');

[DATA_DIR, UPL_DIR].forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, {recursive:true}); });

const storage = multer.diskStorage({
  destination: (_,__,cb) => cb(null, UPL_DIR),
  filename:    (_,file,cb) => cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname).toLowerCase()||'.jpg'}`)
});
const upload = multer({ storage, limits:{fileSize:5*1024*1024}, fileFilter:(_,file,cb)=>{ const ok=/\.(jpe?g|png|webp|gif)$/i.test(file.originalname); cb(ok?null:new Error('Images only'),ok); } });

function readMenu()  { try { return JSON.parse(fs.readFileSync(DATA_FILE,'utf8')); } catch { return null; } }
function writeMenu(d){ fs.writeFileSync(DATA_FILE, JSON.stringify(d,null,2), 'utf8'); }
function auth(req,res){ const m=readMenu(); const exp=m?.settings?.adminPassword||'SM2025'; if((req.headers['x-admin-password']||'')!==exp){res.status(401).json({error:'Неверный пароль'});return false;} return true; }

app.use(express.json({limit:'20mb'}));
app.use(express.static(PUBLIC));
app.use('/uploads', express.static(UPL_DIR));

app.get('/api/menu', (_,res) => { const m=readMenu(); if(!m) return res.status(204).end(); res.json(m); });
app.put('/api/menu', (req,res) => { if(!auth(req,res))return; const d=req.body; if(!d||!Array.isArray(d.items)) return res.status(400).json({error:'Bad format'}); try{writeMenu(d);res.json({ok:true});}catch(e){res.status(500).json({error:e.message});} });
app.post('/api/upload', (req,res) => { if(!auth(req,res))return; upload.single('image')(req,res,err=>{ if(err)return res.status(400).json({error:err.message}); if(!req.file)return res.status(400).json({error:'No file'}); res.json({ok:true,url:`/uploads/${req.file.filename}`}); }); });
app.delete('/api/upload/:fn', (req,res) => { if(!auth(req,res))return; const fp=path.join(UPL_DIR,path.basename(req.params.fn)); if(fs.existsSync(fp))try{fs.unlinkSync(fp);}catch{}; res.json({ok:true}); });
app.get('*',(_,res)=>{ const idx=path.join(PUBLIC,'index.html'); fs.existsSync(idx)?res.sendFile(idx):res.status(404).send('index.html not found'); });

app.listen(PORT,()=>{ console.log(`\n✅ Seoul Meet: http://localhost:${PORT}\n   Admin: http://localhost:${PORT}/#admin-seoulm33t\n`); });
