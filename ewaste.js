// modules/ewaste.js
for (const it of items){
const d = document.createElement('div'); d.className='item';
d.innerHTML = `<strong>${escapeHtml(it.title)}</strong> <div class="small muted">${it.category} • ${it.condition}</div>`;
if (it.description) d.innerHTML += `<div class="small muted">${escapeHtml(it.description)}</div>`;
if (it.image_path){
const img = document.createElement('img'); img.className='preview';
supabase.storage.from('ewaste-images').createSignedUrl(it.image_path,60).then(({ data })=>{ if (data?.signedUrl) img.src = data.signedUrl; });
d.appendChild(img);
}
listEl.appendChild(d);
}



function populatePickSelect(items){
pickupItem.innerHTML='';
const opt = document.createElement('option'); opt.value=''; opt.textContent='-- select your item --'; pickupItem.appendChild(opt);
for (const it of items){ const o=document.createElement('option'); o.value = it.id; o.textContent = it.title; pickupItem.appendChild(o); }
}


btnAdd.addEventListener('click', async ()=>{
if (!window.EW.user) return alert('Sign in first');
const title = titleEl.value.trim(); if (!title) return alert('Enter title');
addStatus.textContent='Saving...';
try{
let imagePath = null;
const file = fileEl.files?.[0];
if (file){
const path = `${window.EW.user.id}/${Date.now()}-${file.name}`;
const { error: upErr } = await supabase.storage.from('ewaste-images').upload(path, file);
if (upErr) throw upErr;
imagePath = path;
}
const payload = { owner: window.EW.user.id, title, description: descEl.value || null, category: categoryEl.value, condition: conditionEl.value, image_path: imagePath };
const { error } = await supabase.from('ewastes').insert([payload]);
if (error) throw error;
addStatus.textContent='Saved';
titleEl.value=''; descEl.value=''; fileEl.value='';
loadAll();
}catch(err){ addStatus.textContent='Err: '+(err.message||err); }
setTimeout(()=>addStatus.textContent='',2000);
});


// Subscribe to auth changes to refresh lists when user signs in/out
window.EW.on('auth.change', ()=> loadAll());


// Realtime subscription
supabase.channel('public:ewastes').on('postgres_changes',{event:'*',schema:'public',table:'ewastes'},()=> loadAll()).subscribe();


// init
loadAll();


function escapeHtml(s){ if(!s) return ''; return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }