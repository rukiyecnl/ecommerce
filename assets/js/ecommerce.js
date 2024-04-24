let products = [];
let cart = [];
let total = 0 ;
let urunId = {urunid:0};
const allProducts = qs(".allProducts");
const totalPrice = qs(".totalPrice");
const addedProduct = qs(".addedProduct");

function qs(selector){
    const element = document.querySelector(selector);
    return element;
}

function bindEventsAll(selector, eventType, cbFunction){
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
        element.addEventListener(eventType, cbFunction);
    }

}

if (!localStorage.getItem("cart")) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

if (!localStorage.getItem("urunId")) {
    localStorage.setItem("urunId", JSON.stringify(urunId));
}

function checkProductStorage(){
    if (localStorage.getItem("products")) {
        products = JSON.parse(localStorage.getItem("products"));
    }
    return products;
}

function checkCartStorage(){
    if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
    }
    return cart;
}

// function checkStorage(arrayName, storageName){
//     if (localStorage.getItem(storageName)) {
//         arrayName = JSON.parse(localStorage.getItem(storageName));
//     }
//     return arrayName;
// }

function showAllProducts(){

    checkProductStorage();
    for (const product of products) {
        allProducts.innerHTML += `
        <a href="product.html" class="urunDiv" data-urunid = "${product.id}">
            <img src="${product.images[0]}" alt="anaResim">
            <div class="urunBilgi">

                <p class="baslik">${product.title}</p>
                <p class="urunAciklama">${product.description}</p>
                <p class="rating">Rating: ${product.rating}</p>
                <div class="fiyat">
                    <del class="eskiFiyat">${(product.price*100/(100-product.discountPercentage)).toFixed()}</del>
                    <p class="yeniFiyat">${product.price}</p>
                </div>
                

            </div>
        
        </a>`;
        
        
        
        
        // `<li id="${product.id}">
        //                             <span>${product.title}</span> - 
        //                             <span>${product.price}$</span> -
        //                             <button class = "addToCart">SEPETE EKLE</button> 
        //                         </li>`;
    }

    bindEventsAll(".addToCart", "click", handleAddToCartBtn);
    bindEventsAll(".urunDiv", "click", getProductPage);
}

function getProductPage(){
    const clickedProductId = Number(this.dataset.urunid) ;
    urunId = {
       urunid: clickedProductId
    } 
    localStorage.setItem("urunId", JSON.stringify(urunId));
}

function handleAddToCartBtn(){
    // checkProductStorage();
    checkCartStorage();

    const findProduct = products.find(product => product.id == this.parentElement.id);
    const checkCart = cart.find(cart => cart.id == findProduct.id);
    if (checkCart) {
        checkCart.adet += 1;
    }
    else {
        findProduct.adet = 1;
        cart.push(findProduct);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    // showCart();
    // showCartAmount();
}

function showCart(){
    checkCartStorage();
    addedProduct.innerHTML = "";
    for (const cartProduct of cart) {
        addedProduct.innerHTML += `<li id="${cartProduct.id}">
                                    <span>${cartProduct.title}</span> - 
                                    <span>${cartProduct.price}$</span> -
                                    <span>x${cartProduct.adet}</span> -
                                    <button class = "deleteFromCart">SİL</button> 
                                </li>`;
    }

    bindEventsAll(".deleteFromCart", "click", handleDeleteFromCartBtn);

    // isProductExist();

}

function handleDeleteFromCartBtn(){

    checkProductStorage();

    const deletedProductId = this.parentElement.id;
    const findDeletedProduct = cart.find(cart => cart.id == deletedProductId);
    const deletedProduct = cart.indexOf(findDeletedProduct);

    cart.splice(deletedProduct, 1);
    localStorage.setItem("cart", JSON.stringify(cart));

    // showCart();
    // showCartAmount();
}

function showCartAmount(){
    checkCartStorage();
    total = 0;
    for (const cartProduct of cart) {
        total += (cartProduct.price * cartProduct.adet);
    }
    totalPrice.innerHTML = total;
}

// let check =[];
// let temp = 0;
// function isProductExist(){
//     checkProductStorage();

//     for (const cartProduct of cart) {
//         check.push(products.find(product => product.id == cartProduct.id)) ;
//     }
//     console.log(check);
//     for (const c of check) {
//         if (c == undefined) {
            
//         }
//     }
// }

function init(){
    showAllProducts();
    // showCart();
    // showCartAmount();
}

init();