let user = JSON.parse(localStorage.getItem('currentUser')); // LẤY THÔNG TIN NGƯỜI DÙNG
let userName = document.querySelector('.user-name'); // SET USER NAME Ở TRÊN WEBSITE
let orderList = document.querySelector('#OrderList');

if (JSON.parse(localStorage.getItem('currentUser') == null)) { //Chỉ cấp quyền cho người dùng đã đăng nhập
    document.querySelector('.account-table').innerHTML = `
        <p style="color:red">HIỆN TẠI BẠN CHƯA ĐĂNG NHẬP, VUI LÒNG QUAY TRỞ LẠI TRANG ĐĂNG NHẬP <a href="./login.html?" style="color: blue">TẠI ĐÂY</a></p>`
    document.querySelector('.user-welcome').innerHTML = "";
} else {
    userName.innerHTML = user.FullName;
    fetch('https://fptumerchapi-cocsaigon.up.railway.app/api/Orders/GetOrders', {
        method: "GET"
    }).then(res => {
        return res.json();
    }).then(data => {
        console.log(data);
        orderList.innerHTML = "";
        data.forEach((values) => {
            if (values != null) {
                let order = document.createElement('tr');
                order.innerHTML = `<td>
                                    <a href="#" rel="noopener noreferrer" onclick="productInfo('${values.orderID}')">${values.orderID}</a>
                                </td>
                                <td>
                                    ${values.ordererName}
                                </td>
                                <td>
                                    ${values.discountCodeID}
                                </td>
                                <td>
                                    ${values.totalPrice.toLocaleString()} VND
                                </td>
                                <td>
                                    ${values.payments == "1" ? "Momo" :
                                    values.payments == "2" ? "Chuyển khoản ngân hàng" :
                                        ""
                                    }
                                </td>
                                <td>
                                    ${values.paidStatus == true ? "Đã thanh toán" :
                                        values.paidStatus == false ? "Chưa thanh toán" :
                                            ""
                                    }
                                </td>
                                <td>
                                    ${values.earningMethod == "1" ? "Tại FPT" :
                                        values.earningMethod == "2" ? "Ship tận nhà" :
                                            ""
                                    }   
                                </td>
                                <td>
                                    ${values.status == "1" ? `Đang Xác Nhận`:
                                      values.status == "2" ? `Đã Xác Nhận ` :
                                        values.status == "3" ? `Đã Giao Hàng` :
                                        values.status == "4" ? `Huỷ đơn` : ""
                                    }          
                                </td>
                                <td>
                                    ${values.shipper == null ? `` : values.shipper}										  
                                </td>
                                <td>
                                    <textarea style="border: none; resize: none;">
                                    ${values.note}
                                    </textarea>
                                </td>
                        `;
                orderList.append(order);
            }
        })
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