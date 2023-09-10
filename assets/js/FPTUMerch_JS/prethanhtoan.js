let listCarts = JSON.parse(localStorage.getItem('listCarts')); // Get the temporary cart
let discountCode = document.querySelector('#discountCode'); //GET DISCOUNT CODE
let quantity = document.querySelector('.quantity'); // How many kinds of products are there
let cartTop = document.querySelector('.cart-top');
let totalPrice = document.querySelector('.totalPrice');
let announce = document.querySelector('.announce');
let tempPrice = document.querySelector('.tempPrice');
let discountPrice = document.querySelector('.discountPrice');
let finalPrice = document.querySelector('.finalPrice');
let bodyCartList = document.querySelector('#body-cart-list');
let continueBtn = document.querySelector('.continueBtn');
let checkDiscountCode = false;
if (JSON.parse(localStorage.getItem('listCarts')) == null) {
    listCarts = [];
}

totalPrice.innerHTML = "";
let currentTotalPrice = 0;
if (listCarts.length > 0) {
    bodyCartList.innerHTML = "";
    continueBtn.style.display = "block";
    for (let i = 0; i < listCarts.length; i++) {
        currentTotalPrice += listCarts[i].price * listCarts[i].quantity; // Calculate total price
    };
    if (tempPrice && totalPrice) {
        totalPrice.innerHTML += currentTotalPrice.toLocaleString() + " VND";
        quantity.innerHTML = listCarts.length;
        tempPrice.innerHTML = currentTotalPrice.toLocaleString() + " VND";
        finalPrice.innerHTML = currentTotalPrice.toLocaleString() + " VND";
    };
    listCarts.forEach((item, index) => {
        let newDiv = document.createElement('tr');
        newDiv.innerHTML = `<td>
            <a href="#" onclick="removeFromCart('${index}')">X</a>
        </td>
        <td>
            <a href="#">
                <div class="product-image">
                    <img alt="Stylexpo" src="media/images/${item.productLink}.jpg" style="max-width:187px">
                </div>
            </a>
        </td>
        <td>
            <div class="product-title">
                <a href="#">${item.productName}</a><br/>
                <span>${item.note}</span>
            </div>
        </td>
        <td>
            <div class="quantity">
                <input type="number" min="1" value=${item.quantity} readonly>
            </div>
        </td>
        <td>
            <ul>
                <li>
                    <div class="price-box">
                        <span class="price">${item.price.toLocaleString()} VND</span>
                    </div>
                </li>
            </ul>
        </td>
        <td>
            <div class="total-price-box">
                <span class="price">${(item.price * item.quantity).toLocaleString()} VND</span>
            </div>
        </td>
`;
        bodyCartList.append(newDiv);
    })

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
    })
} else {
    document.querySelector('.cart-table').innerHTML
        = "<p>Hiện bạn đang không có món hàng nào, hãy chọn ít nhất 1 món trước khi quay lại đây nhé! </p> "
        + "<p>Bạn có thể mua đồ tại <a href='index.html' class='link' onclick='passData()' style='color:red;'>TRANG CHỦ</a> hoặc <a href='sanpham.html' class='link' onclick='passData()' style='color:red;'>SẢN PHẨM</a> nhé</p>";
    continueBtn.style.display = "none";
}

function discountCodeSubmit(e) {
    e.preventDefault();
    if (discountCode.value == "") {
        announce.innerHTML = "Bạn chưa nhập mã, hãy thử lại";
        announce.style.color = "red";
        discountPrice.innerHTML = "0 VND";
        finalPrice.innerHTML = currentTotalPrice.toLocaleString() + " VND";
        checkDiscountCode = false;
    } else {
        fetch("https://fptumerchapi-cocsaigon.up.railway.app/api/DiscountCode/" + discountCode.value, {
            method: "GET"
        }).then(res => {
            return res.json();
        }).then(data => {
            if (data.length == 0) {
                announce.innerHTML = "Mã bạn nhập đã sai, hãy thử lại";
                announce.style.color = "red";
                discountPrice.innerHTML = "0 VND";
                finalPrice.innerHTML = currentTotalPrice.toLocaleString() + " VND";
                checkDiscountCode = false;
            } else {
                currentTotalPrice = 0;
                for (let i = 0; i < listCarts.length; i++) {
                    currentTotalPrice += listCarts[i].price * listCarts[i].quantity; // Calculate total price
                };
                announce.innerHTML = "Mã hợp lệ";
                announce.style.color = "green";
                discountPrice.innerHTML = (parseInt(currentTotalPrice / 10)).toLocaleString() + " VND";
                finalPrice.innerHTML = (parseInt(currentTotalPrice * 9 / 10)).toLocaleString() + " VND";
                checkDiscountCode = true;
            }
        }).catch(error => {
            console.log(error);
        });
    }
}

