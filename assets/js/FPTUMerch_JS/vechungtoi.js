let cartTop = document.querySelector('.cart-top'); // Show the cart information
let quantity = document.querySelector('.quantity'); // How many kinds of products are there
let totalPrice = document.querySelector('.totalPrice');
//MOBILE ENTITIES
let quantityMobile = document.querySelector('.quantity-mobile'); // How many kinds of products are there
let cartTopMobile = document.querySelector('.cart-top-mobile'); // Show the cart information
let totalPriceMobile = document.querySelector('.totalPriceMobile');

let listCarts = null;
if (JSON.parse(localStorage.getItem('listCarts')) == null) {
    listCarts = [];
} else {
    listCarts = JSON.parse(localStorage.getItem('listCarts'));
    let currentTotalPrice = 0;
    for (let i = 0; i < listCarts.length; i++) {
        currentTotalPrice += listCarts[i].price * listCarts[i].amount; // Calculate total price
    };
    if (quantity && totalPrice) {
        quantity.innerHTML = listCarts.length;
        quantityMobile.innerHTML = listCarts.length;
        totalPrice.innerHTML = currentTotalPrice.toLocaleString() + " VND";
        totalPriceMobile.innerHTML = currentTotalPrice.toLocaleString() + " VND";
    };
    cartTop.innerHTML = "";
    cartTopMobile.innerHTML = "";
    // let storedList = localStorage.getItem('listCarts');
    // console.log(storedList);
    listCarts.forEach((value, index) => {
        if (value != null) {
            let newDiv = document.createElement('div');
            newDiv.innerHTML = `<div class="single-cart">
                <div class="cart-img">
                    <img alt="" src="media/images/${value.productLink}.jpg" style="max-width:100px">
                </div>
                <div class="cart-title">
                    <p><a href="">${value.productName}</a></p>
                </div>
                <div class="cart-price">
                    <button onclick="changeQuantity(${index}, ${parseInt(value.amount) - 1})">-</button>
                    <p>${value.amount} </p>
                    <button onclick="changeQuantity(${index}, ${parseInt(value.amount) + 1})">+</button>
                    <p>x ${value.price.toLocaleString()}</p>
                </div>
                <div class="cart-price">
                    <p>${value.note}</p>
                </div>
                <a href="#"><i class="fa fa-times" onclick="removeFromCart(${index},event)"></i></a>
                </div>`;
            cartTop.append(newDiv);
        }
        if (value != null) {
            let newDiv = document.createElement('div');
            newDiv.innerHTML = `<div class="single-cart">
                <div class="cart-img">
                    <img alt="" src="media/images/${value.productLink}.jpg" style="max-width:100px">
                </div>
                <div class="cart-title">
                    <p><a href="">${value.productName}</a></p>
                </div>
                <div class="cart-price">
                    <button onclick="changeQuantity(${index}, ${parseInt(value.amount) - 1})">-</button>
                    <p>${value.amount} </p>
                    <button onclick="changeQuantity(${index}, ${parseInt(value.amount) + 1})">+</button>
                    <p>x ${value.price.toLocaleString()}</p>
                </div>
                <div class="cart-price">
                    <p>${value.note}</p>
                </div>
                <a href="#"><i class="fa fa-times" onclick="removeFromCart(${index},event)"></i></a>
                </div>`;
            cartTopMobile.append(newDiv);
        }
    })
};

function removeFromCart(index, e) {
    e.preventDefault();
    // Check if the index is valid and within the bounds of your listCarts array
    if (index >= 0 && index < listCarts.length) {
        const response = confirm("Bỏ món hàng này ra khỏi danh sách?");
        if (response) {
            // Remove the item at the specified index from the listCarts array
            listCarts.splice(index, 1);
            // Call reloadCart to refresh the cart UI
            reloadCart();
        }
    }
    else {
        console.error("Invalid index provided to removeFromCart");
    }
};

function reloadCart() {
    let currentTotalPrice = 0;
    for (let i = 0; i < listCarts.length; i++) {
        currentTotalPrice += listCarts[i].price * listCarts[i].amount; // Calculate total price
    };
    if (quantity && totalPrice) {
        quantity.innerHTML = listCarts.length;
        quantityMobile.innerHTML = listCarts.length;
        totalPrice.innerHTML = currentTotalPrice.toLocaleString() + " VND";
        totalPriceMobile.innerHTML = currentTotalPrice.toLocaleString() + " VND";
    };
    cartTop.innerHTML = "";
    cartTopMobile.innerHTML = "";
    // let storedList = localStorage.getItem('listCarts');
    // console.log(storedList);
    listCarts.forEach((value, index) => {
        if (value != null) {
            let newDiv = document.createElement('div');
            newDiv.innerHTML = `<div class="single-cart">
                <div class="cart-img">
                    <img alt="" src="media/images/${value.productLink}.jpg" style="max-width:100px">
                </div>
                <div class="cart-title">
                    <p><a href="">${value.productName}</a></p>
                </div>
                <div class="cart-price">
                    <button onclick="changeQuantity(${index}, ${parseInt(value.amount) - 1})">-</button>
                    <p>${value.amount} </p>
                    <button onclick="changeQuantity(${index}, ${parseInt(value.amount) + 1})">+</button>
                    <p>x ${value.price.toLocaleString()}</p>
                </div>
                <div class="cart-price">
                    <p>${value.note}</p>
                </div>
                <a href="#"><i class="fa fa-times" onclick="removeFromCart(${index},event)"></i></a>
                </div>`;
            cartTop.append(newDiv);
        }
        if (value != null) {
            let newDiv = document.createElement('div');
            newDiv.innerHTML = `<div class="single-cart">
                <div class="cart-img">
                    <img alt="" src="media/images/${value.productLink}.jpg" style="max-width:100px">
                </div>
                <div class="cart-title">
                    <p><a href="">${value.productName}</a></p>
                </div>
                <div class="cart-price">
                    <button onclick="changeQuantity(${index}, ${parseInt(value.amount) - 1})">-</button>
                    <p>${value.amount} </p>
                    <button onclick="changeQuantity(${index}, ${parseInt(value.amount) + 1})">+</button>
                    <p>x ${value.price.toLocaleString()}</p>
                </div>
                <div class="cart-price">
                    <p>${value.note}</p>
                </div>
                <a href="#"><i class="fa fa-times" onclick="removeFromCart(${index},event)"></i></a>
                </div>`;
            cartTopMobile.append(newDiv);
        }
    })
    
    localStorage.setItem('listCarts', JSON.stringify(listCarts));
};

function changeQuantity(index, quantity) {
    if (quantity == 0) {
        const response = confirm("Bỏ món hàng này ra khỏi danh sách?");
        if (response) {
            listCarts.splice(index, 1);
            reloadCart();
        }
    } else {
        listCarts[index].amount = quantity;
        reloadCart();
    }
};

function passData() {
    localStorage.setItem('listCarts', JSON.stringify(listCarts));
};