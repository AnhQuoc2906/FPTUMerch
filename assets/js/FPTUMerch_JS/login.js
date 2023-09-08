let Email = document.getElementById('email');
let Password = document.getElementById('password');

function login(){
    let emailCheck = Email.value;
    let passwordCheck = Password.value;
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
        console.log(data.status);
    }).catch(error =>{
        console.log(error);
    })
}