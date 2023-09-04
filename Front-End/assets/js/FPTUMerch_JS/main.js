
let listCart = document.querySelector('.listCart');
let singleCart = document.querySelector('single-cart');
let totalPrice = document.querySelector('.totalPrice');
let total = document.querySelector('.total');
let quantity = document.querySelector('.quantity');
let products = [];
let cartDrop = document.querySelector('.cart-drop');
let cartTop = document.querySelector('.cart-top');

//Show all individual products
fetch("https://fptumerchapi-cocsaigon.up.railway.app/api/Product/GetByProductType/1", {
    method: "GET"
}).then(res => {
    return res.json();
}).then(data => {
    let data1 = '';
    data.map((values) => {
        data1 += `<div class=" col-md-4 ">
        <div class="sin-product style-two">
            <div class="pro-img">
                <img src="media/images/${values.productLink}.jpg" alt="">
            </div>
            <div class="mid-wrapper">
                <h5 class="textproduct"><a href="product.html">${values.productName}</a></h5>
                <p>${values.price.toLocaleString()} VND </p>
            </div>
            <div class="icon-wrapper">
                <div class="pro-icon">
                    <ul>
                        <li><a class="trigger" href="#c1"><i class="flaticon-eye"></i>
                                <h5 class="preview">XEM TRƯỚC</h5>
                            </a></li>
                    </ul>
                </div>
                <div class="add-to-cart">
                    <a href="#" onclick="addToCart('${values.productID}')">Thêm vào giỏ hàng</a>
                </div>
            </div>
        </div>
    </div>`;
    });
    document.getElementById("product-individual").innerHTML = data1;
}).catch(error => {
    console.log(error);
});

//Show all combo products
fetch("https://fptumerchapi-cocsaigon.up.railway.app/api/Product/GetByProductType/2", {
    method: "GET"
}).then(res => {
    return res.json();
}).then(data => {
    let data1 = '';
    data.map((values) => {
        data1 += `<div class=" col-md-4 ">
        <div class="sin-product style-two">
            <div class="pro-img">
                <img src="media/images/${values.productLink}.jpg" alt="">
            </div>
            <div class="mid-wrapper">
                <h5 class="textproduct"><a href="product.html">${values.productName}</a></h5>
                <p>${values.price.toLocaleString()} VND </p>
            </div>
            <div class="icon-wrapper">
                <div class="pro-icon">
                    <ul>
                        <li><a class="trigger" href="#c1"><i class="flaticon-eye"></i>
                                <h5 class="preview">XEM TRƯỚC</h5>
                            </a></li>
                    </ul>
                </div>
                <div class="add-to-cart">
                    <a href="#" onclick="addToCart('${values.productID}')">Thêm vào giỏ hàng</a>
                </div>
            </div>
        </div>
    </div>`;
    });
    document.getElementById("product-combo").innerHTML = data1;
}).catch(error => {
    console.log(error);
});

//Get all products and store in products variable
fetch("https://fptumerchapi-cocsaigon.up.railway.app/api/Product/Get", {
    method: "GET"
}).then(res => {
    return res.json();
}).then(data => {
    Object.values(data).forEach((data) => {
        products.push(data);
    });
}).catch(error => {
    console.log(error);
});

let listCarts = [];

function addToCart(key) {
    let productCheck = false; // Initialize productCheck
    products.forEach((product) => {
        // Check if the product's id equals key
        if (product.productID == key) {
            // Check if the list of cart already has this product
            let found = false;
            for (let i = 0; i < listCarts.length; i++) {
                if (listCarts[i].productID == key) {
                    listCarts[i].quantity++;
                    found = true;
                    break;
                }
            }
            if (!found) {
                // Create a new item object and push it to the listCarts array
                let newItem = {
                    productID: product.productID,
                    productName: product.productName,
                    productLink: product.productLink,
                    price: product.price,
                    quantity: 1,
                };
                listCarts.push(newItem);
            }
        }
    });
    console.log(listCarts);
    reloadCart();
}

function reloadCart() {
    let currentTotalPrice = 0;
    for (let i = 0; i < listCarts.length; i++) {
        currentTotalPrice += listCarts[i].price * listCarts[i].quantity; // Calculate total price
    };
    if (quantity && totalPrice) {
        quantity.innerHTML = listCarts.length;
        totalPrice.innerHTML = currentTotalPrice.toLocaleString() + " Đ";
    };
    cartTop.innerHTML = "";
    listCarts.forEach((value) => {
        if (value != null) {
            let newDiv = document.createElement('div');
            newDiv.innerHTML = `<div class="single-cart">
                <div class="cart-img">
                    <img alt="" src="media/images/${value.productLink}.jpg">
                </div>
                <div class="cart-title">
                    <p><a href="">${value.productName}</a></p>
                </div>
                <div class="cart-price">
                    <p>${value.quantity} x ${value.price.toLocaleString()}</p>
                </div>
                <a href="#"><i class="fa fa-times"></i></a>
                </div>`;
            cartTop.append(newDiv);
        }
    })
}

$('.trigger').on('click', function(e) {
    e.preventDefault();
    var mask = '<div class="mask-overlay">';

    $('.quickview-wrapper').toggleClass('open');
    $(mask).hide().appendTo('body').fadeIn('fast');
    $('.mask-overlay, .close-qv').on('click', function() {
      $('.quickview-wrapper').removeClass('open');
      $('.mask-overlay').remove();
    });
  });