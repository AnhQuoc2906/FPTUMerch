let cartTop = document.querySelector('.cart-top'); // Show the cart information
let quantity = document.querySelector('.quantity');  // How many kinds of products are there
let totalPrice = document.querySelector('.totalPrice');
let listCarts = JSON.parse(localStorage.getItem('listCarts'));

let quantityMobile = document.querySelector('.quantity-mobile'); // How many kinds of products are there
let cartTopMobile = document.querySelector('.cart-top-mobile'); // Show the cart information
let totalPriceMobile = document.querySelector('.total-price-mobile');

if (JSON.parse(localStorage.getItem('listCarts')) == null) {
    listCarts = [];
}
cartTop.innerHTML = "";
//UPDATE CURRENT CART
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
                <p>${value.quantity} </p>
                <p>x ${value.price.toLocaleString()}</p>
            </div>
            <div class="cart-price">
                <p>${value.note}</p>
            </div>
            <a href="#"><i class="fa fa-times" onclick="removeFromCart(${index},event)"></i></a>
            </div>`;
        cartTop.append(newDiv);
    } if (value != null) {
        let newDiv = document.createElement('div');
        newDiv.innerHTML = `<div class="single-cart">
            <div class="cart-img">
                <img alt="" src="media/images/${value.productLink}.jpg" style="max-width:100px">
            </div>
            <div class="cart-title">
                <p><a href="">${value.productName}</a></p>
            </div>
            <div class="cart-price">
                <button onclick="changeQuantity(${index}, ${parseInt(value.quantity) - 1})">-</button>
                <p>${value.quantity} </p>
                <button onclick="changeQuantity(${index}, ${parseInt(value.quantity) + 1})">+</button>
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

let currentTotalPrice = 0;
for (let i = 0; i < listCarts.length; i++) {
    currentTotalPrice += listCarts[i].price * listCarts[i].quantity; // Calculate total price
};
if (quantity && totalPrice) {
    quantity.innerHTML = listCarts.length;
    quantityMobile.innerHTML = listCarts.length;
    totalPrice.innerHTML = currentTotalPrice.toLocaleString() + " VND";
    totalPriceMobile.innerHTML = currentTotalPrice.toLocaleString() + " VND";
};