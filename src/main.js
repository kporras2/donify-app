import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="container">
    <header>
      <div class="logo">
        <img src="${import.meta.env.BASE_URL}logo.png" alt="Donify Logo" style="height: 80px; width: auto; mix-blend-mode: multiply; filter: brightness(1.08);">
      </div>
      <nav>
        <ul>
          <li><a href="#" id="nav-home">Home</a></li>
          <li><a href="#" id="nav-pantry">Online Pantry</a></li>
          <li><a href="#" id="nav-about">About</a></li>
          <li><a href="#" id="nav-donations">My Donations</a></li>
        </ul>
      </nav>
      <button class="btn btn-primary">Donate Now</button>
    </header>
    <main id="main-content">
      <!-- Content will be injected here -->
    </main>
    <div id="toast-container" class="toast-container"></div>
  </div>
`

// Toast Notification System
const showToast = (message, type = 'info') => {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  // Trigger reflow
  void toast.offsetWidth;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      container.removeChild(toast);
    }, 300);
  }, 3000);
};

// Cart Logic with LocalStorage
let cart = JSON.parse(localStorage.getItem('donify_cart')) || [];

const saveCart = () => {
  localStorage.setItem('donify_cart', JSON.stringify(cart));
  updateCartButton();
};

const addToCart = (itemName, price) => {
  cart.push({ name: itemName, price });
  saveCart();
  showToast(`Added ${itemName} to cart!`, 'success');
};

const clearCart = () => {
  cart = [];
  saveCart();
  showToast('Cart cleared', 'info');
  renderPantry();
};

const updateCartButton = () => {
  const btn = document.querySelector('header .btn-primary');
  if (cart.length > 0) {
    btn.textContent = `Cart (${cart.length})`;
    btn.onclick = renderCheckout;
  } else {
    btn.textContent = 'Donate Now';
    btn.onclick = renderPantry;
  }
};

// Simple Router
const mainContent = document.getElementById('main-content');

// SVG Icons
const icons = {
  truck: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
  camera: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`
};

const renderHome = () => {
  mainContent.innerHTML = `
    <div style="display: flex; flex-direction: column; justify-content: center; min-height: calc(100vh - 140px); padding: 1rem 0;">
      
      <!-- Top Section: Hero + Guarantee -->
      <div class="hero-section">
        
        <!-- Hero Text -->
        <div style="text-align: left;">
          <h1 style="font-size: 3.5rem; line-height: 1.1; margin-bottom: 1rem; color: var(--color-text);">
            Giving Made <span style="color: var(--color-accent);">Simple</span>.
          </h1>
          <p style="font-size: 1.1rem; color: var(--color-text-light); margin-bottom: 2rem; max-width: 500px;">
            Donify connects you directly to local shelters. Shop for essentials online and have them delivered to those in need.
          </p>
          <div class="btn-container" style="display: flex; gap: 1rem;">
            <button class="btn btn-primary" id="btn-start-giving">Start Giving</button>
            <button class="btn btn-secondary">Learn More</button>
          </div>
        </div>

        <!-- Transparency Guarantee (Compact) -->
        <div style="background-color: rgba(68, 201, 224, 0.15); padding: 2rem; border-radius: 16px; border: 1px solid rgba(68, 201, 224, 0.3);">
          <h3 style="color: var(--color-accent); margin-bottom: 1.5rem; font-size: 1.3rem;">The Donify Guarantee</h3>
          <div style="display: flex; flex-direction: column; gap: 1.2rem;">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="color: var(--color-blue); transform: scale(0.9);">${icons.truck}</div>
              <div>
                <h4 style="font-size: 1rem; margin-bottom: 0.1rem;">Tracked Delivery</h4>
                <p style="font-size: 0.85rem; color: var(--color-text-light);">Real-time tracking from store to shelter.</p>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="color: var(--color-cyan); transform: scale(0.9);">${icons.check}</div>
              <div>
                <h4 style="font-size: 1rem; margin-bottom: 0.1rem;">Verified Receipt</h4>
                <p style="font-size: 0.85rem; color: var(--color-text-light);">Shelters verify every delivery upon arrival.</p>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div style="color: var(--color-cyan); transform: scale(0.9);">${icons.camera}</div>
              <div>
                <h4 style="font-size: 1rem; margin-bottom: 0.1rem;">Impact Proof</h4>
                <p style="font-size: 0.85rem; color: var(--color-text-light);">See exactly when your item makes a difference.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Feature Cards -->
      <!-- Feature Cards -->
      <section class="features-grid" style="padding: 0;">
        <!-- Card 1: Mint BG, Purple Text -->
        <div class="feature-card" style="padding: 1.5rem; background: var(--color-mint); border-radius: 12px; box-shadow: var(--shadow); text-align: center; color: #8e6aa0;">
          <h3 style="color: #8e6aa0; margin-bottom: 0.5rem; font-size: 1.1rem;">Shop Essentials</h3>
          <p style="font-size: 0.9rem;">Browse our online pantry for food, hygiene, and clothing.</p>
        </div>
        <!-- Card 2: Purple BG, White Text -->
        <div class="feature-card" style="padding: 1.5rem; background: var(--color-lavender); border-radius: 12px; box-shadow: var(--shadow); text-align: center; color: white;">
          <h3 style="color: white; margin-bottom: 0.5rem; font-size: 1.1rem;">Direct Delivery</h3>
          <p style="font-size: 0.9rem;">Items are shipped directly to verified shelters.</p>
        </div>
        <!-- Card 3: Blue BG, White Text -->
        <div class="feature-card" style="padding: 1.5rem; background: var(--color-blue); border-radius: 12px; box-shadow: var(--shadow); text-align: center; color: white;">
          <h3 style="color: white; margin-bottom: 0.5rem; font-size: 1.1rem;">Transparent Impact</h3>
          <p style="font-size: 0.9rem;">Receive confirmation when your donation is delivered.</p>
        </div>
      </section>

    </div>
  `;

  document.getElementById('btn-start-giving').addEventListener('click', renderPantry);
};

