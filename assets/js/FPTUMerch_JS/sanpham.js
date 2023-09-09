let listCarts = JSON.parse(localStorage.getItem('listCarts'));
let cartTop = document.querySelector('.cart-top'); // Show the cart information
let quantity = document.querySelector('.quantity');  // How many kinds of products are there
let totalPrice = document.querySelector('.totalPrice');
let shirtQuantity = document.querySelector('#qtyShirt');
let shirtSize = document.querySelector('#sizeShirt');
let sockQuantity = document.querySelector("#qtySocks");
let sockColor = document.querySelector('#colorSocks');
let strapQuantity = document.querySelector('#qtyStrap');
let comboQuantity = document.querySelector('#qtyCombo');
let shirtSizeCombo = document.querySelector('#sizeShirtCombo');
let sockColorCombo = document.querySelector('#colorSocksCombo');
let badgeCombo = document.querySelector('#badgeCombo');
let productAfterSearch = document.querySelector('.search');
let searchName = document.querySelector("#searchItem");
let products = [];

//MOBILE ENTITIES
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

//UPDATE CURRENT NUMBER OF ITEMS IN THE CART
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
                        break;
                    } else if (product.productName.toUpperCase() == "VỚ PASSED"
                        && sockNote == listCarts[i].note) {
                        listCarts[i].quantity = parseInt(listCarts[i].quantity) + parseInt(sockQuantity.value, 10);
                        found = true;
                        break;
                    } else if (product.productName.toUpperCase() == "DÂY ĐEO THẺ") {
                        listCarts[i].quantity = parseInt(listCarts[i].quantity) + parseInt(sockQuantity.value, 10);
                        found = true;
                        break;
                    } else if (product.productName.toUpperCase() == "COMBO FULL KIT"
                        && comboNote == listCarts[i].note) {
                        listCarts[i].quantity = parseInt(listCarts[i].quantity) + parseInt(comboQuantity.value, 10);
                        found = true;
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

//REMOVE FROM CART WHEN CLICK X BUTTON
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

//RELOAD CART
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
    localStorage.setItem('listCarts', JSON.stringify(listCarts));
};

