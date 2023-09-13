let user = JSON.parse(localStorage.getItem('currentUser')); // LẤY THÔNG TIN NGƯỜI DÙNG
let userName = document.querySelector('.user-name'); // SET USER NAME Ở TRÊN WEBSITE
let orderList = document.querySelector('#OrderList');

if (JSON.parse(localStorage.getItem('currentUser') == null)) { //Chỉ cấp quyền cho người dùng đã đăng nhập
    document.querySelector('.account-table').innerHTML = `
        <p style="color:red">HIỆN TẠI BẠN CHƯA ĐĂNG NHẬP, VUI LÒNG QUAY TRỞ LẠI TRANG ĐĂNG NHẬP <a href="./login.html?" style="color: blue">TẠI ĐÂY</a></p>`
    document.querySelector('.user-welcome').innerHTML = "";
} else {
    userName.innerHTML = user.FullName;
    fetch('https://fptumerchapi-cocsaigon.up.railway.app/api/Orders/GetActiveOrders', {
        method: "GET"
    }).then(res => {
        return res.json();
    }).then(data => {
        orderList.innerHTML = "";
        let paid = [];
        let notPaid = [];
        let totalMoney = 0, moneyReceived =0;
        data.forEach((values, index) => {
            if (values != null) {
                if(values.paidStatus == true){
                    paid.push(values);
                    moneyReceived += values.totalPrice;
                } else{
                    notPaid.push(values);
                }
                totalMoney += values.totalPrice;
                let order = document.createElement('tr');
                order.innerHTML = `<td>
                                        <a href="#" id="orderID${index}" rel="noopener noreferrer" onclick="productInfo('${values.orderID}')">${values.orderID}</a>
                                        <input type="hidden" id="phoneNumber${index}" value="${values.ordererPhoneNumber}" readonly/>
                                        <input type="hidden" id="email${index}" value="${values.ordererEmail}" readonly/>
                                        <input type="hidden" id="address${index}" value="${values.deliveryAddress}" readonly/>
                                        <input type="hidden" id="price${index}" value=${values.totalPrice} readonly/>
                                        <input type="hidden" id="earning${index}" value=${values.earningMethod} readonly/>
                                    </td>
                                    <td id="orderName${index}">
                                    ${values.ordererName}
                                    </td>
                                    <td id="discountCodeID${index}">
                                    ${values.discountCodeID}
                                    </td>
                                    <td id="totalPrice${index}">
                                    ${values.totalPrice.toLocaleString()} VND
                                    </td>
                                    <td>
                                        <select id="payments${index}" name="payments" style="width:100px">
                                            <option value="1" ${values.payments == 1 ? "selected" : ""}>Momo</option>
                                            <option value="2" ${values.payments == 2 ? "selected" : ""}>Chuyển khoản ngân hàng</option>									
                                        </select>
                                    </td>
                                    <td>
                                        <select id="paidStatus${index}" name="paidStatus">
                                            <option value="true" ${values.paidStatus == true ? "selected" : ""}>Đã Thanh Toán</option>
                                            <option value="false" ${values.paidStatus == false ? "selected" : ""}>Chưa Thanh Toán</option>									
                                        </select>
                                    </td>
                                    <td id="earningMethod${index}">
                                    ${values.earningMethod == 1 ? "Tại FPT" :
                                    values.earningMethod == 2 ? "Ship tận nhà" :
                                        ""
                                    }  
                                    </td>
                                    <td>
                                        <select id="status${index}" name="status">
                                            <option value="1" ${values.status == 1 ? "selected" : ""}>Đang Xác Nhận</option>
                                            <option value="2" ${values.status == 2 ? "selected" : ""}>Đã Xác Nhận</option>
                                            <option value="3" ${values.status == 3 ? "selected" : ""}>Đã Giao Hàng</option>
                                            <option value="4" ${values.status == 4 ? "selected" : ""}>Huỷ Đơn</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select id="shipper${index}" name="shipper">
                                            <option value="Nhật Linh" ${values.shipper === "Nhật Linh" ? "selected" : ""}>Nhật Linh</option>
                                            <option value="Tâm Hào" ${values.shipper === "Tâm Hào" ? "selected" : ""}>Tâm Hào</option>
                                            <option value="Phương Thảo" ${values.shipper === "Phương Thảo" ? "selected" : ""}>Phương Thảo</option>
                                            <option value="Thanh Phước" ${values.shipper === "Thanh Phước" ? "selected" : ""}>Thanh Phước</option>
                                            <option value="Thành Danh" ${values.shipper === "Thành Danh" ? "selected" : ""}>Thành Danh</option>
                                            <option value="Ngọc Thiện" ${values.shipper === "Ngọc Thiện" ? "selected" : ""}>Ngọc Thiện</option>
                                            <option value="Thanh Hằng" ${values.shipper === "Thanh Hằng" ? "selected" : ""}>Thanh Hằng</option>
                                            <option value="Đoan Thanh" ${values.shipper === "Đoan Thanh" ? "selected" : ""}>Đoan Thanh</option>
                                            <option value="Quốc Anh" ${values.shipper === "Quốc Anh" ? "selected" : ""}>Quốc Anh</option>
                                            <option value="Bảo Quân" ${values.shipper === "Bảo Quân" ? "selected" : ""}>Bảo Quân</option>
                                            <option value="Tỷ Phú" ${values.shipper === "Tỷ Phú" ? "selected" : ""}>Tỷ Phú</option>
                                            <option value="Hạnh Nhân" ${values.shipper === "Hạnh Nhân" ? "selected" : ""}>Hạnh Nhân</option>
                                            <option value="Đức Trọng" ${values.shipper === "Đức Trọng" ? "selected" : ""}>Đức Trọng</option>
                                            <option value="Công Huy" ${values.shipper === "Công Huy" ? "selected" : ""}>Công Huy</option>
                                            <option value="Kiều Loan" ${values.shipper === "Kiều Loan" ? "selected" : ""}>Kiều Loan</option>
                                        </select>											  
                                    </td>
                                    <td>
                                        <textarea style="border: none; resize: none;" id="note${index}">
                                            ${values.note}
                                        </textarea>
                                    </td>
                                    <td>
                                        <div class="save">
                                            <button id="saveOrder" onclick="updateOrder('${index}')" class="button-to-top">
                                                    SỬA
                                            </button>
                                        </div>
                                    </td>
                        `;
                orderList.append(order);
            }
        });
        document.querySelector('.totalNumberOfOrders').innerHTML = data.length;
        document.querySelector('.totalNumberOfOrdersPaid').innerHTML = paid.length;
        document.querySelector('.totalNumberOfOrdersNotPaid').innerHTML = notPaid.length;
        document.querySelector('.totalNumberOfMoney').innerHTML = totalMoney.toLocaleString() + " VND";
        document.querySelector('.totalNumberOfMoneyPaid').innerHTML = moneyReceived.toLocaleString() + " VND";
        document.getElementById('loader').remove();
    }).catch(error => {
        console.log(error);
    })
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = "./login.html?";
}

