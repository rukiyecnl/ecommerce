const BASE_url = "https://dummyjson.com";

const dialog = qs(".alisverisOnay");
const urunAlani = qs(".urunAlani");
const urunSayisi = qs(".urunSayisi");

const urunSepetBilgi = qs(".urunSepetBilgi");

let clickedProductid;
let localAdet = [];
let adet = 0;
let urunId = {urunid:0};
let products = [];
let cart = [];

function qs(selector){
    const element = document.querySelector(selector);
    return element;
}
function qsAll(selector){
    const elements = document.querySelectorAll(selector);
    return elements;
}

if (!localStorage.getItem("urunId")) {
    localStorage.setItem("urunId", JSON.stringify(urunId));
}

if (!localStorage.getItem("products")) {
    localStorage.setItem("products", JSON.stringify(products));
}

if (!localStorage.getItem("cart")) {
    localStorage.setItem("cart", JSON.stringify(cart));
}


// function localStorageUrunidExists(){
//     if (localStorage.getItem("urunId")) {
//         urunId = JSON.parse(localStorage.getItem("urunId"));
//     }
//     else {
//         urunId = {urunid:0};
//     }
//     return urunId.urunid;
// }

function checkStorage(){
    if (localStorage.getItem("urunId")) {
        urunId = JSON.parse(localStorage.getItem("urunId"));
    }
    return urunId.urunid;
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


// function saveToLocalAdet(object){
//     let sepetLocal = localStorageAdetStok();
//     sepetLocal.push(object);
//     localStorage.setItem("adet", JSON.stringify(sepetLocal));
//     urunSayisi.style.display = "flex";
//     urunSayisi.innerHTML = sepetLocal.length;
// }

// async function getSpecificItem(endpoint){
//     const response = await fetch(`${BASE_url}/${endpoint}`);
//     const item = await response.json();
//     // const items = response.products;
//     return item;
// }

function bindEventsAll(selector, eventType, cbFunction){
    const elements = qsAll(selector);
    for (const element of elements) {
        element.addEventListener(eventType, cbFunction)
    }
}

async function showItem(){
    // let yeniId = localStorageUrunidExists();
    // console.log(typeof yeniId);

    checkStorage();
    checkProductStorage();

    const product =  products.find(product => product.id == urunId.urunid); 
    
        urunAlani.innerHTML = `
        <div class="fotografAlani" data-id="${urunId.urunid}">
            <img class="buyukResim" src="assets/img/buyukResim.png" alt="anaFoto">
            <ul class="urunFotolari">
                
            </ul>
        </div>
        <div class="urunBilgisiAlani">
            <p class="companyName">${product.brand}</p>
            <p class="type">${product.title}</p>
            <p class="desc">${product.description}
            </p>
            <div class="indirim-yuzde">
                <p class="indirimliFiyat">$<span>${product.price}</span></p>
                <p class="yuzde"><span>${product.discountPercentage}</span>%</p>
            </div>

            <del class="indirimsizFiyat">$<span>${(product.price*100/(100-product.discountPercentage)).toFixed()}</span></del>

            <div class="adet-ekleBtn">

                <div class="urunAdet">
                    <a href="#" class="urunAzalt">
                        <img src="assets/img/azalt.png" alt="">
                    </a>
                    <strong class="UrunAdet">${adet}</strong>
                    <a href="#" class="urunEkle">
                        <img src="assets/img/plus.png" alt="">
                    </a>
                </div>

                <button class="addToChartBtn" data-id="${urunId.urunid}"><img src="assets/img/sepetBeyaz.png" alt="sepet">Add to cart</button>
                <div class= "adetWarning" style = "display:none;">adet seçiniz</div>
            </div>

        </div>`;

        const urunFotolari = qs(".urunFotolari");
        const buyukResim = qs(".buyukResim");
        buyukResim.src = product.thumbnail;
        
        for (const image of product.images) {
            urunFotolari.innerHTML += `<img class="images" src="${image}" alt="foto1">`
        }

        bindEventsAll(".images", "click", chooseBigPhoto)
        adetArttir(product.stock);
        adetAzalt();
        bindEventsAll(".addToChartBtn", "click", handleAddToCartBtn);
        // handleDialog();
        sepetBar();
        sepetBarClose();

}
function chooseBigPhoto(){
    const buyukResim = qs(".buyukResim");
    buyukResim.src = this.src;
}

function adetAzalt(){
    const urunAzalt = qs(".urunAzalt");
    const UrunAdet = qs(".UrunAdet");
    urunAzalt.addEventListener("click", function(e){
        e.preventDefault();
        if (adet > 0) {
            adet--;
            UrunAdet.innerHTML = adet;
        }
    })
}

function adetArttir(stock){
    const urunEkle = qs(".urunEkle");
    const UrunAdet = qs(".UrunAdet");
    urunEkle.addEventListener("click", function(e){
        e.preventDefault();
        if (adet < stock) {
           adet++; 
        }
        UrunAdet.innerHTML = adet;
    })
}


function handleAddToCartBtn(){
    checkProductStorage();
    checkCartStorage();

    const findProduct = products.find(product => product.id == this.dataset.id);
    const checkCart = cart.find(cart => cart.id == findProduct.id);

    if (adet > 0) {
        if (checkCart) {
            checkCart.sepetAdet += adet;
        }
        else {
            findProduct.sepetAdet = adet;
            cart.push(findProduct);
        }
    }
    else {

    }


    localStorage.setItem("cart", JSON.stringify(cart));
    addedProducts();
    // showCart();
    // showCartAmount();
}






function handleDialog(){
    const alisverisOnayBtn = qs(".alisverisOnay button");
    alisverisOnayBtn.addEventListener("click", function(e){
        e.preventDefault();
        dialog.close();
    })
}

const sepet = qs(".sepet");
const sidenav = qs(".sidenav");
const container = qs(".container");

function sepetBar(){
    
    sepet.addEventListener("click", function(e){
        e.preventDefault();
        sidenav.style.width = "250px";
        container.style.marginRight = "300px";

        addedProducts();


    })
}

function addedProducts(){
    checkCartStorage();
    urunSepetBilgi.innerHTML = "";
    for (const cartProduct of cart) {
        urunSepetBilgi.innerHTML += `<li class="sepetListe" data-id="${urunId.urunid}">
                                        <p class="satici">Satıcı: <span>${cartProduct.brand}</span></p>
                                        <div class="sepetMain">
                                            <img src="${cartProduct.images[0]}" alt="urun" class="sepetFoto">
                                            <div class="sepetMainFooter">
                                                <p>${cartProduct.title}</p>
                                                <div> 
                                                    <div class="">
                                                        <p>adet</p>
                                                        <span>X${cartProduct.sepetAdet}</span>
                                                    </div>
                                                    <div>
                                                        <p>fiyat</p>
                                                        <span>${cartProduct.sepetAdet*cartProduct.price}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </li>`;
    }
}

function sepetBarClose(){
    const closebtn = qs(".closebtn");
    closebtn.addEventListener("click", function(e){
        e.preventDefault();
        sidenav.style.width = "0px";
        container.style.marginLeft = "0px";
    })
}

function sepetLocalSil(){
    for (let i = 0; i < localAdet.length; i++) {
        for (let j = 0; j < localAdet.length; j++) {
            if (localAdet[i].id == localAdet[j].id) {
                localAdet[j].adet += localAdet[i].adet;
                
                localAdet.slice(i,1);
                localAdet.push();
                localStorage.setItem("adet", JSON.stringify(localAdet));
                break;
            }
            
        }
    }
}


showItem();
// sepetBar();
// sepetBarClose();