function removeFromCart(index) {
    let confirmation = confirm("Bạn có muốn xoá món hàng này?");
    if (confirmation) {
        listCarts.splice(index, 1);
    }
    console.log(listCarts);
    reloadCart();
}

function reloadCart() {
    let currentTotalPrice = 0;

    for (let i = 0; i < listCarts.length; i++) {
        currentTotalPrice += listCarts[i].price * listCarts[i].quantity; // Calculate total price
    }
    if (quantity && tempPrice) {
        tempPrice.innerHTML = currentTotalPrice.toLocaleString() + " VND";
        quantity.innerHTML = listCarts.length;
        totalPrice.innerHTML = currentTotalPrice.toLocaleString() + " VND";
        if (checkDiscountCode == false) {
            discountPrice.innerHTML = "0 VND";
            finalPrice.innerHTML = currentTotalPrice.toLocaleString() + " VND";
        } else {
            discountPrice.innerHTML = (parseInt(currentTotalPrice / 10)).toLocaleString() + " VND";
            finalPrice.innerHTML = (currentTotalPrice * 9 / 10).toLocaleString() + " VND";
        }
    };
    bodyCartList.innerHTML = "";
    cartTop.innerHTML = "";
    listCarts.forEach((item, index) => {
        let newDiv = document.createElement('tr');
        newDiv.innerHTML = `<td>
            <a href="#" onclick="removeFromCart('${index}')">X</a>
        </td>
        <td>
            <a href="#">
                <div class="product-image">
                    <img alt="Stylexpo" src="media/images/${item.productLink}.jpg" style="max-width:187px">
                </div>
            </a>
        </td>
        <td>
            <div class="product-title">
                <a href="#">${item.productName}</a><br/>
                <span>${item.note}</span>
            </div>
        </td>
        <td>
            <div class="quantity">
                <input type="number" min="1" id="quantityInput" value="${item.quantity}" readonly>
            </div>
        </td>
        <td>
            <ul>
                <li>
                    <div class="price-box">
                        <span class="price">${item.price.toLocaleString()} VND</span>
                    </div>
                </li>
            </ul>
        </td>
        <td>
            <div class="total-price-box">
                <span class="price">${(item.price * item.quantity).toLocaleString()} VND</span>
            </div>
        </td>
    `;
        bodyCartList.append(newDiv);
    })
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
    })
    if (listCarts.length > 0) {
        continueBtn.style.display = "block";
    } else {
        document.querySelector('.cart-table').innerHTML
            = "<p>Hiện bạn đang không có món hàng nào, hãy chọn ít nhất 1 món trước khi quay lại đây nhé! </p> "
            + "<p>Bạn có thể mua đồ tại <a href='index.html' class='link' onclick='passData()' style='color:red;'>TRANG CHỦ</a> hoặc <a href='sanpham.html' class='link' onclick='passData()' style='color:red;'>SẢN PHẨM</a> nhé</p>";
        continueBtn.style.display = "none";
    }
    localStorage.setItem('listCarts', JSON.stringify(listCarts));
}

function passData() {
    localStorage.setItem('listCarts', JSON.stringify(listCarts));
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

function continueToLienHe() {
    console.log(listCarts);
    console.log(currentTotalPrice);
    let orderInformation = [{
        discountCodeID: discountCode.value.toUpperCase(),
    }];
    console.log(orderInformation);
    //window.location.href = "./lienhe.html";
}