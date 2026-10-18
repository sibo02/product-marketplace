const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 85,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"
    },
    {
        id: 2,
        name: "Running Shoes",
        category: "Fashion",
        price: 60,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"
    },
    {
        id: 3,
        name: "Coffee Maker",
        category: "Home",
        price: 45,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400"
    },
    {
        id: 4,
        name: "Smart Watch",
        category: "Electronics",
        price: 120,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
    },
    {
        id: 5,
        name: "Backpack",
        category: "Fashion",
        price: 35,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"
    },
    {
        id: 6,
        name: "Desk Lamp",
        category: "Home",
        price: 25,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400"
    }
];
const productList = document.getElementById("productList");

function displayProducts(items) {
    productList.innerHTML = "";

    items.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Category: ${product.category}</p>
            <p>Price: $${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        `;

        productList.appendChild(productCard);
    });
}
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");

// Add categories automatically
const categories = [...new Set(products.map(product => product.category))];

categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
});

function filterProducts() {
    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const sortOrder = sortSelect.value;
    const maxPrice = Number(priceRange.value);

    let filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchText);
        const matchesCategory = selectedCategory === "all" ||
            product.category === selectedCategory;
        const matchesPrice = product.price <= maxPrice;

        return matchesSearch && matchesCategory && matchesPrice;
    });

    if (sortOrder === "low-high") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high-low") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    displayProducts(filteredProducts);
}

searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);
sortSelect.addEventListener("change", filterProducts);

priceRange.addEventListener("input", () => {
    priceValue.textContent = `$${priceRange.value}`;
    filterProducts();
});

displayProducts(products);
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

function addToCart(productId) {
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        const product = products.find(item => item.id === productId);

        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${item.name} — $${item.price.toFixed(2)}
            × ${item.quantity}
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;

        cartItems.appendChild(li);
        total += item.price * item.quantity;
    });

    cartTotal.textContent = total.toFixed(2);
    localStorage.setItem("cart", JSON.stringify(cart));
}

updateCart();