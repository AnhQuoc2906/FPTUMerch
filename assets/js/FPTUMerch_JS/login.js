let Email = document.getElementById('email');
let Password = document.getElementById('password');
let announce = document.querySelector('.announce');

console.log(Email.value + Password.value);

function login(){
    let emailCheck = Email.value;
    let passwordCheck = Password.value;
    announce.innerHTML = "";
    fetch("https://fptumerchapi-cocsaigon.up.railway.app/api/Users/GetByEmailAndPassword",{
        method:"POST",
        mode:"cors",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({email: emailCheck, password: passwordCheck})
    }).then(res => {
        return res.json();
    }).then(data =>{
        console.log(data);
        if(data.status == 404){ // Lỗi không tìm được tài khoản
            announce.innerHTML = "Email hoặc mật khẩu không đúng, vui lòng thử lại";
            announce.style.color = "red";
        } else {
            sessionStorage.setItem('currentUser', data);
            let tmpUser = JSON.parse(data);
            console.log(tmpUser);
            if(tmpUser.RoleID == "ulYTvThQ88dNJrFcVRpv"){ // Nếu là admin
                window.location.href = "./admin.html";
            } else if(tmpUser.RoleID == "OpZvv7mUAqZ4hq8fV3gY"){ // Nếu là saler               
                window.location.href = "./seller.html";
            } else if (tmpUser.RoleID == "HU2RjaPZ8N0VcPMAqTX3"){// Nếu là logistics
                announce.innerHTML = "Biết rằng m là logistic rồi nhưng mà m vào web làm gì :D ?";
                announce.style.color = "green";
            } else{
                announce.innerHTML = "Email hoặc mật khẩu không đúng, vui lòng thử lại";
                announce.style.color = "red";
            }
        }
    }).catch(error =>{
        console.log(error);
    })
}