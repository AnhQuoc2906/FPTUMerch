let order = JSON.parse(localStorage.getItem('order'));
let user = localStorage.getItem('currentUser');
let userName = document.querySelector('.user-name'); // SET USER NAME Ở TRÊN WEBSITE
let orderDetailsHTML = document.querySelector('#orderDetail');
let name = document.querySelector('#name');
let orderID = document.querySelector('#orderID');
let phoneNumber = document.querySelector('#phoneNumber');
let email = document.querySelector('#email');
let address = document.querySelector('#address');
let discountCode = document.querySelector('#discountCode');
let totalPrice = document.querySelector('#totalPrice');
let orderDetails = [];
let products = [];

user = JSON.parse(user);
console.log(user);
console.log(order);

if (user == null) {
    document.querySelector('.account-table').innerHTML = `
        <p style="color:red">HIỆN TẠI BẠN CHƯA ĐĂNG NHẬP, VUI LÒNG QUAY TRỞ LẠI TRANG ĐĂNG NHẬP <a href="./login.html?" style="color: blue">TẠI ĐÂY</a></p>`
    document.querySelector('.user-welcome').innerHTML = "";
} else {
    userName.innerHTML = user.FullName;
    fetch("https://fptumerchapi-cocsaigon.up.railway.app/api/Product/Get", {
        method: "GET",
        mode: "cors"
    })
        .then(res => res.json())
        .then(data => {
            // Assuming data is an array of products
            // Push each product into the products array
            products.push(...data);
            console.log(products);
            Object.values(order.orderDetails).forEach((values) => {
                let checkProduct = products.find(element => {
                    return element.productID == values.productID;
                });
                name.innerHTML = order.ordererName;
                orderID.innerHTML = order.orderID;
                phoneNumber.innerHTML = order.ordererPhoneNumber;
                email.innerHTML = order.ordererEmail;
                if(order.deliveryAddress != ""){
                    address.innerHTML = order.deliveryAddress;
                } else{
                    address.innerHTML = "Nhận tại trường";
                    address.style.color = "red";
                    address.style.fontWeight = "bold";
                }
                //Kiểm tra mã giảm giá:
                if(order.discountCodeID != ""){
                    discountCode.innerHTML = order.discountCodeID;
                } else{
                    discountCode.innerHTML = "Không có";
                }
                //Note lại tổng tiền cho đơn hàng
                totalPrice.innerHTML = order.totalPrice.toLocaleString() + " VND";
                let orderDetail = document.createElement('tr');
                orderDetail.innerHTML = `
                                        <td>
                                            ${checkProduct.productName}
                                        </td>
                                        <td>
                                            ${values.amount}
                                        </td>
                                        <td>
                                            ${values.note}
                                        </td>
                                `;
                orderDetailsHTML.append(orderDetail);
            });
            document.getElementById('loader').remove();
        })
        .catch(error => {
            console.log(error);
        });
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = "./login.html?";
}

function backToPrevious(){
    history.back();
}

