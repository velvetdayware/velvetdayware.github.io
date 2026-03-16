document.addEventListener('DOMContentLoaded', function () {

  // AOS init
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 700, once: true, offset: 60 });
  }

  // Typed.js hero
  const typedEl = document.getElementById('typedTarget');
  if (typedEl && typeof Typed !== 'undefined') {
    new Typed('#typedTarget', {
      strings: ['second nature.', 'breathing room.', 'your whole day.', 'pure comfort.'],
      typeSpeed: 55,
      backSpeed: 35,
      backDelay: 2000,
      loop: true,
      showCursor: true,
      cursorChar: '|'
    });
  }

  // Nav scroll effect
  const navBar = document.querySelector('.nav-bar');
  if (navBar) {
    window.addEventListener('scroll', function () {
      navBar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // Mobile menu
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const mobileOverlay = document.getElementById('mobileOverlay');

  function openMobileMenu() {
    if (mobileMenu) mobileMenu.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openMobileMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

  // Cart system
  let cart = JSON.parse(localStorage.getItem('vd_cart') || '[]');

  function saveCart() {
    localStorage.setItem('vd_cart', JSON.stringify(cart));
  }

  function updateCartUI() {
    const countEls = document.querySelectorAll('#cartCount');
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    countEls.forEach(el => { el.textContent = total; });

    const cartItemsEl = document.getElementById('cartItems');
    const cartEmptyEl = document.getElementById('cartEmpty');
    const cartFooterEl = document.getElementById('cartFooter');
    const cartTotalEl = document.getElementById('cartTotal');

    if (!cartItemsEl) return;

    const existingItems = cartItemsEl.querySelectorAll('.cart-item');
    existingItems.forEach(el => el.remove());

    if (cart.length === 0) {
      if (cartEmptyEl) cartEmptyEl.style.display = 'flex';
      if (cartFooterEl) cartFooterEl.style.display = 'none';
    } else {
      if (cartEmptyEl) cartEmptyEl.style.display = 'none';
      if (cartFooterEl) cartFooterEl.style.display = 'block';

      let totalPrice = 0;
      cart.forEach(function (item) {
        totalPrice += item.price * item.qty;
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.dataset.id = item.id;
        itemEl.innerHTML = `
          <img src="${item.img}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
            <div class="cart-item-controls">
              <button class="cart-qty-btn minus-btn" data-id="${item.id}" aria-label="Decrease quantity">−</button>
              <span class="cart-qty">${item.qty}</span>
              <button class="cart-qty-btn plus-btn" data-id="${item.id}" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove item"><i class="fa-solid fa-xmark"></i></button>
        `;
        cartItemsEl.appendChild(itemEl);
      });

      if (cartTotalEl) cartTotalEl.textContent = '$' + totalPrice.toFixed(2);
    }
  }

  function addToCart(name, price, img) {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id, name, price: parseFloat(price), img, qty: 1 });
    }
    saveCart();
    updateCartUI();
    openCart();
  }

  function openCart() {
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartDrawer) cartDrawer.classList.add('open');
    if (cartOverlay) cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartDrawer) cartDrawer.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  const cartToggle = document.getElementById('cartToggle');
  const cartClose = document.getElementById('cartClose');
  const cartOverlay = document.getElementById('cartOverlay');

  if (cartToggle) cartToggle.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  document.addEventListener('click', function (e) {
    const addBtn = e.target.closest('.add-to-cart-btn');
    if (addBtn) {
      const name = addBtn.dataset.name;
      const price = addBtn.dataset.price;
      const img = addBtn.dataset.img;
      addToCart(name, price, img);
      addBtn.textContent = 'Added!';
      addBtn.style.background = 'linear-gradient(135deg, #7B9E87, #9BBBA6)';
      setTimeout(function () {
        addBtn.textContent = 'Add to Bag';
        addBtn.style.background = '';
      }, 1800);
    }

    const minusBtn = e.target.closest('.minus-btn');
    if (minusBtn) {
      const id = minusBtn.dataset.id;
      const item = cart.find(i => i.id === id);
      if (item) {
        item.qty -= 1;
        if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
        saveCart();
        updateCartUI();
      }
    }

    const plusBtn = e.target.closest('.plus-btn');
    if (plusBtn) {
      const id = plusBtn.dataset.id;
      const item = cart.find(i => i.id === id);
      if (item) {
        item.qty += 1;
        saveCart();
        updateCartUI();
      }
    }

    const removeBtn = e.target.closest('.cart-item-remove');
    if (removeBtn) {
      const id = removeBtn.dataset.id;
      cart = cart.filter(i => i.id !== id);
      saveCart();
      updateCartUI();
    }
  });

  updateCartUI();

  // Floating contact widget
  const floatToggle = document.getElementById('floatToggle');
  const floatOptions = document.getElementById('floatOptions');
  const floatIcon = document.getElementById('floatIcon');

  if (floatToggle && floatOptions) {
    floatToggle.addEventListener('click', function () {
      const isOpen = floatOptions.classList.contains('open');
      floatOptions.classList.toggle('open');
      if (floatIcon) {
        floatIcon.className = isOpen ? 'fa-solid fa-comment-dots' : 'fa-solid fa-xmark';
      }
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.float-widget')) {
        floatOptions.classList.remove('open');
        if (floatIcon) floatIcon.className = 'fa-solid fa-comment-dots';
      }
    });
  }

  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      window.location.href = 'thanks.html';
    });
  }

  // intl-tel-input
  const phoneInput = document.getElementById('phone');
  if (phoneInput && typeof intlTelInput !== 'undefined') {
    intlTelInput(phoneInput, {
      initialCountry: 'us',
      separateDialCode: true,
    });
  }

});