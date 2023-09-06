//LAPTOP ENTITIES
let totalPrice = document.querySelector('.totalPrice');
let quantity = document.querySelector('.quantity'); // How many kinds of products are there
let cartTop = document.querySelector('.cart-top'); // Show the cart information
let shirtQuantity = document.querySelector('#qtyShirt');
let shirtSize = document.querySelector('#sizeShirt');
let sockQuantity = document.querySelector("#qtySocks");
let sockColor = document.querySelector('#colorSocks');
let strapQuantity = document.querySelector('#qtyStrap');
let comboQuantity = document.querySelector('#qtyCombo');
let shirtSizeCombo = document.querySelector('#sizeShirtCombo');
let sockColorCombo = document.querySelector('#colorSocksCombo');
let badgeCombo = document.querySelector('#badgeCombo');
let products = [];


//MOBILE ENTITIES
let quantityMobile = document.querySelector('.quantity-mobile'); // How many kinds of products are there
let cartTopMobile = document.querySelector('.cart-top-mobile'); // Show the cart information
let totalPriceMobile = document.querySelector('.totalPriceMobile');
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

$('.add-to-cart-shirt').on('click', function (e) {
    e.preventDefault();

    $('.quickview-wrapper').toggleClass('open');
    $('.mask-overlay').show().appendTo('body').fadeIn('fast').remove();
});

$('.add-to-cart-socks').on('click', function (e) {
    e.preventDefault();

    $('.quickview-wrapper01').toggleClass('open');
    $('.mask-overlay').show().appendTo('body').fadeIn('fast').remove();
});

$('.add-to-cart-strap').on('click', function (e) {
    e.preventDefault();

    $('.quickview-wrapper02').toggleClass('open');
    $('.mask-overlay').show().appendTo('body').fadeIn('fast').remove();
});

$('.add-to-cart-combo').on('click', function (e) {
    e.preventDefault();

    $('.quickview-wrapper03').toggleClass('open');
    $('.mask-overlay').show().appendTo('body').fadeIn('fast').remove();
});

let listCarts = null;
if (JSON.parse(sessionStorage.getItem('listCarts')) == null) {
    listCarts = [];
} else {
    listCarts = JSON.parse(sessionStorage.getItem('listCarts'));
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
}

function addToCart(key) {
    let shirtNote = "Size: " + shirtSize.options[shirtSize.selectedIndex].text;
    let sockNote = "Màu: " + sockColor.options[sockColor.selectedIndex].text;
    let comboNote = "Size: " + shirtSizeCombo.options[shirtSizeCombo.selectedIndex].text + "<br/>"
        + "Màu: " + sockColorCombo.options[sockColorCombo.selectedIndex].text + "<br/>"
        + "Huy hiệu: " + badgeCombo.options[badgeCombo.selectedIndex].text + "<br/>";
    let productCheck = false; // Initialize productCheck
    products.forEach((product) => {
        // Check if the product's id equals key
        if (product.productID == key) {
            // Check if the list of cart already has this product
            let found = false;
            for (let i = 0; i < listCarts.length; i++) {
                if (listCarts[i].productID == key) {
                    if (product.productName.toUpperCase() == "ÁO THUN FPTYOU"
                        && shirtNote == listCarts[i].note) {
                        listCarts[i].quantity = parseInt(listCarts[i].quantity) + parseInt(shirtQuantity.value, 10);
                        found = true;
                        alert("Đã thêm vào giỏ hàng");
                        break;
                    } else if (product.productName.toUpperCase() == "VỚ PASSED"
                        && sockNote == listCarts[i].note) {
                        listCarts[i].quantity = parseInt(listCarts[i].quantity) + parseInt(sockQuantity.value, 10);
                        found = true;
                        alert("Đã thêm vào giỏ hàng");
                        break;
                    } else if (product.productName.toUpperCase() == "DÂY ĐEO THẺ") {
                        listCarts[i].quantity = parseInt(listCarts[i].quantity) + parseInt(sockQuantity.value, 10);
                        found = true;
                        alert("Đã thêm vào giỏ hàng");
                        break;
                    } else if (product.productName.toUpperCase() == "COMBO FULL KIT"
                        && comboNote == listCarts[i].note) {
                        listCarts[i].quantity = parseInt(listCarts[i].quantity) + parseInt(comboQuantity.value, 10);
                        found = true;
                        alert("Đã thêm vào giỏ hàng");
                        break;
                    } else {
                        found = false;
                    }
                }
            }
            if (!found) {
                let newItem = {
                    productID: product.productID,
                    productName: product.productName,
                    productLink: product.productLink,
                    price: product.price,
                    quantity: null,
                    note: "",
                };
                if (shirtQuantity.value == 0 || sockQuantity.value == 0
                    || strapQuantity.value == 0 || comboQuantity.value == 0) {
                    alert("Số lượng sản phẩm phải lớn hơn 0, xin hãy thử lại");

                } else {
                    if (product.productName.toUpperCase() == "ÁO THUN FPTYOU") {
                        // Create a new item object and push it to the listCarts array
                        newItem.quantity = shirtQuantity.value;
                        newItem.note += shirtNote;
                    } else if (product.productName.toUpperCase() == "VỚ PASSED") {
                        newItem.quantity = sockQuantity.value;
                        newItem.note += sockNote;
                    } else if (product.productName.toUpperCase() == "DÂY ĐEO THẺ") {
                        newItem.quantity = strapQuantity.value;
                    } else if (product.productName.toUpperCase() == "COMBO FULL KIT") {
                        newItem.quantity = comboQuantity.value;
                        newItem.note += comboNote;
                    } else {
                        newItem = {
                            productID: product.productID,
                            productName: product.productName,
                            productLink: product.productLink,
                            price: product.price,
                            quantity: 1,
                        }
                    };
                    listCarts.push(newItem);
                    alert("Đã thêm vào giỏ hàng");
                }
            }
        }
    });
    reloadCart();
}

function reloadCart() {
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
    
    sessionStorage.setItem('listCarts', JSON.stringify(listCarts));
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
}

function changeQuantity(index, quantity) {
    if (quantity == 0) {
        const response = confirm("Bỏ món hàng này ra khỏi danh sách?");
        if (response) {
            listCarts.splice(index, 1);
            reloadCart();
        }
    } else {
        listCarts[index].quantity = quantity;
        reloadCart();
    }
}

function passData() {
    sessionStorage.setItem('listCarts', JSON.stringify(listCarts));
}