function searchByName() {
    productAfterSearch.innerHTML = "";
    if (searchName.value == "" || searchName.value == null) {
        fetch("https://fptumerchapi-cocsaigon.up.railway.app/api/Product/Get/", {
            method: "GET"
        }).then(res => {
            return res.json();
        }).then(data => {
            data.map((values, index) => {
                if (values.productName.toUpperCase() == "ÁO THUN FPTYOU") {
                    productAfterSearch.innerHTML += `<div class="sin-product list-pro">
                    <div class="row">
                        <div class="col-md-5 col-lg-6 col-xl-4 ">
                            <div class="pro-img trigger-image">
                                <img src="media/images/${values.productLink}.jpg" alt="">
                            </div>
                            <div class="pro-icon trigger">
                                <ul>
                                    <li><a href="#" onclick="openWrapper('${values.productID}')"><i class="flaticon-eye"></i><h5 class="preview">XEM TRƯỚC</h5></a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-7 col-lg-6 col-xl-8">
                            <div class="list-pro-det">
                                <h5 class="pro-title trigger-title"><a href="#" onclick="openWrapper('${values.productID}')">ÁO THUN FPTYOU</a></h5>
                                <span>${values.price.toLocaleString()} VND</span>
                                <div class="rating">
                                    <ul>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                    </ul>
                                </div>
                                <a class="btn-two triggerButton" href="#" onclick="openWrapper('${values.productID}')">Thêm vào giỏ hàng</a>
                            </div>
                        </div>
                    </div>
                    <!-- /.row -->
                </div>`;
                } else if (values.productName.toUpperCase() == "VỚ PASSED") {
                    productAfterSearch.innerHTML += `<div class="sin-product list-pro">
                    <div class="row">
                        <div class="col-md-5 col-lg-6 col-xl-4">
                            <div class="pro-img trigger-image01">
                                <img src="media/images/${values.productLink}.jpg" alt="">
                            </div>
                            <div class="pro-icon trigger01">
                                <ul>
                                    <li><a href="#" onclick="openWrapper('${values.productID}')"><i class="flaticon-eye"></i><h5 class="preview">XEM TRƯỚC</h5></a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-7 col-lg-6 col-xl-8">
                            <div class="list-pro-det">
                                <h5 class="pro-title trigger-title01"><a href="#" onclick="openWrapper('${values.productID}')">VỚ PASSED</a></h5>
                                <span>${values.price.toLocaleString()} VND</span>
                                <div class="rating">
                                    <ul>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                    </ul>
                                </div>
                                <a class="btn-two triggerButton01" href="#" onclick="openWrapper('${values.productID}')">Thêm vào giỏ hàng</a>
                            </div>
                        </div>
                    </div>
                    <!-- /.row -->
                </div>`;
                } else if (values.productName.toUpperCase() == "DÂY ĐEO THẺ") {
                    productAfterSearch.innerHTML += `<div class="sin-product list-pro">
                    <div class="row">
                        <div class="col-md-5 col-lg-6 col-xl-4">
                            <div class="pro-img trigger-image02">
                                <img src="media/images/${values.productLink}.jpg" alt="">
                            </div>
                            <div class="pro-icon trigger02">
                                <ul>
                                    <li><a href="#" onclick="openWrapper('${values.productID}')"><i class="flaticon-eye"></i><h5 class="preview">XEM TRƯỚC</h5></a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-7 col-lg-6 col-xl-8">
                            <div class="list-pro-det">
                                <h5 class="pro-title trigger-title02"><a href="#" onclick="openWrapper('${values.productID}')">DÂY ĐEO THẺ</a></h5>
                                <span>${values.price.toLocaleString()} VND</span>
                                <div class="rating">
                                    <ul>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                    </ul>
                                </div>
                                <a class="btn-two triggerButton02" href="#" onclick="openWrapper('${values.productID}')">Thêm vào giỏ hàng</a>
                            </div>
                        </div>
                    </div>
                    <!-- /.row -->
                </div>`;
                } else if (values.productName.toUpperCase() == "COMBO FULL KIT") {
                    productAfterSearch.innerHTML += `<div class="sin-product list-pro">
                    <div class="row">
                        <div class="col-md-5 col-lg-6 col-xl-4">
                            <div class="pro-img trigger-image03">
                                <img src="media/images/${values.productLink}.jpg" alt="">
                            </div>
                            <span class="new-tag">NEW!</span>
                            <div class="pro-icon trigger03">
                                <ul>
                                    <li><a href="#" onclick="openWrapper('${values.productID}')"><i class="flaticon-eye"></i><h5 class="preview">XEM TRƯỚC</h5></a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-7 col-lg-6 col-xl-8">
                            <div class="list-pro-det">
                                <h5 class="pro-title trigger-title03"><a href="#" onclick="openWrapper('${values.productID}')">COMBO FULL KIT</a></h5>
                                <span>${values.price.toLocaleString()} VND</span>
                                <div class="rating">
                                    <ul>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                    </ul>
                                </div>
                                <a class="btn-two triggerButton03" href="#" onclick="openWrapper('${values.productID}')">Thêm vào giỏ hàng</a>
                            </div>
                        </div>
                    </div>
                    <!-- /.row -->
                </div>`;
                }
                ;
            })
        }).catch(error => {
            return console.log(error);
        })
    } else {
        fetch("https://fptumerchapi-cocsaigon.up.railway.app/api/Product/GetByName/" + searchName.value, {
            method: "GET"
        }).then(res => {
            return res.json();
        }).then(data => {
            data.map((values, index) => {
                if (values.productName.toUpperCase() == "ÁO THUN FPTYOU") {
                    productAfterSearch.innerHTML += `<div class="sin-product list-pro">
                    <div class="row">
                        <div class="col-md-5 col-lg-6 col-xl-4 ">
                            <div class="pro-img trigger-image">
                                <img src="media/images/${values.productLink}.jpg" alt="">
                            </div>
                            <div class="pro-icon trigger">
                                <ul>
                                    <li><a href="#" onclick="openWrapper('${values.productID}')"><i class="flaticon-eye"></i><h5 class="preview">XEM TRƯỚC</h5></a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-7 col-lg-6 col-xl-8">
                            <div class="list-pro-det">
                                <h5 class="pro-title trigger-title"><a href="#" onclick="openWrapper('${values.productID}')">ÁO THUN FPTYOU</a></h5>
                                <span>${values.price.toLocaleString()} VND</span>
                                <div class="rating">
                                    <ul>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                    </ul>
                                </div>
                                <a class="btn-two triggerButton" href="#" onclick="openWrapper('${values.productID}')">Thêm vào giỏ hàng</a>
                            </div>
                        </div>
                    </div>
                    <!-- /.row -->
                </div>`;
                } else if (values.productName.toUpperCase() == "VỚ PASSED") {
                    productAfterSearch.innerHTML += `<div class="sin-product list-pro">
                    <div class="row">
                        <div class="col-md-5 col-lg-6 col-xl-4">
                            <div class="pro-img trigger-image01">
                                <img src="media/images/${values.productLink}.jpg" alt="">
                            </div>
                            <div class="pro-icon trigger01">
                                <ul>
                                    <li><a href="#" onclick="openWrapper('${values.productID}')"><i class="flaticon-eye"></i><h5 class="preview">XEM TRƯỚC</h5></a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-7 col-lg-6 col-xl-8">
                            <div class="list-pro-det">
                                <h5 class="pro-title trigger-title01"><a href="#" onclick="openWrapper('${values.productID}')">VỚ PASSED</a></h5>
                                <span>${values.price.toLocaleString()} VND</span>
                                <div class="rating">
                                    <ul>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                    </ul>
                                </div>
                                <a class="btn-two triggerButton01" href="#" onclick="openWrapper('${values.productID}')">Thêm vào giỏ hàng</a>
                            </div>
                        </div>
                    </div>
                    <!-- /.row -->
                </div>`;
                } else if (values.productName.toUpperCase() == "DÂY ĐEO THẺ") {
                    productAfterSearch.innerHTML += `<div class="sin-product list-pro">
                    <div class="row">
                        <div class="col-md-5 col-lg-6 col-xl-4">
                            <div class="pro-img trigger-image02">
                                <img src="media/images/${values.productLink}.jpg" alt="">
                            </div>
                            <div class="pro-icon trigger02">
                                <ul>
                                    <li><a href="#" onclick="openWrapper('${values.productID}')"><i class="flaticon-eye"></i><h5 class="preview">XEM TRƯỚC</h5></a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-7 col-lg-6 col-xl-8">
                            <div class="list-pro-det">
                                <h5 class="pro-title trigger-title02"><a href="#" onclick="openWrapper('${values.productID}')">DÂY ĐEO THẺ</a></h5>
                                <span>${values.price.toLocaleString()} VND</span>
                                <div class="rating">
                                    <ul>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                    </ul>
                                </div>
                                <a class="btn-two triggerButton02" href="#" onclick="openWrapper('${values.productID}')">Thêm vào giỏ hàng</a>
                            </div>
                        </div>
                    </div>
                    <!-- /.row -->
                </div>`;
                } else if (values.productName.toUpperCase() == "COMBO FULL KIT") {
                    productAfterSearch.innerHTML += `<div class="sin-product list-pro">
                    <div class="row">
                        <div class="col-md-5 col-lg-6 col-xl-4">
                            <div class="pro-img trigger-image03">
                                <img src="media/images/${values.productLink}.jpg" alt="">
                            </div>
                            <span class="new-tag">NEW!</span>
                            <div class="pro-icon trigger03">
                                <ul>
                                    <li><a href="#" onclick="openWrapper('${values.productID}')"><i class="flaticon-eye"></i><h5 class="preview">XEM TRƯỚC</h5></a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-7 col-lg-6 col-xl-8">
                            <div class="list-pro-det">
                                <h5 class="pro-title trigger-title03"><a href="#" onclick="openWrapper('${values.productID}')">COMBO FULL KIT</a></h5>
                                <span>${values.price.toLocaleString()} VND</span>
                                <div class="rating">
                                    <ul>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                        <li><a href="#"><i class="fas fa-star"></i></a></li>
                                    </ul>
                                </div>
                                <a class="btn-two triggerButton03" href="#" onclick="openWrapper('${values.productID}')">Thêm vào giỏ hàng</a>
                            </div>
                        </div>
                    </div>
                    <!-- /.row -->
                </div>`;
                }
                ;
            })
        }).catch(error => {
            return console.log(error);
        })
    }
}

