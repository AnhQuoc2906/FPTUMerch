fetch("https://localhost:44385/api/Product", {
    method: "GET"
}).then(res => {
    return res.json();
}).then(data => {
    // Get single data
    // console.log(data[2].price);
    // document.getElementById('root').innerHTML = data[2].price

    // Get multiple data
    let data1="";
    data.map((values)=> {
        data1+=`
        <h6>${values.productId}</h6>
        <h6>${values.productName}</h6>
        <h6>${values.productDescription}</h6>
        <h6>${values.productLink}</h6>
        <h6>${values.price}</h6>
        <h6>${values.note}</h6>
        <h6>----------</h6>`;
    });
    document.getElementById("root").innerHTML = data1;
}).catch(error => {
    console.log(error);
});