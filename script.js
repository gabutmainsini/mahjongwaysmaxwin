const symbols = ['🀄','🀙','🀐','🀆','🀃','🀀'];
const reels = document.getElementById('reels');
const saldoDisplay = document.getElementById('saldo');
let saldo = 0;
let autoSpin = false;
let winMode = localStorage.getItem("winMode") || "auto";
const spinSound = document.getElementById("spinSound");

function updateSaldoDisplay() {
  saldoDisplay.textContent = saldo;
  const users = JSON.parse(localStorage.getItem("users") || "{}");
  const name = localStorage.getItem("currentUser");
  if (name && users[name]) {
    users[name].saldo = saldo;
    localStorage.setItem("users", JSON.stringify(users));
  }
}

function hasilMenang() {
  if (winMode === "forceWin") return "jackpot"; // Paksa jackpot
  if (winMode === "forceLose") return "lose";   // Paksa kalah

  const rand = Math.random();
  if (rand < 0.05) return "jackpot";    // 5%
  if (rand < 0.45) return "win";        // 40%
  return "lose";                        // 55%
}

function spin() {
  const bet = parseInt(document.getElementById('bet').value);
  if (bet < 400 || saldo < bet) return alert('Saldo tidak cukup atau bet terlalu kecil!');
  saldo -= bet;

  if (spinSound) {
    spinSound.currentTime = 0;
    spinSound.play();
  }

  reels.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const simbol = symbols[Math.floor(Math.random() * symbols.length)];
    const div = document.createElement('div');
    div.className = 'reel';
    div.textContent = simbol;
    reels.appendChild(div);
  }

  const hasil = hasilMenang();
  if (hasil === "jackpot") {
    saldo += bet * 10;
    alert("JACKPOT x10!");
    document.body.classList.add("flash-win");
  } else if (hasil === "win") {
    saldo += bet * 2;
    alert("MENANG x2!");
    document.body.classList.add("flash-win");
  } else {
    // Tidak perlu alert kalah jika tidak diinginkan
    document.body.classList.add("flash-lose");
  }

  setTimeout(() => {
    document.body.classList.remove("flash-win", "flash-lose");
  }, 800);

  updateSaldoDisplay();
  if (autoSpin) setTimeout(spin, 1000);
}

function toggleAutoSpin() {
  autoSpin = !autoSpin;
  alert("Auto spin: " + (autoSpin ? "Aktif" : "Mati"));
  if (autoSpin) spin();
}

function openWhatsApp() {
  window.open('https://wa.me/6288224274374?text=Halo%20Admin,%20saya%20ingin%20deposit', '_blank');
}

function showLogin() {
  document.getElementById('loginForm').style.display = 'block';
}

function adminLogin() {
  const u = document.getElementById("adminUser").value;
  const p = document.getElementById("adminPass").value;
  if (u === "vinzz" && p === "123") {
    document.getElementById("adminPanel").style.display = 'block';
    document.getElementById("loginForm").style.display = 'none';
  } else {
    alert("Login gagal");
  }
}

function kirimSaldo() {
  const user = document.getElementById("targetUser").value;
  const amt = parseInt(document.getElementById("saldoTambah").value);
  const data = JSON.parse(localStorage.getItem("users") || "{}");
  if (!data[user]) data[user] = { saldo: 0, blokir: false };
  data[user].saldo += amt;
  localStorage.setItem("users", JSON.stringify(data));
  alert("Saldo dikirim ke " + user);
}

function hapusUser() {
  const user = document.getElementById("targetUser").value;
  const data = JSON.parse(localStorage.getItem("users") || "{}");
  delete data[user];
  localStorage.setItem("users", JSON.stringify(data));
  alert("User dihapus.");
}

function blokirUser() {
  const user = document.getElementById("targetUser").value;
  const data = JSON.parse(localStorage.getItem("users") || "{}");
  if (!data[user]) data[user] = { saldo: 0, blokir: false };
  data[user].blokir = true;
  localStorage.setItem("users", JSON.stringify(data));
  alert("User diblokir.");
}

function bukaBlokir() {
  const user = document.getElementById("targetUser").value;
  const data = JSON.parse(localStorage.getItem("users") || "{}");
  if (!data[user]) data[user] = { saldo: 0, blokir: false };
  data[user].blokir = false;
  localStorage.setItem("users", JSON.stringify(data));
  alert("User dibuka blokir.");
}

function setWinMode() {
  winMode = document.getElementById("winMode").value;
  localStorage.setItem("winMode", winMode);
  alert("Mode kemenangan diatur ke: " + winMode);
}

function lihatSemuaUser() {
  const data = JSON.parse(localStorage.getItem("users") || "{}");
  let teks = "Daftar User:\n";
  for (let u in data) {
    teks += `${u} - Saldo: ${data[u].saldo} - Blokir: ${data[u].blokir}\n`;
  }
  document.getElementById("listUser").textContent = teks;
}

// === LOGIN USER BIASA ===
function loginUser() {
  const name = document.getElementById("usernameInput").value.trim().toLowerCase();
  if (!name) return alert("Masukkan username!");

  const users = JSON.parse(localStorage.getItem("users") || "{}");

  if (!users[name]) {
    users[name] = { saldo: 10000, blokir: false };
  }

  if (users[name].blokir) {
    return alert("Akun Anda diblokir!");
  }

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", name);

  saldo = users[name].saldo;
  updateSaldoDisplay();

  // Tampilkan game, sembunyikan login
  document.getElementById("userLogin").style.display = "none";
  document.querySelector(".container").style.display = "block";
}

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", name);

  saldo = users[name].saldo;
  updateSaldoDisplay();
  document.getElementById("userLogin").style.display = "none";
  document.querySelector(".container").style.display = "block";
}

// Cek status login saat halaman dimuat
window.onload = () => {
  const current = localStorage.getItem("currentUser");
  const users = JSON.parse(localStorage.getItem("users") || "{}");

  if (!current || !users[current]) {
    document.getElementById("userLogin").style.display = "block";
    document.querySelector(".container").style.display = "none";
  } else {
    if (users[current].blokir) {
      alert("Akun Anda diblokir!");
      return;
    }
    saldo = users[current].saldo;
    updateSaldoDisplay();
    document.getElementById("userLogin").style.display = "none";
    document.querySelector(".container").style.display = "block";
  }
};