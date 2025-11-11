// modules/auth.js
import { supabase } from '../lib/supabaseClient.js';


// Shared global (tiny pubsub) — other modules can read window.EW.user and listen to events
window.EW = window.EW || {};
window.EW.events = window.EW.events || new Map();
window.EW.on = (name, cb) => { (window.EW.events.get(name) || window.EW.events.set(name,[])).push(cb); };
window.EW.emit = (name, payload) => { (window.EW.events.get(name) || []).forEach(cb=>cb(payload)); };


const emailEl = document.getElementById('email');
const btnSignIn = document.getElementById('btnSignIn');
const btnSignOut = document.getElementById('btnSignOut');
const userArea = document.getElementById('userArea');


btnSignIn.addEventListener('click', async ()=>{
const email = emailEl.value.trim();
if (!email) return alert('Enter an email');
btnSignIn.disabled = true;
const { error } = await supabase.auth.signInWithOtp({ email });
btnSignIn.disabled = false;
if (error) return alert(error.message);
alert('Magic link sent to ' + email);
});


btnSignOut.addEventListener('click', async ()=>{
await supabase.auth.signOut();
setUser(null);
});


supabase.auth.onAuthStateChange((_event, session) => {
setUser(session?.user ?? null);
});


async function init(){
const { data } = await supabase.auth.getUser();
setUser(data.user ?? null);
}


function setUser(user){
window.EW.user = user;
userArea.textContent = user ? user.email : 'Not signed in';
window.EW.emit('auth.change', user);
}


init();