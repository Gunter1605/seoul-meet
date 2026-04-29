'use strict';

let adminTab_    = 'items';
let adminFilter  = 'all';
let adminSearch  = '';
let adminEditing = null;
let catEditing   = null;

/* ── Login ── */
function adminLogin() {
  const input = document.getElementById('adminPassInput').value;
  const err   = document.getElementById('loginError');
  if (input === (data.settings.adminPassword || 'SM2025')) {
    err.classList.remove('show');
    document.getElementById('admin-login-root').style.display = 'none';
    document.getElementById('admin-root').style.display = 'block';
    adminTab_ = 'items'; adminFilter = 'all'; adminSearch = ''; adminEditing = null;
    renderAdmin();
  } else {
    err.classList.add('show');
    document.getElementById('adminPassInput').value = '';
    document.getElementById('adminPassInput').focus();
  }
}

function adminLogout() {
  document.getElementById('admin-root').style.display = 'none';
  location.hash = '';
  showGuest();
}

/* ── Tabs ── */
function adminTab(tab, btn) {
  adminTab_ = tab; adminEditing = null; catEditing = null;
  document.querySelectorAll('.admin-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderAdmin();
}

function renderAdmin() {
  if      (adminTab_ === 'items')      renderItemsTab();
  else if (adminTab_ === 'categories') renderCategoriesTab();
  else if (adminTab_ === 'settings')   renderSettingsTab();
}

/* ── Items Tab ── */
function renderItemsTab() {
  const cats = sortedCats();
  const filterBtns = `<div class="admin-filter">
    <button class="filter-btn${adminFilter==='all'?' active':''}" onclick="setAdminFilter('all')">Все</button>
    ${cats.map(c=>`<button class="filter-btn${adminFilter===c.id?' active':''}" onclick="setAdminFilter('${c.id}')">${esc(c.nameShort)}</button>`).join('')}
  </div>`;

  let items = adminFilter === 'all' ? data.items : data.items.filter(it => it.cat === adminFilter);
  if (adminSearch) items = items.filter(it => it.name.toLowerCase().includes(adminSearch.toLowerCase()));

  let html = `${filterBtns}
    <input class="admin-search" type="text" placeholder="🔍 Поиск..."
           value="${esc(adminSearch)}" oninput="adminSearchFn(this.value)">
    <button class="admin-add-btn" onclick="startEditItem(null)">+ Добавить блюдо / напиток</button>`;

  if (adminEditing !== null) html += renderItemEditor();
  html += items.length === 0
    ? `<div class="empty-state">Ничего не найдено</div>`
    : items.map(renderAdminItemRow).join('');

  document.getElementById('adminContent').innerHTML = html;
}

function renderAdminItemRow(it) {
  const cat = data.categories.find(c => c.id === it.cat);
  const type = cat?.type || 'food';
  const imgHtml = type === 'bar'
    ? `<svg viewBox="0 0 24 24" style="width:22px;height:22px;fill:var(--gold);opacity:.6"><path d="M20 3H4v10c0 3.31 2.69 6 6 6h4c3.31 0 6-2.69 6-6V3z"/></svg>`
    : it.img
      ? `<img src="${it.img}" style="width:100%;height:100%;object-fit:cover">`
      : catSvg(it.cat);

  return `<div class="admin-list-item">
    <div class="admin-list-img">${imgHtml}</div>
    <div class="admin-list-info">
      <div class="admin-list-name">${esc(it.name)}</div>
      <div class="admin-list-sub">${cat ? cat.nameShort : it.cat}${it.sub?' · '+it.sub:''}${type==='bar'?' · 🍹':''}</div>
    </div>
    <div class="admin-list-price">${fmt(it.price)} ₸</div>
    <div class="admin-list-actions">
      <button class="admin-edit-btn" onclick="startEditItem('${it.id}')">✎</button>
      <button class="admin-del-btn"  onclick="deleteItem('${it.id}')">✕</button>
    </div>
  </div>`;
}

function setAdminFilter(f) { adminFilter = f; renderAdmin(); }
function adminSearchFn(v)  { adminSearch = v; renderAdmin(); }

/* ── Item Editor ── */
function startEditItem(id) {
  adminEditing = id
    ? deepClone(data.items.find(it => it.id === id) || {})
    : {
        id:'item_'+Date.now(), cat: adminFilter !== 'all' ? adminFilter : (sortedCats()[0]?.id||''),
        sub:'', sub_en:'', name:'', name_en:'', desc:'', desc_en:'',
        price:0, weight:'', img:null, badges:[], mods:[], isPrime:false
      };
  renderAdmin();
  setTimeout(() => document.getElementById('itemEditorForm')?.scrollIntoView({behavior:'smooth',block:'start'}), 100);
}

function renderItemEditor() {
  const it    = adminEditing;
  const isNew = !data.items.find(x => x.id === it.id);
  const cats  = sortedCats();
  const selectedCat = cats.find(c => c.id === it.cat);
  const type  = selectedCat?.type || 'food';

  const catOpts = cats.map(c => {
    const typeLabel = c.type === 'bar' ? '🍹' : c.type === 'desserts' ? '🍰' : '🍽';
    return `<option value="${c.id}"${it.cat===c.id?' selected':''}>${typeLabel} ${c.nameShort} – ${c.name}</option>`;
  }).join('');

  const subs    = [...new Set(data.items.filter(x=>x.cat===it.cat&&x.sub).map(x=>x.sub))];
  const subOpts = subs.map(s=>`<option value="${s}"${it.sub===s?' selected':''}>${s}</option>`).join('');

  const badgesHtml = [
    {id:'new',label:'🟡 new'},{id:'spicy',label:'🌶 spicy'},{id:'pork',label:'🐷 свинина'}
  ].map(b=>`<button type="button" class="badge-toggle${(it.badges||[]).includes(b.id)?' on':''}"
              onclick="toggleBadge('${b.id}',this)">${b.label}</button>`).join('');

  const modsHtml = (it.mods||[]).map((mg,gi)=>renderModGroupEditor(mg,gi)).join('');

  const imgContent = it.img
    ? `<img src="${it.img}" style="width:100%;height:100%;object-fit:cover">`
    : `<svg viewBox="0 0 24 24" style="width:32px;height:32px;fill:var(--border)"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>`;

  const showPhotoBlock = type !== 'bar';
  const showPrimeToggle = type === 'food';

  return `<div class="admin-form" id="itemEditorForm">
    <h3>${isNew ? 'Новое блюдо / напиток' : 'Редактировать'}</h3>

    <!-- Категория -->
    <div class="form-row">
      <label>Категория</label>
      <select class="form-select" onchange="adminEditing.cat=this.value;renderAdmin()">${catOpts}</select>
    </div>

    <!-- Название RU / EN -->
    <div class="form-row-2">
      <div class="form-row" style="margin:0">
        <label>Название 🇷🇺</label>
        <input class="form-input" value="${esc(it.name)}" oninput="adminEditing.name=this.value" placeholder="Название">
      </div>
      <div class="form-row" style="margin:0">
        <label>Name 🇬🇧</label>
        <input class="form-input" value="${esc(it.name_en||'')}" oninput="adminEditing.name_en=this.value" placeholder="English name">
      </div>
    </div>

    <!-- Описание RU / EN -->
    <div class="form-row-2">
      <div class="form-row" style="margin:0">
        <label>Описание 🇷🇺</label>
        <textarea class="form-textarea" style="min-height:60px" oninput="adminEditing.desc=this.value"
                  placeholder="Краткое описание">${esc(it.desc||'')}</textarea>
      </div>
      <div class="form-row" style="margin:0">
        <label>Description 🇬🇧</label>
        <textarea class="form-textarea" style="min-height:60px" oninput="adminEditing.desc_en=this.value"
                  placeholder="English description">${esc(it.desc_en||'')}</textarea>
      </div>
    </div>

    <!-- Цена / Вес / Подраздел -->
    <div class="form-row-2">
      <div class="form-row" style="margin:0">
        <label>Цена (₸)</label>
        <input class="form-input" type="number" value="${it.price||0}" oninput="adminEditing.price=+this.value">
      </div>
      <div class="form-row" style="margin:0">
        <label>Вес / объём</label>
        <input class="form-input" value="${esc(it.weight||'')}" oninput="adminEditing.weight=this.value" placeholder="200 г / 300 мл">
      </div>
    </div>

    <!-- Подраздел RU / EN -->
    <div class="form-row-2">
      <div class="form-row" style="margin:0">
        <label>Подраздел 🇷🇺</label>
        <input class="form-input" list="sub-list" value="${esc(it.sub||'')}"
               oninput="adminEditing.sub=this.value" placeholder="Говядина">
        <datalist id="sub-list">${subOpts}</datalist>
      </div>
      <div class="form-row" style="margin:0">
        <label>Subsection 🇬🇧</label>
        <input class="form-input" value="${esc(it.sub_en||'')}" oninput="adminEditing.sub_en=this.value" placeholder="Beef">
      </div>
    </div>

    <!-- Метки -->
    <div class="form-row">
      <label>Метки</label>
      <div class="badges-row">${badgesHtml}</div>
    </div>

    ${showPrimeToggle ? `<div class="form-row">
      <div class="toggle-wrap">
        <label class="toggle">
          <input type="checkbox" ${it.isPrime?'checked':''} onchange="adminEditing.isPrime=this.checked">
          <span class="toggle-slider"></span>
        </label>
        Prime (красная полоска)
      </div>
    </div>` : ''}

    <!-- Фото (не для бара) -->
    ${showPhotoBlock ? `<div class="form-row">
      <label>Фото</label>
      <div class="img-row">
        <div class="img-preview" id="imgPreviewBox">${imgContent}</div>
        <div class="img-controls">
          <input class="form-input" id="imgUrlInput" value="${esc(it.img||'')}"
                 oninput="adminEditing.img=this.value;refreshImgPreview(this.value)"
                 placeholder="https://... или загрузите файл">
          <div style="margin:6px 0;font-size:11px;color:var(--text-muted);text-align:center">или</div>
          <label class="img-upload-btn" id="imgUploadLabel">
            📁 Загрузить с устройства
            <input type="file" accept="image/*" style="display:none" onchange="uploadImg(event)">
          </label>
          <div class="img-upload-hint">Фото сохраняется на сервере</div>
          ${it.img?`<button type="button" class="small-btn" style="margin-top:6px"
            onclick="adminEditing.img=null;refreshImgPreview(null);document.getElementById('imgUrlInput').value=''">✕ Удалить фото</button>`:''}
        </div>
      </div>
    </div>` : `<div style="padding:10px 0;font-size:11px;color:var(--text-muted)">
      🍹 Барные позиции отображаются без фото
    </div>`}

    <!-- Модификаторы -->
    <div class="form-row">
      <label style="margin-bottom:10px">Модификаторы</label>
      <div id="modsContainer">${modsHtml}</div>
      <button type="button" class="small-btn" onclick="addModGroup()">+ Добавить группу</button>
    </div>

    <div class="form-actions" style="margin-top:16px">
      <button type="button" class="form-btn form-btn-primary" id="saveItemBtn" onclick="saveEditItem()">💾 Сохранить</button>
      <button type="button" class="form-btn form-btn-secondary" onclick="cancelEdit()">Отмена</button>
      ${!isNew?`<button type="button" class="form-btn form-btn-danger" onclick="deleteItem('${it.id}')">Удалить</button>`:''}
    </div>
  </div>`;
}

function renderModGroupEditor(mg, gi) {
  const opts = (mg.options||[]).map((opt,oi)=>`
    <div class="mod-option-row">
      <input class="mod-option-input" value="${esc(opt.name)}" placeholder="RU" oninput="editModOption(${gi},${oi},'name',this.value)">
      <input class="mod-option-input" style="opacity:.7" value="${esc(opt.name_en||'')}" placeholder="EN" oninput="editModOption(${gi},${oi},'name_en',this.value)">
      <input class="mod-option-price-input" type="number" value="${opt.priceAdj||0}" oninput="editModOption(${gi},${oi},'priceAdj',+this.value)">
      <button type="button" class="mod-option-del" onclick="delModOption(${gi},${oi})">✕</button>
    </div>`).join('');
  return `<div class="mod-editor">
    <div class="mod-editor-header">
      <div style="display:flex;gap:6px;flex:1">
        <input class="mod-option-input" style="font-weight:600" value="${esc(mg.name)}" placeholder="RU" oninput="editModGroup(${gi},'name',this.value)">
        <input class="mod-option-input" style="opacity:.7" value="${esc(mg.name_en||'')}" placeholder="EN" oninput="editModGroup(${gi},'name_en',this.value)">
      </div>
      <div style="display:flex;gap:6px;align-items:center;margin-left:8px">
        <div class="toggle-wrap" style="font-size:11px">
          <label class="toggle">
            <input type="checkbox" ${mg.required?'checked':''} onchange="editModGroup(${gi},'required',this.checked)">
            <span class="toggle-slider"></span>
          </label>
          Обяз.
        </div>
        <button type="button" class="small-btn" style="border-color:rgba(200,16,46,.3);color:var(--red)" onclick="delModGroup(${gi})">✕</button>
      </div>
    </div>
    ${opts}
    <button type="button" class="small-btn" onclick="addModOption(${gi})">+ Опция</button>
  </div>`;
}

function toggleBadge(b, btn) {
  if (!adminEditing) return;
  const arr = adminEditing.badges || [];
  adminEditing.badges = arr.includes(b) ? arr.filter(x=>x!==b) : [...arr,b];
  btn.classList.toggle('on', adminEditing.badges.includes(b));
}

function refreshImgPreview(url) {
  const box = document.getElementById('imgPreviewBox');
  if (!box) return;
  box.innerHTML = url
    ? `<img src="${url}" style="width:100%;height:100%;object-fit:cover">`
    : `<svg viewBox="0 0 24 24" style="width:32px;height:32px;fill:var(--border)"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>`;
}

async function uploadImg(e) {
  const file = e.target.files[0]; if(!file) return;
  if (file.size > 5*1024*1024) { toast('Файл слишком большой (макс 5 МБ)'); return; }
  const label = document.getElementById('imgUploadLabel');
  if (label) label.firstChild.textContent = '⏳ Загрузка...';
  try {
    const url = await uploadImageToServer(file);
    adminEditing.img = url;
    refreshImgPreview(url);
    const inp = document.getElementById('imgUrlInput');
    if (inp) inp.value = url;
    toast('Фото загружено ✓');
  } catch(err) { toast('Ошибка: '+err.message); }
  finally { if(label) label.firstChild.textContent = '📁 Загрузить с устройства'; }
}

function addModGroup() {
  if(!adminEditing) return;
  if(!adminEditing.mods) adminEditing.mods=[];
  adminEditing.mods.push({id:'mod_'+Date.now(),name:'',name_en:'',required:false,options:[{id:'opt1',name:'',name_en:'',priceAdj:0}]});
  refreshModsContainer();
}
function addModOption(gi)      { adminEditing.mods[gi].options.push({id:'opt_'+Date.now(),name:'',name_en:'',priceAdj:0}); refreshModsContainer(); }
function delModGroup(gi)       { adminEditing.mods.splice(gi,1); refreshModsContainer(); }
function delModOption(gi,oi)   { adminEditing.mods[gi].options.splice(oi,1); refreshModsContainer(); }
function editModGroup(gi,f,v)  { if(adminEditing) adminEditing.mods[gi][f]=v; }
function editModOption(gi,oi,f,v){ if(adminEditing) adminEditing.mods[gi].options[oi][f]=v; }
function refreshModsContainer() {
  const c = document.getElementById('modsContainer');
  if(c) c.innerHTML = (adminEditing.mods||[]).map((mg,gi)=>renderModGroupEditor(mg,gi)).join('');
}

async function saveEditItem() {
  if(!adminEditing) return;
  if(!adminEditing.name.trim()) { toast('Введите название'); return; }
  if(!adminEditing.price)       { toast('Введите цену'); return; }
  const btn = document.getElementById('saveItemBtn');
  if(btn) { btn.disabled=true; btn.textContent='⏳ Сохранение...'; }
  try {
    const idx = data.items.findIndex(it=>it.id===adminEditing.id);
    if(idx>=0) data.items[idx]=adminEditing; else data.items.push(adminEditing);
    await saveData();
    adminEditing=null; renderAdmin(); toast('Сохранено ✓');
  } catch(e) {
    toast('Ошибка: '+e.message);
    if(btn) { btn.disabled=false; btn.textContent='💾 Сохранить'; }
  }
}

function cancelEdit() { adminEditing=null; renderAdmin(); }

async function deleteItem(id) {
  if(!confirm('Удалить?')) return;
  const item = data.items.find(it=>it.id===id);
  data.items = data.items.filter(it=>it.id!==id);
  try {
    await saveData();
    if(item?.img) await deleteImageFromServer(item.img);
    if(adminEditing?.id===id) adminEditing=null;
    renderAdmin(); toast('Удалено');
  } catch(e) { toast('Ошибка: '+e.message); }
}

/* ── Categories Tab ── */
function renderCategoriesTab() {
  const cats = sortedCats();
  const typeLabels = {food:'🍽 Еда', bar:'🍹 Бар', desserts:'🍰 Десерты'};
  let html = `<button class="admin-add-btn" onclick="startEditCat(null)">+ Добавить категорию</button>`;
  if(catEditing!==null) html+=renderCatEditor();
  html += cats.map((c,i)=>{
    const count = data.items.filter(it=>it.cat===c.id).length;
    return `<div class="admin-list-item">
      <div class="admin-list-info">
        <div class="admin-list-name">${esc(c.nameShort)} — ${esc(c.name)}</div>
        <div class="admin-list-sub">${typeLabels[c.type]||'🍽 Еда'} · ${count} позиций</div>
      </div>
      <div style="display:flex;gap:4px;margin-right:6px">
        <button class="small-btn" onclick="moveCat('${c.id}',-1)" ${i===0?'disabled':''}>↑</button>
        <button class="small-btn" onclick="moveCat('${c.id}',1)"  ${i===cats.length-1?'disabled':''}>↓</button>
      </div>
      <div class="admin-list-actions">
        <button class="admin-edit-btn" onclick="startEditCat('${c.id}')">✎</button>
        <button class="admin-del-btn"  onclick="deleteCat('${c.id}')">✕</button>
      </div>
    </div>`;
  }).join('');
  document.getElementById('adminContent').innerHTML = html;
}

function renderCatEditor() {
  const c   = catEditing;
  const isNew = !data.categories.find(x=>x.id===c.id);
  return `<div class="admin-form" id="catEditorForm">
    <h3>${isNew?'Новая категория':'Редактировать категорию'}</h3>
    <div class="form-row">
      <label>Тип категории</label>
      <select class="form-select" onchange="catEditing.type=this.value">
        <option value="food"${c.type==='food'?' selected':''}>🍽 Еда</option>
        <option value="bar"${c.type==='bar'?' selected':''}>🍹 Бар (без фото, список)</option>
        <option value="desserts"${c.type==='desserts'?' selected':''}>🍰 Десерты (с фото)</option>
      </select>
    </div>
    <div class="form-row-2">
      <div class="form-row" style="margin:0">
        <label>Кнопка в nav 🇷🇺</label>
        <input class="form-input" value="${esc(c.nameShort)}" oninput="catEditing.nameShort=this.value" placeholder="BBQ">
      </div>
      <div class="form-row" style="margin:0">
        <label>Nav button 🇬🇧</label>
        <input class="form-input" value="${esc(c.nameShort_en||'')}" oninput="catEditing.nameShort_en=this.value" placeholder="BBQ">
      </div>
    </div>
    <div class="form-row-2">
      <div class="form-row" style="margin:0">
        <label>Название 🇷🇺</label>
        <input class="form-input" value="${esc(c.name)}" oninput="catEditing.name=this.value" placeholder="Korean BBQ">
      </div>
      <div class="form-row" style="margin:0">
        <label>Name 🇬🇧</label>
        <input class="form-input" value="${esc(c.name_en||'')}" oninput="catEditing.name_en=this.value" placeholder="Korean BBQ">
      </div>
    </div>
    <div class="form-row-2">
      <div class="form-row" style="margin:0">
        <label>Описание 🇷🇺</label>
        <input class="form-input" value="${esc(c.desc||'')}" oninput="catEditing.desc=this.value">
      </div>
      <div class="form-row" style="margin:0">
        <label>Description 🇬🇧</label>
        <input class="form-input" value="${esc(c.desc_en||'')}" oninput="catEditing.desc_en=this.value">
      </div>
    </div>
    <div class="form-actions">
      <button type="button" class="form-btn form-btn-primary"   onclick="saveEditCat()">💾 Сохранить</button>
      <button type="button" class="form-btn form-btn-secondary" onclick="cancelCatEdit()">Отмена</button>
    </div>
  </div>`;
}

function startEditCat(id) {
  catEditing = id
    ? deepClone(data.categories.find(c=>c.id===id)||{})
    : {id:'cat_'+Date.now(),type:'food',nameShort:'',nameShort_en:'',name:'',name_en:'',desc:'',desc_en:'',order:data.categories.length};
  renderAdmin();
  setTimeout(()=>document.getElementById('catEditorForm')?.scrollIntoView({behavior:'smooth',block:'start'}),100);
}

async function saveEditCat() {
  if(!catEditing.nameShort.trim()){toast('Введите короткое название');return;}
  const idx=data.categories.findIndex(c=>c.id===catEditing.id);
  if(idx>=0) data.categories[idx]=catEditing; else data.categories.push(catEditing);
  try { await saveData(); catEditing=null; renderAdmin(); toast('Категория сохранена ✓'); }
  catch(e){ toast('Ошибка: '+e.message); }
}

function cancelCatEdit(){ catEditing=null; renderAdmin(); }

async function deleteCat(id) {
  const count=data.items.filter(it=>it.cat===id).length;
  if(!confirm(count>0?`В категории ${count} позиций — они тоже удалятся. Продолжить?`:'Удалить категорию?')) return;
  data.categories=data.categories.filter(c=>c.id!==id);
  data.items=data.items.filter(it=>it.cat!==id);
  try { await saveData(); renderAdmin(); toast('Удалено'); }
  catch(e){ toast('Ошибка: '+e.message); }
}

async function moveCat(id,dir) {
  const cats=sortedCats();
  const idx=cats.findIndex(c=>c.id===id);
  const ni=idx+dir;
  if(ni<0||ni>=cats.length) return;
  [cats[idx].order,cats[ni].order]=[cats[ni].order,cats[idx].order];
  data.categories=data.categories.map(c=>cats.find(x=>x.id===c.id)||c);
  try { await saveData(); renderAdmin(); } catch(e){ toast('Ошибка: '+e.message); }
}

/* ── Settings Tab ── */
function renderSettingsTab() {
  const adminUrl = `${location.origin}${location.pathname}#admin-seoulm33t`;
  document.getElementById('adminContent').innerHTML = `
    <div class="admin-form">
      <h3>Контент сайта</h3>
      <div class="form-row-2">
        <div class="form-row" style="margin:0">
          <label>Баннер 🇷🇺</label>
          <input class="form-input" value="${esc(data.settings.complimentText||'')}"
                 oninput="data.settings.complimentText=this.value">
        </div>
        <div class="form-row" style="margin:0">
          <label>Banner 🇬🇧</label>
          <input class="form-input" value="${esc(data.settings.complimentText_en||'')}"
                 oninput="data.settings.complimentText_en=this.value">
        </div>
      </div>
      <div class="form-row-2">
        <div class="form-row" style="margin:0">
          <label>Время работы 🇷🇺</label>
          <input class="form-input" value="${esc(data.settings.workingHours||'12:00 – 00:00')}"
                 oninput="data.settings.workingHours=this.value" placeholder="12:00 – 00:00">
        </div>
        <div class="form-row" style="margin:0">
          <label>Working hours 🇬🇧</label>
          <input class="form-input" value="${esc(data.settings.workingHours_en||'12:00 – 00:00')}"
                 oninput="data.settings.workingHours_en=this.value" placeholder="12:00 – 00:00">
        </div>
      </div>
      <div class="form-row-2">
        <div class="form-row" style="margin:0">
          <label>Аллергены 🇷🇺</label>
          <textarea class="form-textarea" style="min-height:80px"
                    oninput="data.settings.allergenText=this.value">${esc(data.settings.allergenText||'')}</textarea>
        </div>
        <div class="form-row" style="margin:0">
          <label>Allergens 🇬🇧</label>
          <textarea class="form-textarea" style="min-height:80px"
                    oninput="data.settings.allergenText_en=this.value">${esc(data.settings.allergenText_en||'')}</textarea>
        </div>
      </div>
      <div class="form-row">
        <label>Новый пароль Admin Panel</label>
        <input class="form-input" type="password" id="newPassInput" placeholder="Оставьте пустым — не меняется">
      </div>
      <div class="form-row">
        <label>Подтвердите пароль</label>
        <input class="form-input" type="password" id="newPassConfirm">
      </div>
      <div class="form-actions">
        <button class="form-btn form-btn-primary" onclick="saveSettings()">💾 Сохранить</button>
      </div>
    </div>

    <div class="admin-form" style="border-color:rgba(200,16,46,.2)">
      <h3 style="color:var(--red)">⚠️ Опасная зона</h3>
      <p style="font-size:12px;color:var(--text-muted);margin-bottom:12px">Восстановит исходное меню.</p>
      <button class="form-btn form-btn-danger" onclick="resetData()">Сбросить всё к исходному</button>
    </div>

    <div style="padding:16px;font-size:11px;color:var(--text-muted);text-align:center;line-height:1.8">
      Admin Panel: <span style="color:var(--gold);word-break:break-all">${adminUrl}</span>
    </div>`;
}

async function saveSettings() {
  const np=document.getElementById('newPassInput').value;
  const nc=document.getElementById('newPassConfirm').value;
  if(np) {
    if(np!==nc){toast('Пароли не совпадают');return;}
    if(np.length<4){toast('Пароль слишком короткий');return;}
    data.settings.adminPassword=np;
  }
  try { await saveData(); renderCompliment(); toast('Настройки сохранены ✓'); }
  catch(e){ toast('Ошибка: '+e.message); }
}