function passData() {
    localStorage.setItem('listCarts', JSON.stringify(listCarts));
}

function openWrapper(object) {
    var isQuickViewOpen = false; // Track the state of the quickview-wrapper

    console.log(object);
    // Toggle the quickview-wrapper state
    function toggleQuickView() {
        if (object == "Xey3FcLjFp1H6d3Y2ipP") {
            $('.quickview-wrapper').toggleClass('open', isQuickViewOpen);
        } else if (object == "9ExxjhRgHpmWneTgUpbI") {
            $('.quickview-wrapper01').toggleClass('open', isQuickViewOpen);
        } else if (object == "MfFhWpybUBWxY6qMhqnN") {
            $('.quickview-wrapper02').toggleClass('open', isQuickViewOpen);
        } else if (object == "QClgRMkJsWXVfeIp5eYR") {
            $('.quickview-wrapper03').toggleClass('open', isQuickViewOpen);
        }
    }
    
    if (object == "Xey3FcLjFp1H6d3Y2ipP") {
        $('.trigger, .triggerButton, .trigger-image, .trigger-title').on('click', function (e) {
            e.preventDefault();

            // Toggle the state variable
            isQuickViewOpen = !isQuickViewOpen;

            // Toggle the quickview-wrapper
            toggleQuickView();

            // Check if the quickview-wrapper is open and add or remove the mask-overlay accordingly
            if (isQuickViewOpen) {
                var maskOverlay = $('.mask-overlay');

                if (maskOverlay.length === 0) {
                    maskOverlay = $('<div class="mask-overlay">');
                    maskOverlay.hide().appendTo('body').fadeIn('fast');

                    // Add a click event handler to close the quickview-wrapper
                    maskOverlay.on('click', function () {
                        isQuickViewOpen = false; // Close the quickview-wrapper
                        toggleQuickView();
                        maskOverlay.remove();
                    });
                }
            } else {
                // Remove the mask-overlay element if the quickview-wrapper is closed
                $('.mask-overlay').remove();
            }
        });
    } else if (object == "9ExxjhRgHpmWneTgUpbI") {
        $('.trigger01, .triggerButton01, .trigger-image01, .trigger-title01').on('click', function (e) {
            e.preventDefault();

            // Toggle the state variable
            isQuickViewOpen = !isQuickViewOpen;

            // Toggle the quickview-wrapper
            toggleQuickView();

            // Check if the quickview-wrapper is open and add or remove the mask-overlay accordingly
            if (isQuickViewOpen) {
                var maskOverlay = $('.mask-overlay');

                if (maskOverlay.length === 0) {
                    maskOverlay = $('<div class="mask-overlay">');
                    maskOverlay.hide().appendTo('body').fadeIn('fast');

                    // Add a click event handler to close the quickview-wrapper
                    maskOverlay.on('click', function () {
                        isQuickViewOpen = false; // Close the quickview-wrapper
                        toggleQuickView();
                        maskOverlay.remove();
                    });
                }
            } else {
                // Remove the mask-overlay element if the quickview-wrapper is closed
                $('.mask-overlay').remove();
            }
        });
    } else if (object == "MfFhWpybUBWxY6qMhqnN") {
        $('.trigger02, .triggerButton02, .trigger-image02, .trigger-title02').on('click', function (e) {
            e.preventDefault();

            // Toggle the state variable
            isQuickViewOpen = !isQuickViewOpen;

            // Toggle the quickview-wrapper
            toggleQuickView();

            // Check if the quickview-wrapper is open and add or remove the mask-overlay accordingly
            if (isQuickViewOpen) {
                var maskOverlay = $('.mask-overlay');

                if (maskOverlay.length === 0) {
                    maskOverlay = $('<div class="mask-overlay">');
                    maskOverlay.hide().appendTo('body').fadeIn('fast');

                    // Add a click event handler to close the quickview-wrapper
                    maskOverlay.on('click', function () {
                        isQuickViewOpen = false; // Close the quickview-wrapper
                        toggleQuickView();
                        maskOverlay.remove();
                    });
                }
            } else {
                // Remove the mask-overlay element if the quickview-wrapper is closed
                $('.mask-overlay').remove();
            }
        });
    } else if (object == "QClgRMkJsWXVfeIp5eYR") {
        $('.trigger03, .triggerButton03, .trigger-image03, .trigger-title03').on('click', function (e) {
            e.preventDefault();

            // Toggle the state variable
            isQuickViewOpen = !isQuickViewOpen;

            // Toggle the quickview-wrapper
            toggleQuickView();

            // Check if the quickview-wrapper is open and add or remove the mask-overlay accordingly
            if (isQuickViewOpen) {
                var maskOverlay = $('.mask-overlay');

                if (maskOverlay.length === 0) {
                    maskOverlay = $('<div class="mask-overlay">');
                    maskOverlay.hide().appendTo('body').fadeIn('fast');

                    // Add a click event handler to close the quickview-wrapper
                    maskOverlay.on('click', function () {
                        isQuickViewOpen = false; // Close the quickview-wrapper
                        toggleQuickView();
                        maskOverlay.remove();
                    });
                }
            } else {
                // Remove the mask-overlay element if the quickview-wrapper is closed
                $('.mask-overlay').remove();
            }
        });
    }
}