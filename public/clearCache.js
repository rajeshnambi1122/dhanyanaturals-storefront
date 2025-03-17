// Script to clear Medusa store cache
(function() {
  console.log("Starting advanced cache clearing process...");
  
  // Helper function to completely clear all cookies
  function clearAllCookies() {
    document.cookie.split(";").forEach(function(c) {
      const cookie = c.trim();
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      
      // Different paths to ensure all cookies are cleared
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/gb";
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/in";
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      console.log("Cleared cookie:", name);
    });
  }
  
  // Clear all cookies
  clearAllCookies();
  
  // Clear all localStorage
  console.log("Clearing localStorage...");
  localStorage.clear();
  
  // Clear all sessionStorage
  console.log("Clearing sessionStorage...");
  sessionStorage.clear();
  
  console.log("Cache clearing completed!");
  
  // Create a message on the page
  const body = document.body;
  const message = document.createElement("div");
  message.style.padding = "20px";
  message.style.margin = "20px auto";
  message.style.maxWidth = "600px";
  message.style.backgroundColor = "#f0f9ff";
  message.style.border = "1px solid #bae6fd";
  message.style.borderRadius = "6px";
  message.style.fontFamily = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
  
  message.innerHTML = `
    <h1 style="color: #0284c7; margin-bottom: 10px; font-size: 24px;">Cache Cleared Successfully</h1>
    <p style="margin-bottom: 15px; font-size: 16px;">All data has been cleared from your browser:</p>
    <ul style="margin-bottom: 15px; padding-left: 20px;">
      <li>All cookies cleared</li>
      <li>Local storage reset</li>
      <li>Session storage reset</li>
    </ul>
    <p style="margin-bottom: 15px;">The page will reload in 2 seconds.</p>
    <p><a href="/in" style="color: #0284c7; text-decoration: underline; font-weight: bold;">Or click here to go to homepage now</a></p>
  `;
  
  body.innerHTML = '';
  body.appendChild(message);
  
  // Reload the page after 2 seconds
  setTimeout(function() {
    window.location.href = '/in';
  }, 2000);
})(); 