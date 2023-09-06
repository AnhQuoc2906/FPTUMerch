//MAIN PRODUCT SHOW, LINE 442
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
        data1+=`<div class="col-sm-6 col-xl-4"> 
        <div class="sin-product style-two">
            <div class="pro-img">
                <img src="media/images/product/${values.productLink}.jpg" alt="">
            </div>
            <div class="mid-wrapper">
                <h5 class="pro-title">
                    <a href="product.html">${values.productName}</a>
                </h5>
                <p>Số lượng: ${values.currentQuantity} / <span>${values.price}đ</span></p>
            </div>
            <div class="icon-wrapper">
                <div class="pro-icon">
                    <ul>
                        <li><a href="#" class="trigger"><i
                                    class="flaticon-eye"></i></a></li>
                    </ul>
                </div>
                <div class="add-to-cart">
                    <a href="#">add to cart</a>
                </div>
            </div>
        </div>
    </div>`;
    });
    document.getElementById("product").innerHTML = data1;
}).catch(error => {
    console.log(error);
});

//SEARCH FOR PRODUCT, LINE 358-361 AND 442
function getProductByName(){
    let name = document.getElementById("productName").value;
    fetch("https://localhost:44385/api/Product/"+ name, {
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
            data1+=`<div class="col-sm-6 col-xl-4"> 
            <div class="sin-product style-two">
                <div class="pro-img">
                    <img src="media/images/product/${values.productLink}.jpg" alt="">
                </div>
                <div class="mid-wrapper">
                    <h5 class="pro-title">
                        <a href="product.html">${values.productName}</a>
                    </h5>
                    <p>Số lượng: ${values.currentQuantity} / <span>${values.price}đ</span></p>
                </div>
                <div class="icon-wrapper">
                    <div class="pro-icon">
                        <ul>
                            <li><a href="#" class="trigger"><i
                                        class="flaticon-eye"></i></a></li>
                        </ul>
                    </div>
                    <div class="add-to-cart">
                        <a href="#">add to cart</a>
                    </div>
                </div>
            </div>
        </div>`;
        });
        document.getElementById("product").innerHTML = data1;
    }).catch(error => {
        console.log(error);
    });
}