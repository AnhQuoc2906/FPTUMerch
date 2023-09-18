let user = JSON.parse(localStorage.getItem('currentUser')); // LẤY THÔNG TIN NGƯỜI DÙNG
let userName = document.querySelector('.user-name'); // SET USER NAME Ở TRÊN WEBSITE
let orderList = document.querySelector('#OrderList');
let tmpList = []; //LƯU ORDER ĐỂ TIẾN HÀNH SEARCH THEO ORDER

if (JSON.parse(localStorage.getItem('currentUser') == null)) { //Chỉ cấp quyền cho người dùng đã đăng nhập
    document.querySelector('.account-table').innerHTML = `
        <p style="color:red">HIỆN TẠI BẠN CHƯA ĐĂNG NHẬP, VUI LÒNG QUAY TRỞ LẠI TRANG ĐĂNG NHẬP <a href="./login.html?" style="color: blue">TẠI ĐÂY</a></p>`
    document.querySelector('.user-welcome').innerHTML = "";
} else {
    userName.innerHTML = user.FullName;
    fetch('https://fptumerchapi-cocsaigon.up.railway.app/api/Orders/GetActiveOrders', {
        method: "GET",
        mode: "cors"
    }).then(res => {
        return res.json();
    }).then(data => {
        orderList.innerHTML = "";
        let paid = [];
        let notPaid = [];
        let totalMoney = 0, moneyReceived =0;
        data.forEach((values, index) => {
            tmpList.push(values);
            if (values != null) {
                if(values.paidStatus == true){
                    paid.push(values);
                    moneyReceived += values.totalPrice;
                } else{
                    notPaid.push(values);
                }
                totalMoney += values.totalPrice;
                const date = new Date(Date.parse(values.createDate));
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const orderDate = [day, month, year].join('/');
                let order = document.createElement('tr');
                order.innerHTML = `<td>
                                        <a href="#" id="orderID${index}" rel="noopener noreferrer" onclick="productInfo('${values.orderID}')">${values.orderID}</a>
                                        <input type="hidden" id="phoneNumber${index}" value="${values.ordererPhoneNumber}" readonly/>
                                        <input type="hidden" id="email${index}" value="${values.ordererEmail}" readonly/>
                                        <input type="hidden" id="address${index}" value="${values.deliveryAddress}" readonly/>
                                        <input type="hidden" id="price${index}" value=${values.totalPrice} readonly/>
                                        <input type="hidden" id="earning${index}" value=${values.earningMethod} readonly/>
                                        <input type="hidden" id="discountCodeID${index}" value=${values.discountCodeID} readonly/>
                                    </td>
                                    <td id="orderDate${index}">
                                    ${orderDate}
                                    </td>
                                    <td id="orderName${index}">
                                    ${values.ordererName}
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
        document.querySelector('.totalNumberOfOrders').innerHTML = tmpList.length;
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
        mode: "cors"
    })
        .then(res => res.json())
        .then(data => {
            localStorage.setItem('order', JSON.stringify(data));
            console.log(localStorage.getItem('order'));
            window.location.href = './thongtinsanphamadmin.html';
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
        mode: "cors",
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

function searchBy(){
    let type = document.querySelector('#searchBy').value;
    let searchValue = document.querySelector('#searchItem').value;
    document.getElementById('announce').innerHTML = "";
    orderList.innerHTML = "";
    if(parseInt(type) == 1){ //Mã đơn hàng     
        tmpList.forEach((values,index) =>{
            if(values.orderID.includes(searchValue)){
                const date = new Date(Date.parse(values.createDate));
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const orderDate = [day, month, year].join('/');
                let order = document.createElement('tr');
                order.innerHTML = `<td>
                                        <a href="#" id="orderID${index}" rel="noopener noreferrer" onclick="productInfo('${values.orderID}')">${values.orderID}</a>
                                        <input type="hidden" id="phoneNumber${index}" value="${values.ordererPhoneNumber}" readonly/>
                                        <input type="hidden" id="email${index}" value="${values.ordererEmail}" readonly/>
                                        <input type="hidden" id="address${index}" value="${values.deliveryAddress}" readonly/>
                                        <input type="hidden" id="price${index}" value=${values.totalPrice} readonly/>
                                        <input type="hidden" id="earning${index}" value=${values.earningMethod} readonly/>
                                        <input type="hidden" id="discountCodeID${index}" value=${values.discountCodeID} readonly/>
                                    </td>
                                    <td id="orderDate${index}">
                                    ${orderDate}
                                    </td>
                                    <td id="orderName${index}">
                                    ${values.ordererName}
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
    } else if(parseInt(type)==2){ //Tên người đặt
        tmpList.forEach((values,index) =>{
            if(values.ordererName.includes(searchValue)){
                const date = new Date(Date.parse(values.createDate));
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const orderDate = [day, month, year].join('/');
                let order = document.createElement('tr');
                order.innerHTML = `<td>
                                        <a href="#" id="orderID${index}" rel="noopener noreferrer" onclick="productInfo('${values.orderID}')">${values.orderID}</a>
                                        <input type="hidden" id="phoneNumber${index}" value="${values.ordererPhoneNumber}" readonly/>
                                        <input type="hidden" id="email${index}" value="${values.ordererEmail}" readonly/>
                                        <input type="hidden" id="address${index}" value="${values.deliveryAddress}" readonly/>
                                        <input type="hidden" id="price${index}" value=${values.totalPrice} readonly/>
                                        <input type="hidden" id="earning${index}" value=${values.earningMethod} readonly/>
                                        <input type="hidden" id="discountCodeID${index}" value=${values.discountCodeID} readonly/>
                                    </td>
                                    <td id="orderDate${index}">
                                    ${orderDate}
                                    </td>
                                    <td id="orderName${index}">
                                    ${values.ordererName}
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
    } else if(parseInt(type)==3){ // Mã giảm giá
        tmpList.forEach((values,index) =>{
            if(values.discountCodeID.toUpperCase() == searchValue.toUpperCase()){
                const date = new Date(Date.parse(values.createDate));
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const orderDate = [day, month, year].join('/');
                let order = document.createElement('tr');
                order.innerHTML = `<td>
                                        <a href="#" id="orderID${index}" rel="noopener noreferrer" onclick="productInfo('${values.orderID}')">${values.orderID}</a>
                                        <input type="hidden" id="phoneNumber${index}" value="${values.ordererPhoneNumber}" readonly/>
                                        <input type="hidden" id="email${index}" value="${values.ordererEmail}" readonly/>
                                        <input type="hidden" id="address${index}" value="${values.deliveryAddress}" readonly/>
                                        <input type="hidden" id="price${index}" value=${values.totalPrice} readonly/>
                                        <input type="hidden" id="earning${index}" value=${values.earningMethod} readonly/>
                                        <input type="hidden" id="discountCodeID${index}" value=${values.discountCodeID} readonly/>
                                    </td>
                                    <td id="orderDate${index}">
                                    ${orderDate}
                                    </td>
                                    <td id="orderName${index}">
                                    ${values.ordererName}
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
    } 
    //TRƯỜNG HỢP ĐÃ TÌM VÀ TRẢ RA KHÔNG CÓ KẾT QUẢ
    if(orderList.innerHTML == ""){
        document.getElementById('announce').style.color = "red";
        document.getElementById('announce').innerHTML = "<label>KHÔNG CÓ KẾT QUẢ, HÃY KIỂM TRA TỪ BẠN NHẬP HOẶC BẠN ĐANG TÌM THEO GÌ NHÉ</label>"
    }
}

function showSortOptions(index){
    const dropdowns = document.querySelectorAll('.dropdown-content')
    dropdowns.forEach(dropdown => {
        dropdown.style.display = 'none';
        dropdown.innerHTML = '';
    });
    if(index === "payments"){
        document.getElementById("dropdown-payments").innerHTML = `
        <a onclick="filter('payments','1')">Momo</a>
		<a onclick="filter('payments','2')">Chuyển khoản ngân hàng</a>`;
        document.getElementById("dropdown-payments").style.display= "block";
    } else if(index === "paidStatus"){
        document.getElementById("dropdown-paid-status").innerHTML = `
        <a onclick="filter('paidStatus',true)">Đã thanh toán</a>
        <a onclick="filter('paidStatus',false)">Chưa Thanh Toán</a>`;
        document.getElementById("dropdown-paid-status").style.display= "block";
    } else if(index === "earningMethod"){
        document.getElementById("dropdown-earning-method").innerHTML = `
        <a onclick="filter('earningMethod','1')">Tại FPT</a>
		<a onclick="filter('earningMethod','2')">Ship tận nhà</a>`;
        document.getElementById("dropdown-earning-method").style.display= "block";
    } else if(index === "status"){
        document.getElementById("dropdown-status").innerHTML = `
        <a onclick="filter('status','1')">Đang xác nhận</a>
        <a onclick="filter('status','2')">Đã Xác Nhận</a>
        <a onclick="filter('status','3')">Đã Giao Hàng</a>
        <a onclick="filter('status','4')">Huỷ đơn</a>`;
        document.getElementById("dropdown-status").style.display= "block";
    } else if(index === "shipper"){
        document.getElementById("dropdown-shipper").innerHTML = `
        <a onclick="filter('shipper','Nhật Linh')">Nhật Linh</a>
        <a onclick="filter('shipper','Tâm Hào')">Tâm Hào</a>
        <a onclick="filter('shipper','Phương Thảo')">Phương Thảo</a>
        <a onclick="filter('shipper','Thanh Phước')">Thanh Phước</a>
        <a onclick="filter('shipper','Thành Danh')">Thành Danh</a>
        <a onclick="filter('shipper','Ngọc Thiện')">Ngọc Thiện</a>
        <a onclick="filter('shipper','Thanh Hằng')">Thanh Hằng</a>
        <a onclick="filter('shipper','Đoan Thanh')">Đoan Thanh</a>
        <a onclick="filter('shipper','Quốc Anh')">Quốc Anh</a>
        <a onclick="filter('shipper','Bảo Quân')">Bảo Quân</a>
        <a onclick="filter('shipper','Tỷ Phú')">Tỷ Phú</a>
        <a onclick="filter('shipper','Hạnh Nhân')">Hạnh Nhân</a>
        <a onclick="filter('shipper','Đức Trọng')">Đức Trọng</a>
        <a onclick="filter('shipper','Công Huy')">Công Huy</a>
        <a onclick="filter('shipper','Kiều Loan')">Kiều Loan</a>`;
        document.getElementById("dropdown-shipper").style.display= "block";
        document.getElementById("dropdown-shipper").style.overflowY = "scroll";
        document.getElementById("dropdown-shipper").style.maxHeight = "250px";
    }
}

window.onclick = (event) => {
    if(!event.target.matches('.fa-filter')){
        document.getElementById("dropdown-payments").style.display = "none";
        document.getElementById("dropdown-paid-status").style.display= "none";
        document.getElementById("dropdown-earning-method").style.display= "none";
        document.getElementById("dropdown-status").style.display= "none";
        document.getElementById("dropdown-shipper").style.display= "none";
    }
}

function filter(type,value){
    document.getElementById('announce').innerHTML = "";
    orderList.innerHTML = "";
    if(type === "payments"){
        tmpList.forEach((values,index) =>{
            if(values.payments == value){
                const date = new Date(Date.parse(values.createDate));
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const orderDate = [day, month, year].join('/');
                let order = document.createElement('tr');
                order.innerHTML = `<td>
                                        <a href="#" id="orderID${index}" rel="noopener noreferrer" onclick="productInfo('${values.orderID}')">${values.orderID}</a>
                                        <input type="hidden" id="phoneNumber${index}" value="${values.ordererPhoneNumber}" readonly/>
                                        <input type="hidden" id="email${index}" value="${values.ordererEmail}" readonly/>
                                        <input type="hidden" id="address${index}" value="${values.deliveryAddress}" readonly/>
                                        <input type="hidden" id="price${index}" value=${values.totalPrice} readonly/>
                                        <input type="hidden" id="earning${index}" value=${values.earningMethod} readonly/>
                                        <input type="hidden" id="discountCodeID${index}" value=${values.discountCodeID} readonly/>
                                    </td>
                                    <td id="orderDate${index}">
                                    ${orderDate}
                                    </td>
                                    <td id="orderName${index}">
                                    ${values.ordererName}
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
    }else if(type === "paidStatus"){
        tmpList.forEach((values,index) =>{
            if(values.paidStatus == value){
                const date = new Date(Date.parse(values.createDate));
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const orderDate = [day, month, year].join('/');
                let order = document.createElement('tr');
                order.innerHTML = `<td>
                                        <a href="#" id="orderID${index}" rel="noopener noreferrer" onclick="productInfo('${values.orderID}')">${values.orderID}</a>
                                        <input type="hidden" id="phoneNumber${index}" value="${values.ordererPhoneNumber}" readonly/>
                                        <input type="hidden" id="email${index}" value="${values.ordererEmail}" readonly/>
                                        <input type="hidden" id="address${index}" value="${values.deliveryAddress}" readonly/>
                                        <input type="hidden" id="price${index}" value=${values.totalPrice} readonly/>
                                        <input type="hidden" id="earning${index}" value=${values.earningMethod} readonly/>
                                        <input type="hidden" id="discountCodeID${index}" value=${values.discountCodeID} readonly/>
                                    </td>
                                    <td id="orderDate${index}">
                                    ${orderDate}
                                    </td>
                                    <td id="orderName${index}">
                                    ${values.ordererName}
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
    }else if(type === "earningMethod"){
        tmpList.forEach((values,index) =>{
            if(values.earningMethod == value){
                const date = new Date(Date.parse(values.createDate));
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const orderDate = [day, month, year].join('/');
                let order = document.createElement('tr');
                order.innerHTML = `<td>
                                        <a href="#" id="orderID${index}" rel="noopener noreferrer" onclick="productInfo('${values.orderID}')">${values.orderID}</a>
                                        <input type="hidden" id="phoneNumber${index}" value="${values.ordererPhoneNumber}" readonly/>
                                        <input type="hidden" id="email${index}" value="${values.ordererEmail}" readonly/>
                                        <input type="hidden" id="address${index}" value="${values.deliveryAddress}" readonly/>
                                        <input type="hidden" id="price${index}" value=${values.totalPrice} readonly/>
                                        <input type="hidden" id="earning${index}" value=${values.earningMethod} readonly/>
                                        <input type="hidden" id="discountCodeID${index}" value=${values.discountCodeID} readonly/>
                                    </td>
                                    <td id="orderDate${index}">
                                    ${orderDate}
                                    </td>
                                    <td id="orderName${index}">
                                    ${values.ordererName}
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
    }else if(type === "status"){
        tmpList.forEach((values,index) =>{
            if(values.status == value){
                const date = new Date(Date.parse(values.createDate));
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const orderDate = [day, month, year].join('/');
                let order = document.createElement('tr');
                order.innerHTML = `<td>
                                        <a href="#" id="orderID${index}" rel="noopener noreferrer" onclick="productInfo('${values.orderID}')">${values.orderID}</a>
                                        <input type="hidden" id="phoneNumber${index}" value="${values.ordererPhoneNumber}" readonly/>
                                        <input type="hidden" id="email${index}" value="${values.ordererEmail}" readonly/>
                                        <input type="hidden" id="address${index}" value="${values.deliveryAddress}" readonly/>
                                        <input type="hidden" id="price${index}" value=${values.totalPrice} readonly/>
                                        <input type="hidden" id="earning${index}" value=${values.earningMethod} readonly/>
                                        <input type="hidden" id="discountCodeID${index}" value=${values.discountCodeID} readonly/>
                                    </td>
                                    <td id="orderDate${index}">
                                    ${orderDate}
                                    </td>
                                    <td id="orderName${index}">
                                    ${values.ordererName}
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
    }else if(type === "shipper"){
        tmpList.forEach((values,index) =>{
            if(values.shipper == value){
                const date = new Date(Date.parse(values.createDate));
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const orderDate = [day, month, year].join('/');
                let order = document.createElement('tr');
                order.innerHTML = `<td>
                                        <a href="#" id="orderID${index}" rel="noopener noreferrer" onclick="productInfo('${values.orderID}')">${values.orderID}</a>
                                        <input type="hidden" id="phoneNumber${index}" value="${values.ordererPhoneNumber}" readonly/>
                                        <input type="hidden" id="email${index}" value="${values.ordererEmail}" readonly/>
                                        <input type="hidden" id="address${index}" value="${values.deliveryAddress}" readonly/>
                                        <input type="hidden" id="price${index}" value=${values.totalPrice} readonly/>
                                        <input type="hidden" id="earning${index}" value=${values.earningMethod} readonly/>
                                        <input type="hidden" id="discountCodeID${index}" value=${values.discountCodeID} readonly/>
                                    </td>
                                    <td id="orderDate${index}">
                                    ${orderDate}
                                    </td>
                                    <td id="orderName${index}">
                                    ${values.ordererName}
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
    }
}