const renderMyDonations = () => {
  // Mock Data
  const donations = [
    { id: '#DN-8291', date: 'Nov 28, 2025', shelter: 'Downtown Community Center', items: ['Canned Beans (x5)', 'Rice (5lb)'], status: 'Delivered', statusColor: 'green' },
    { id: '#DN-9921', date: 'Nov 30, 2025', shelter: 'Safe Haven Family Shelter', items: ['Baby Formula', 'Warm Socks'], status: 'In Transit', statusColor: 'orange' },
  ];

  mainContent.innerHTML = `
    <section style="padding: 2rem 0; max-width: 800px; margin: 0 auto;">
      <h2 style="text-align: center; margin-bottom: 2rem;">My Donations</h2>
      
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${donations.map(donation => `
          <div style="background: #fff; padding: 1.5rem; border-radius: 8px; box-shadow: var(--shadow); border-left: 5px solid ${donation.statusColor === 'green' ? 'var(--color-mint)' : 'var(--color-blue)'};">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
              <div>
                <h3 style="margin-bottom: 0.25rem;">${donation.shelter}</h3>
                <p style="color: #999; font-size: 0.9rem;">Order ${donation.id} • ${donation.date}</p>
              </div>
              <span style="background: ${donation.statusColor === 'green' ? 'var(--color-mint)' : 'var(--color-pink)'}; color: var(--color-text); padding: 0.25rem 0.75rem; border-radius: 16px; font-size: 0.85rem; font-weight: 600;">
                ${donation.status}
              </span>
            </div>
            
            <div style="margin-bottom: 1rem;">
              <p style="font-weight: 500; margin-bottom: 0.5rem;">Items Donated:</p>
              <ul style="list-style: disc; padding-left: 1.5rem; color: var(--color-text-light);">
                ${donation.items.map(item => `<li>${item}</li>`).join('')}
              </ul>
            </div>

            ${donation.status === 'Delivered' ? `
              <div style="background: var(--color-pink); padding: 1rem; border-radius: 4px; display: flex; align-items: center; gap: 1rem;">
                <div style="color: var(--color-cyan);">${icons.check}</div>
                <div>
                  <p style="font-weight: 600; font-size: 0.9rem;">Verified Delivery</p>
                  <p style="font-size: 0.85rem; color: var(--color-text-light);">Received by Sarah J. at 2:30 PM on Nov 29.</p>
                </div>
              </div>
            ` : `
              <div style="background: var(--color-lavender-pink); padding: 1rem; border-radius: 4px; display: flex; align-items: center; gap: 1rem;">
                <div style="color: var(--color-blue);">${icons.truck}</div>
                <div>
                  <p style="font-weight: 600; font-size: 0.9rem;">On the Way</p>
                  <p style="font-size: 0.85rem; color: var(--color-text-light);">Expected delivery tomorrow by 5:00 PM.</p>
                </div>
              </div>
            `}
          </div>
        `).join('')}
      </div>
    </section>
  `;
};