function productInfo(key) {
    fetch('https://fptumerchapi-cocsaigon.up.railway.app/api/Orders/GetOrdersByOrderID/' + key, {
        method: "GET",
    })
        .then(res => res.json())
        .then(data => {
            localStorage.setItem('order', JSON.stringify(data));
            console.log(localStorage.getItem('order'));
            window.location.href = './thongtinsanpham.html';
        })
        .catch(error => {
            console.log(error);
        });
}

function updateOrder(index) {
    let orderID = document.querySelector('#orderID' + index).innerHTML;
    let orderName = document.querySelector('#orderName' + index).innerHTML;
    let email = document.getElementById('email' + index).value;
    let discountCodeID = document.getElementById('discountCodeID' + index).value;
    let phoneNumber = document.getElementById('phoneNumber' + index).value;
    let deliveryAddress = document.getElementById('address' + index).value;
    let totalPrice = document.getElementById('price' + index).value;
    let payments = (document.querySelector('#payments' + index)).options[(document.querySelector('#payments' + index)).selectedIndex].value;
    let paidStatus = (document.querySelector('#paidStatus' + index)).options[(document.querySelector('#paidStatus' + index)).selectedIndex].value;
    let earningMethod = document.getElementById('earning' + index).value;
    let status = (document.querySelector('#status' + index)).options[(document.querySelector('#status' + index)).selectedIndex].value;
    let shipper = (document.querySelector('#shipper' + index)).options[(document.querySelector('#shipper' + index)).selectedIndex].value;
    let note = document.getElementById('note' + index).value;

    if (paidStatus == "true") {
        paidStatus = true;
    } else paidStatus = false;
    let orderUpdate = {
        DiscountCodeID: discountCodeID,
        OrdererName: orderName,
        OrdererPhoneNumber: phoneNumber,
        OrdererEmail: email,
        DeliveryAddress: deliveryAddress,
        TotalPrice: totalPrice,
        Note: note,
        EarningMethod: earningMethod,
        Payments: payments,
        Status: status,
        PaidStatus: paidStatus,
        Shipper: shipper,
        OrderDetails: []
    };
    console.log(orderUpdate);
    fetch("https://fptumerchapi-cocsaigon.up.railway.app/api/Orders/Put/" + orderID, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(orderUpdate),
    }).then(res => {
        return res.json();
    }).then(data => {
        console.log(data);
    }).catch(error => {
        console.log(error);
    })

    // Display the pop-up
    const popup = document.getElementById('popup');
    popup.style.display = 'block';

    // Set the content of the pop-up (customize this as needed)
    popup.querySelector('.popup-content').innerHTML = 'SỬA ĐƠN THÀNH CÔNG';

    // Automatically close the pop-up after 3 seconds (3000 milliseconds)
    setTimeout(function () { popup.style.display = 'none'; }, 3000);
    //shirtSizeCombo.options[shirtSizeCombo.selectedIndex].text
    //location.reload();
}