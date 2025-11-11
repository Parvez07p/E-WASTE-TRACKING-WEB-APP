// script.js
import { supabase } from "./supabaseClient.js";

// Example: Fetch data or test connection
async function testConnection() {
  const { data, error } = await supabase.from('your_table_name').select('*');
  
  if (error) {
    console.error("❌ Error fetching data:", error.message);
  } else {
    console.log("✅ Data fetched successfully:", data);
  }
}

testConnection();

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  // 🔒 Simple check (replace later with Supabase or real database)
  if (username === "admin" && password === "12345") {
    // Redirect to main app
    window.location.href = "index.html";
} else {
    errorMsg.textContent = "Invalid username or password. Try again!";
  }
});