const renderAbout = () => {
  mainContent.innerHTML = `
    <section style="padding: 4rem 0; max-width: 800px; margin: 0 auto;">
      <h1 style="text-align: center; margin-bottom: 2rem; color: var(--color-accent);">About Donify</h1>
      
      <div style="background: #fff; padding: 2rem; border-radius: 8px; box-shadow: var(--shadow); margin-bottom: 2rem;">
        <h3 style="margin-bottom: 1rem;">Our Mission</h3>
        <p style="margin-bottom: 1rem; color: var(--color-text-light);">
          Many people experiencing financial hardship or homelessness struggle to access essential resources. 
          At the same time, donors want to help but lack an easy, trustworthy, and convenient way to give. 
          <strong>Donify bridges that gap.</strong>
        </p>
        <p style="color: var(--color-text-light);">
          We act as an online food pantry and donation marketplace, making it easier for people to donate essentials — all digitally.
        </p>
      </div>

      <div class="about-grid">
        <div style="background: #fff; padding: 2rem; border-radius: 8px; box-shadow: var(--shadow);">
          <h4 style="color: var(--color-accent); margin-bottom: 0.5rem;">For Donors</h4>
          <p style="font-size: 0.9rem; color: var(--color-text-light);">
            Browse a simple online "pantry" with essentials. Buy items just like online shopping. 
            We handle the delivery to local shelters. You get a confirmation when it arrives.
          </p>
        </div>
        <div style="background: #fff; padding: 2rem; border-radius: 8px; box-shadow: var(--shadow);">
          <h4 style="color: var(--color-accent); margin-bottom: 0.5rem;">For Shelters</h4>
          <p style="font-size: 0.9rem; color: var(--color-text-light);">
            Receive the exact items you need, delivered directly to your door. 
            No more sorting through random dropped-off goods.
          </p>
        </div>
      </div>

      <div style="text-align: center;">
        <h3 style="margin-bottom: 1rem;">Join the Movement</h3>
        <button class="btn btn-primary" onclick="renderPantry()">Start Donating Today</button>
      </div>
    </section>
  `;
};

const removeFromCart = (index) => {
  const item = cart[index];
  cart.splice(index, 1);
  saveCart();
  showToast(`Removed ${item.name} from cart`, 'info');
  renderCheckout();
};

