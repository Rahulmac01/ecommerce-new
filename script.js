// Simple front-end demo auth + cart using localStorage
(function() {
  const $ = (sel) => document.querySelector(sel);
  const byId = (id) => document.getElementById(id);

  // Common: footer year
  const yearEl = byId('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Auth helpers ----
  const USERS_KEY = 'myshop_users';
  const CURRENT_USER_KEY = 'myshop_current_user';
  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch { return []; }
  }
  function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
  function setCurrentUser(email) { localStorage.setItem(CURRENT_USER_KEY, email); }
  function getCurrentUser() { return localStorage.getItem(CURRENT_USER_KEY); }
  function getCurrentUserName() {
    const email = getCurrentUser();
    if (!email) return null;
    const u = getUsers().find(x => x.email === email);
    return u ? u.name : null;
  }
  function logout() { localStorage.removeItem(CURRENT_USER_KEY); location.href = 'index.html'; }

  // ---- Nav UI ----
  const welcomeEl = byId('welcomeUser');
  const loginLink = byId('loginLink');
  const registerLink = byId('registerLink');
  const logoutBtn = byId('logoutBtn');
  const name = getCurrentUserName();
  if (welcomeEl) {
    if (name) {
      welcomeEl.textContent = 'Hi, ' + name;
      if (loginLink) loginLink.style.display = 'none';
      if (registerLink) registerLink.style.display = 'none';
      if (logoutBtn) {
        logoutBtn.style.display = 'inline-block';
        logoutBtn.addEventListener('click', logout);
      }
    } else {
      if (logoutBtn) logoutBtn.style.display = 'none';
    }
  }

  // ---- Register page ----
  const regForm = byId('registerForm');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = byId('regName').value.trim();
      const email = byId('regEmail').value.trim().toLowerCase();
      const password = byId('regPassword').value;
      const confirm = byId('regConfirm').value;
      const msg = byId('registerMessage');

      if (!name || !email || !password || !confirm) return showMsg(msg, 'Please fill all fields.');
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return showMsg(msg, 'Enter a valid email.');
      if (password.length < 6) return showMsg(msg, 'Password must be at least 6 characters.');
      if (password !== confirm) return showMsg(msg, 'Passwords do not match.');

      const users = getUsers();
      if (users.some(u => u.email === email)) return showMsg(msg, 'Email already registered. Try login.');
      users.push({ name, email, password });
      saveUsers(users);
      showMsg(msg, 'Registered! Redirecting to login...', true);
      setTimeout(() => location.href = 'login.html', 900);
    });
  }

  // ---- Login page ----
  const loginForm = byId('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = byId('loginEmail').value.trim().toLowerCase();
      const password = byId('loginPassword').value;
      const msg = byId('loginMessage');
      const users = getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) return showMsg(msg, 'Invalid email or password.');
      setCurrentUser(email);
      showMsg(msg, 'Login successful! Redirecting...', true);
      setTimeout(() => location.href = 'index.html', 700);
    });
  }

  function showMsg(el, text, ok=false) {
    if (!el) return;
    el.textContent = text;
    el.className = 'message show';
    el.style.borderColor = ok ? '#10b981' : '#ef4444';
    el.style.background = ok ? '#10251f' : '#2b1515';
  }

  // ---- Cart ----
  const CART_KEY = 'myshop_cart';
  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
  }
  function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartUI(); }

  function updateCartUI() {
    const cart = getCart();
    const count = cart.reduce((acc, i) => acc + i.qty, 0);
    const total = cart.reduce((acc, i) => acc + i.qty * i.price, 0);
    const cartCountEl = byId('cartCount');
    const totalEl = byId('cartTotal');
    const itemsEl = byId('cartItems');
    if (cartCountEl) cartCountEl.textContent = count;
    if (totalEl) totalEl.textContent = total.toString();
    if (itemsEl) {
      itemsEl.innerHTML = '';
      cart.forEach(item => {
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = \`\${item.name} × \${item.qty} — ₹\${item.price * item.qty}
          <div>
            <button class="btn-link" data-act="minus" data-id="\${item.id}">-</button>
            <button class="btn-link" data-act="plus" data-id="\${item.id}">+</button>
            <button class="btn-link" data-act="remove" data-id="\${item.id}">Remove</button>
          </div>\`;
        itemsEl.appendChild(row);
      });
      itemsEl.addEventListener('click', (e) => {
        const t = e.target;
        if (!(t instanceof HTMLElement)) return;
        const id = t.getAttribute('data-id');
        const act = t.getAttribute('data-act');
        if (!id || !act) return;
        const cart = getCart();
        const idx = cart.findIndex(x => x.id === id);
        if (idx === -1) return;
        if (act === 'plus') cart[idx].qty += 1;
        if (act === 'minus') cart[idx].qty = Math.max(1, cart[idx].qty - 1);
        if (act === 'remove') cart.splice(idx,1);
        saveCart(cart);
      }, { once: true });
    }
  }

  function addToCart(id, name, price) {
    const cart = getCart();
    const found = cart.find(x => x.id === id);
    if (found) found.qty += 1; else cart.push({ id, name, price: Number(price), qty: 1 });
    saveCart(cart);
  }

  // Hook product buttons
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      addToCart(btn.dataset.id, btn.dataset.name, btn.dataset.price);
    });
  });

  const clearCartBtn = byId('clearCart');
  if (clearCartBtn) clearCartBtn.addEventListener('click', () => { saveCart([]); });

  // Initial paint
  updateCartUI();
})();