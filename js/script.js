// Shopping Cart Management System
const STORAGE_KEY = 'shopping_cart';

// Initialize products with IDs and prices
const products = [
    { id: 1, name: 'Áo thun nam', price: 199000, image: 'images/product1.jpg' },
    { id: 2, name: 'Quần jean', price: 299000, image: 'images/product2.jpg' },
    { id: 3, name: 'Giày thể thao', price: 499000, image: 'images/product3.jpg' },
    { id: 4, name: 'Áo khoác', price: 599000, image: 'images/product4.jpg' }
];

// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem(STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

// Add item to cart
function addToCart(productName) {
    const product = products.find(p => p.name === productName);
    if (!product) return;

    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartCount();
    showNotification(`${productName} đã được thêm vào giỏ hàng!`);
}

// Remove item from cart
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCartCount();
    renderCart();
}

// Update item quantity
function updateQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, parseInt(quantity));
        saveCart(cart);
        renderCart();
    }
}

// Update cart count in header
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartIcon = document.getElementById('cart-count');
    if (cartIcon) {
        cartIcon.textContent = count;
        cartIcon.style.display = count > 0 ? 'inline' : 'none';
    }
}

// Render cart on cart.html page
function renderCart() {
    const cart = getCart();
    const cartContainer = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartSummary = document.getElementById('cart-summary');

    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = '';
        if (cartEmpty) cartEmpty.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }

    if (cartEmpty) cartEmpty.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'block';

    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p class="item-price">${formatPrice(item.price)}</p>
            </div>
            <div class="item-quantity">
                <input type="number" min="1" value="${item.quantity}" 
                       onchange="updateQuantity(${item.id}, this.value)">
            </div>
            <div class="item-total">
                ${formatPrice(item.price * item.quantity)}
            </div>
            <button class="btn-remove" onclick="removeFromCart(${item.id})">❌</button>
        </div>
    `).join('');

    updateCartSummary();
}

// Update cart summary (total, tax, etc.)
function updateCartSummary() {
    const cart = getCart();
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (taxEl) taxEl.textContent = formatPrice(tax);
    if (totalEl) totalEl.textContent = formatPrice(total);
}

// Format price in Vietnamese format
function formatPrice(price) {
    return price.toLocaleString('vi-VN') + '₫';
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Checkout function
function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Giỏ hàng của bạn trống!');
        return;
    }

    const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const confirmed = confirm(`Tổng tiền: ${formatPrice(total)}\n\nXác nhận thanh toán?`);

    if (confirmed) {
        localStorage.removeItem(STORAGE_KEY);
        updateCartCount();
        alert('Cám ơn bạn đã mua hàng! Đơn hàng đã được xác nhận.');
        window.location.href = 'index.html';
    }
}

// Clear cart
function clearCart() {
    if (confirm('Bạn chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
        localStorage.removeItem(STORAGE_KEY);
        updateCartCount();
        renderCart();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (document.body.contains(document.getElementById('cart-items'))) {
        renderCart();
    }
});