const renderCheckout = () => {
  const total = cart.reduce((sum, item) => sum + parseFloat(item.price.replace('$', '')), 0).toFixed(2);

  if (cart.length === 0) {
    mainContent.innerHTML = `
      <section style="padding: 4rem 0; text-align: center;">
        <h2>Your cart is empty</h2>
        <p style="margin-bottom: 2rem; color: var(--color-text-light);">Add some items to start making a difference.</p>
        <button class="btn btn-primary" onclick="renderPantry()">Browse Pantry</button>
      </section>
    `;
    return;
  }

  mainContent.innerHTML = `
    <section class="checkout-grid">
      
      <!-- Checkout Form -->
      <div>
        <h2 style="margin-bottom: 1.5rem;">Checkout</h2>
        <form onsubmit="event.preventDefault(); handleDonation();" style="background: #fff; padding: 2rem; border-radius: 8px; box-shadow: var(--shadow);">
          
          <h4 style="margin-bottom: 1rem; color: var(--color-text-light);">1. Select a Shelter</h4>
          <div style="margin-bottom: 1.5rem;">
            <select style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-family: inherit;">
              <option>Downtown Community Center</option>
              <option>Safe Haven Family Shelter</option>
              <option>Hope House for Youth</option>
              <option>Veterans Support Group</option>
            </select>
          </div>

          <h4 style="margin-bottom: 1rem; color: var(--color-text-light);">2. Your Information</h4>
          <div style="margin-bottom: 1rem;">
            <input type="text" placeholder="Full Name" required style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-family: inherit;">
          </div>
          <div style="margin-bottom: 1.5rem;">
            <input type="email" placeholder="Email Address" required style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-family: inherit;">
          </div>

          <h4 style="margin-bottom: 1rem; color: var(--color-text-light);">3. Payment Details (Mock)</h4>
          <div style="margin-bottom: 1rem;">
            <input type="text" placeholder="Card Number" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-family: inherit;">
          </div>
          <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
            <input type="text" placeholder="MM/YY" style="width: 50%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-family: inherit;">
            <input type="text" placeholder="CVC" style="width: 50%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-family: inherit;">
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%;">Donate $${total}</button>
          <p style="font-size: 0.8rem; color: #999; text-align: center; margin-top: 1rem;">
            <i class="fas fa-lock"></i> Secure SSL Encryption
          </p>
        </form>
      </div>

      <!-- Order Summary -->
      <div>
        <h2 style="margin-bottom: 1.5rem;">Order Summary</h2>
        <div style="background: #fff; padding: 2rem; border-radius: 8px; box-shadow: var(--shadow);">
          ${cart.map((item, index) => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #eee;">
              <div>
                <span>${item.name}</span>
                <div style="font-size: 0.8rem; color: #999; cursor: pointer; text-decoration: underline;" onclick="removeFromCart(${index})">Remove</div>
              </div>
              <span>${item.price}</span>
            </div>
          `).join('')}
          
          <div style="display: flex; justify-content: space-between; padding: 1rem 0; margin-top: 1rem; border-top: 2px solid #eee; font-weight: bold; font-size: 1.2rem;">
            <span>Total</span>
            <span>$${total}</span>
          </div>
          
          <div style="background: #f9f9f9; padding: 1rem; border-radius: 4px; margin-top: 1rem; font-size: 0.9rem; color: var(--color-text-light);">
            <p><strong>Note:</strong> 100% of these items will be shipped directly to the selected shelter.</p>
          </div>

          <button style="width: 100%; margin-top: 1rem; background: none; border: none; color: #999; text-decoration: underline; cursor: pointer;" onclick="renderPantry()">Edit Cart</button>
        </div>
      </div>

    </section>
  `;
};

const handleDonation = () => {
  showToast('Processing donation...', 'info');
  setTimeout(() => {
    showToast('Thank you! Donation successful.', 'success');
    localStorage.removeItem('donify_cart');
    cart = [];
    updateCartButton();
    setTimeout(() => {
      renderHome();
    }, 2000);
  }, 1500);
};

const renderPantry = () => {
  mainContent.innerHTML = `
    <section style="padding: 2rem 0;">
      <h2 style="text-align: center; margin-bottom: 2rem;">Online Pantry</h2>
      <div class="pantry-grid">
        <!-- Items -->
        ${[
      { name: 'Canned Beans', price: '$1.50', img: `${import.meta.env.BASE_URL}images/beans.png` },
      { name: 'Toothpaste', price: '$3.00', img: `${import.meta.env.BASE_URL}images/toothpaste.png` },
      { name: 'Warm Socks', price: '$5.00', img: `${import.meta.env.BASE_URL}images/socks.png` },
      { name: 'Baby Formula', price: '$20.00', img: `${import.meta.env.BASE_URL}images/formula.png` },
      { name: 'Rice (5lb)', price: '$4.50', img: `${import.meta.env.BASE_URL}images/rice.png` },
      { name: 'Shampoo', price: '$4.00', img: `${import.meta.env.BASE_URL}images/shampoo.png` },
    ].map(item => `
          <div class="item-card" style="background: #fff; border-radius: 8px; overflow: hidden; box-shadow: var(--shadow);">
            <img src="${item.img}" alt="${item.name}" style="width: 100%; height: 200px; object-fit: cover;">
            <div style="padding: 1rem;">
              <h4 style="margin-bottom: 0.5rem;">${item.name}</h4>
              <p style="color: var(--color-accent); font-weight: bold; margin-bottom: 1rem;">${item.price}</p>
              <button class="btn btn-primary" style="width: 100%;" onclick="addToCart('${item.name}', '${item.price}')">Add to Cart</button>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
  updateCartButton();
};

// Expose functions to window for onclick handlers
window.addToCart = addToCart;
window.renderPantry = renderPantry;
window.renderCheckout = renderCheckout;
window.clearCart = clearCart;
window.showToast = showToast;
window.handleDonation = handleDonation;
window.removeFromCart = removeFromCart;

// Event Listeners
document.getElementById('nav-home').addEventListener('click', (e) => {
  e.preventDefault();
  renderHome();
});

document.getElementById('nav-pantry').addEventListener('click', (e) => {
  e.preventDefault();
  renderPantry();
});

document.getElementById('nav-about').addEventListener('click', (e) => {
  e.preventDefault();
  renderAbout();
});

document.getElementById('nav-donations').addEventListener('click', (e) => {
  e.preventDefault();
  renderMyDonations();
});

// Initial Render
renderHome();
updateCartButton();
