// modules/pickups.js
import { supabase } from '../lib/supabaseClient.js';


const pickupItem = document.getElementById('pickupItem');
const addressEl = document.getElementById('address');
const pdateEl = document.getElementById('pdate');
const btnPickup = document.getElementById('btnPickup');
const pickupStatus = document.getElementById('pickupStatus');
const myPickups = document.getElementById('myPickups');


btnPickup.addEventListener('click', async ()=>{
if (!window.EW.user) return alert('Sign in first');
const ewaste_id = pickupItem.value || null; const address = addressEl.value.trim();
if (!address) return alert('Enter address');
pickupStatus.textContent='Requesting...';
const { error } = await supabase.from('pickups').insert([{ user_id: window.EW.user.id, ewaste_id, address, preferred_date: pdateEl.value || null }]);
if (error) pickupStatus.textContent='Err: '+error.message; else pickupStatus.textContent='Requested';
setTimeout(()=>pickupStatus.textContent='',2000);
refreshMyPickups();
});


async function refreshMyPickups(){
if (!window.EW.user){ myPickups.textContent='Sign in to see pickups'; return; }
const { data, error } = await supabase.from('pickups').select('*, ewaste:ewaste_id(title)').eq('user_id', window.EW.user.id).order('created_at',{ascending:false});
if (error) { myPickups.textContent='Err: '+error.message; return; }
if (!data.length) { myPickups.textContent='No pickups yet'; return; }
myPickups.innerHTML='';
for (const p of data){ const d=document.createElement('div'); d.className='item'; d.innerHTML = `<strong>${p.ewaste?.title||'—'}</strong> — ${p.address} <div class='small muted'>Status: ${p.status}</div>`; myPickups.appendChild(d); }
}


window.EW.on('auth.change', ()=> refreshMyPickups());


// Realtime subscriptions for pickups
supabase.channel('public:pickups').on('postgres_changes',{event:'*',schema:'public',table:'pickups'},()=> refreshMyPickups()).subscribe();


refreshMyPickups();