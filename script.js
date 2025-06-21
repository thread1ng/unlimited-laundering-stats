const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const letters = "01";
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00FF00";
  ctx.font = `${fontSize}px monospace`;
  drops.forEach((y, i) => {
    const text = letters[Math.floor(Math.random() * letters.length)];
    const x = i * fontSize;
    ctx.fillText(text, x, y * fontSize);
    if (y * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  });
}

setInterval(drawMatrix, 40);
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let lastCount = 0;

function animateCount(target) {
  const display = document.getElementById("total-community-count");
  let current = 0;
  const increment = Math.ceil(target / 50);
  const interval = setInterval(() => {
    current += increment;
    if (current >= target) {
      display.textContent = `${target} Total Users`;
      clearInterval(interval);
    } else {
      display.textContent = `${current} Total Users`;
    }
  }, 30);
}

async function fetchTotalCommunityCount() {
  try {
    const response = await fetch("https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLgb6nLVXG79mrwYa_GO1jFAW9Wni_sQStBJBw1LDrfWgUE54D8eS_0UeFCa7GHy_oftrz4KXyf3JEKFKPxvA3qiNLq7eKoqTPPMfBrke3OI8jQaW4wUlxZbfKADbQD30lB3PIzNIRcPkv7KuJroku7tZwYTsDvRexR87n8XEplfNMA63wIPMwDOIjixe7q1YwyXKTf7AcozCkEs-92B6OiN-SalLnxkitPwsd2qzRWCd6MvUgUy8sJ8As7NXNqXb31SXbhIVtjb3EmHAwiYXb1tsJFdcwRUxhhOUEpM&lib=MhCucbsL5snIoggTlPHDt3z_CNhzj7S9w");
    const data = await response.json();
    const communityCount = data.currentUsers;
    const display = document.getElementById("total-community-count");

    if (communityCount !== lastCount) {
      animateCount(communityCount);
      lastCount = communityCount;
    }

    document.getElementById("last-updated").textContent =
      `Last updated: ${new Date().toLocaleTimeString()}`;
  } catch (error) {
    document.getElementById("total-community-count").textContent = "Error loading data";
    document.getElementById("retry-button").style.display = "inline-block";
    console.error("Fetch error:", error);
  }
}

fetchTotalCommunityCount();
setInterval(fetchTotalCommunityCount, 15000);

document.getElementById("retry-button").addEventListener("click", () => {
  document.getElementById("retry-button").style.display = "none";
  fetchTotalCommunityCount();
});
