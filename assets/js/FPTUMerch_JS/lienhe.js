let cartTop = document.querySelector('.cart-top'); // Show the cart information
let quantity = document.querySelector('.quantity');  // How many kinds of products are there
let totalPrice = document.querySelector('.totalPrice');
let customerName = document.querySelector('#name');
let customerTelephone = document.querySelector('#phone');
let customerEmail = document.querySelector('#email');
let earningMethod = document.querySelector('#local');
let deliveryAddress = document.querySelector('#deliveryAddress');
let listCarts = JSON.parse(localStorage.getItem('listCarts'));
let priceForLienHe = localStorage.getItem('priceForLienHe');
let orderFinalPrice = document.querySelector('.orderFinalPrice');

let quantityMobile = document.querySelector('.quantity-mobile'); // How many kinds of products are there
let cartTopMobile = document.querySelector('.cart-top-mobile'); // Show the cart information
let totalPriceMobile = document.querySelector('.total-price-mobile');
let orderInformation = JSON.parse(localStorage.getItem('orderInformation'));

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
                <p>${value.amount} </p>
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
                <p>${value.quantity} </p>
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
    currentTotalPrice += listCarts[i].price * listCarts[i].amount; // Calculate total price
};
if (quantity && totalPrice) {
    quantity.innerHTML = listCarts.length;
    quantityMobile.innerHTML = listCarts.length;
    totalPrice.innerHTML = currentTotalPrice.toLocaleString() + " VND";
    totalPriceMobile.innerHTML = currentTotalPrice.toLocaleString() + " VND";
};

function submitInformation(){
    orderInformation.ordererName = customerName.value;
    orderInformation.ordererPhoneNumber = customerTelephone.value;
    orderInformation.ordererEmail = customerEmail.value;
    orderInformation.deliveryAddress = deliveryAddress.value;
    orderInformation.earningMethod = parseInt(earningMethod.options[earningMethod.selectedIndex].value);
    orderInformation.payments = 1;
    if((document.querySelector('#local')).options[(document.querySelector('#local')).selectedIndex].value == 2){
        priceForLienHe = parseInt(priceForLienHe) + 30000;
        console.log(priceForLienHe);
    } else{
        console.log(priceForLienHe);
    };
    if(document.querySelector('.orderCode').innerHTML == "" &&  document.querySelector('.orderFinalPrice').innerHTML == ""
     && customerName.value != "" && customerTelephone.value != "" && customerEmail.value != ""){
        fetch("https://fptumerchapi-cocsaigon.up.railway.app/api/Orders/Post",{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(orderInformation),
        }).then(res => {
           return res.text();
        }).then(data =>{
            document.querySelector('.orderCode').innerHTML = data;
            document.querySelector('.orderFinalPrice').innerHTML = priceForLienHe.toLocaleString() + " VND";
        }).catch(error =>{
            console.log(error);
        })
    }
}

function completePayment(){
    const popupButton = document.getElementById("popup-button");
		const popup = document.getElementById("popup");
		const popupClose = document.getElementById("popup-close");

		popupButton.addEventListener("click", function() {
    	popup.style.display = "block";
		});

		popupClose.addEventListener("click", function() {
    	popup.style.display = "none";
		});

		popup.addEventListener("click", function(event) {
    	if (event.target === popup) {
        popup.style.display = "none";
    		}
		});
}

function mouse_over(){
    document.getElementById("submitButton").style.backgroundColor = "black";
}

function mouse_out(){
    document.getElementById("submitButton").style.backgroundColor = "#D80806";
}

$('.trigger04').on('click', function(e) {
    if(customerName.value != "" && customerTelephone.value != "" && customerEmail.value != ""){
        e.preventDefault();
        var mask = '<div class="mask-overlay">';
    
        $('.quickview-wrapper01').toggleClass('open');
        $(mask).hide().appendTo('body').fadeIn('fast');
        $('.mask-overlay, .close-qv').on('click', function() {
          $('.quickview-wrapper01').removeClass('open');
          $('.mask-overlay').remove();
        });
    }
});
