let listCarts = JSON.parse(sessionStorage.getItem('listCarts'));
let totalPriceTemp = document.querySelector('.totalPriceTemp'); // ĐƠN HÀNG - ĐƠN HÀNG
let discount = document.querySelector('.discount'); //ĐƠN HÀNG - GIẢM
let finalPrice = document.querySelector('.finalPrice'); // ĐƠN HÀNG - TẠM TÍNH
let discountCode = document.querySelector('#discountCode'); // THU THẬP MÃ GIẢM GIÁ DO NGƯỜI DÙNG NHẬP
let showCart = document.querySelector('#showCart');

let currentTotalPrice = 0;
for (let i = 0; i < listCarts.length; i++) {
    currentTotalPrice += listCarts[i].price * listCarts[i].quantity; // Calculate total price
};
if (/*quantity &&*/ totalPriceTemp) {
    // quantity.innerHTML = listCarts.length;
    // quantityMobile.innerHTML = listCarts.length;
    totalPriceTemp.innerHTML = currentTotalPrice.toLocaleString() + " VND";
    // totalPriceMobile.innerHTML = currentTotalPrice.toLocaleString() + " VND";
    finalPrice.innerHTML = currentTotalPrice.toLocaleString() + " VND";
};

//SHOW DANH SÁCH DETAILS TRONG ORDER
showCart.innerHTML="";
listCarts.forEach((value, index) => {
    if (value != null) {
        let newDiv = document.createElement('tr');
        newDiv.innerHTML = `<td>
                                <a href="#" onclick="removeFromCart('${index}',event)"><i class="fa fa-times"></i></a>
                            </td>
                            <td>
                                <a href="#">
                                    <div class="product-image">
                                        <img alt="Stylexpo" src="media/images/${value.productLink}.jpg">
                                    </div>
                                </a>
                            </td>
                            <td>
                                <div class="product-title">
                                    <a href="#">${value.productName}</a><br/>
                                    <span>${value.note}</span>
                                </div>
                            </td>
                            <td>
                                <div class="quantity">
                                    <input type="number" min="1" value=${value.quantity} >
                                </div>
                            </td>
                            <td>
                                <ul>
                                    <li>
                                        <div class="price-box">
                                            <span class="price">${value.price.toLocaleString()} VND</span>
                                        </div>
                                    </li>
                                </ul>
                            </td>
                            <td>
                                <div class="total-price-box">
                                    <span class="price">${(value.price * value.quantity).toLocaleString()} VND</span>
                                </div>
                            </td>`;
        showCart.append(newDiv);
    }
})

function discountCodeCheck(){
    fetch("https://fptumerchapi-cocsaigon.up.railway.app/api/DiscountCode/" + discountCode.value, {
        method: "GET"
    }).then(res => {
        return res.json();
    }).then(data => {
        if(data.length == 0){
            document.querySelector('.announce').innerHTML = "MÃ GIẢM GIÁ SAI, HÃY THỬ LẠI";
            discount.innerHTML = "0 VND";
            finalPrice.innerHTML = totalPriceTemp.innerHTML;
        } else {
            document.querySelector('.announce').innerHTML = "";
            discount.innerHTML = "- " + parseInt(currentTotalPrice / 10).toLocaleString() + "VND";
            finalPrice.innerHTML = parseInt(currentTotalPrice* 9 /10).toLocaleString() + "VND";
            console.log(data);
        }
    }).catch(error =>{
        console.log(error);
    })
}

function removeFromCart(index, e) {
    e.preventDefault();
    // Check if the index is valid and within the bounds of your listCarts array
    if (index >= 0 && index < listCarts.length) {
        const response = confirm("Bỏ món hàng này ra khỏi danh sách?");
        if (response) {
            // Remove the item at the specified index from the listCarts array
            listCarts.splice(index, 1);
        }
    }
    else {
        console.error("Invalid index provided to removeFromCart");
    }
}

function reloadPage(){

}