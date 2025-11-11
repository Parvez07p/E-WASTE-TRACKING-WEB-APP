// modules/admin.js
import { supabase } from '../lib/supabaseClient.js';


const adminCard = document.getElementById('adminCard');
const adminPickups = document.getElementById('adminPickups');


async function loadAdmin(){
if (!window.EW.user) return hide();
const { data } = await supabase.from('profiles').select('role').eq('id', window.EW.user.id).single();
const isAdmin = data?.role === 'admin';
if (!isAdmin) return hide();
adminCard.style.display='block';
await loadPickups();
}


function hide(){ adminCard.style.display='none'; adminPickups.innerHTML='—'; }


async function loadPickups(){
const { data, error } = await supabase.from('pickups').select('*, ewaste:ewaste_id(title), user: user_id(email)').order('created_at',{ascending:false}).limit(200);
if (error) { adminPickups.textContent='Err: '+error.message; return; }
adminPickups.innerHTML='';
for (const p of data){ const d=document.createElement('div'); d.className='item'; d.innerHTML = `<strong>${p.ewaste?.title||'—'}</strong> — ${p.user?.email||''} — ${p.address} <div class='small muted'>Status: ${p.status} <button data-id='${p.id}'>Complete</button></div>`; adminPickups.appendChild(d); }
adminPickups.querySelectorAll('button[data-id]').forEach(btn=>btn.addEventListener('click', async ()=>{ const id = btn.getAttribute('data-id'); await supabase.from('pickups').update({ status:'completed', updated_at: new Date() }).eq('id', id); loadPickups(); }));
}


window.EW.on('auth.change', ()=> loadAdmin());


// Realtime update to admin pickups
supabase.channel('public:pickups').on('postgres_changes',{event:'*',schema:'public',table:'pickups'},()=> loadAdmin()).subscribe();


loadAdmin();