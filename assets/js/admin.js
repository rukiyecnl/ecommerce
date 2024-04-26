const form = qs(".form");
const productList = qs("#productList");
let products = [];

const BASE_url = "https://dummyjson.com";


async function getItems(endpoint){
    const request = await fetch(`${BASE_url}/${endpoint}`);
    const response = await request.json();
    const items = response.products;
    return items;
}




if (!localStorage.getItem("products")) {
    localStorage.setItem("products", JSON.stringify(products));
}


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




function checkStorage(){
    if (localStorage.getItem("products")) {
        products = JSON.parse(localStorage.getItem("products"));
    }
    return products;
}

function checkId(object){

    checkStorage();
    if (products.length == 0) {
        products.id = 1;
        object.id = products.id;
    }
    else {
        products[products.length-1].id += 1;
        object.id =  products[products.length-1].id;
    }
    return object;

}

function getFormInfos(){
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData);

        checkId(formObj);
        formObj.description = "something";
        formObj.images = ["https://cdn.dummyjson.com/product-images/4/1.jpg"];
        formObj.rating = 2;
        formObj.discountPercentage = 10;

        checkStorage();

        products.push(formObj);

        localStorage.setItem("products", JSON.stringify(products));
        showProducts();
        e.target.reset();
        
    })
}

function showProducts(){
    checkStorage();
    productList.innerHTML ="";
    for (const product of products) {
        productList.innerHTML += 
        
                                `<li class="urunDiv" id=${product.id}>
                                    <img src="${product.images[0]}" alt="anaResim">
                                    <div class="urunBilgi">

                                        <p class="baslik">${product.title}</p>
                                        <p class="urunAciklama">${product.description}</p>
                                        <p class="rating">Rating: ${product.rating}</p>
                                        <div class="fiyat">
                                            <del class="eskiFiyat">${(product.price*100/(100-product.discountPercentage)).toFixed()}$</del>
                                            <p class="yeniFiyat">${product.price}$</p>
                                        </div>
                                        

                                    </div>

                                    <button class="editBtn">Düzenle</button>
                                    <button class="deleteBtn">Sil</button>

                                </li>` ;
        
    }

    // `<li id=${product.id}>
    //     <span class="productTitle">${product.title}</span> - 
    //     <span class="productPrice">${product.price}</span>$ -
    //     <button class="editBtn">Düzenle</button>
    //     <button class="deleteBtn">Sil</button>
    // </li>`
    


    // `<div class="urunDiv" id = ${product.id}>
    //                                 <img src="${product.images[0]}" alt="anaResim">
    //                                 <div class="urunBilgi">
                                
    //                                     <p class="baslik">${product.title}</p>
    //                                     <p class="urunAciklama">${product.description}</p>
    //                                     <p class="rating">Rating: ${product.rating}</p>
    //                                     <div class="fiyat">
    //                                         <del class="eskiFiyat">${(product.price*100/(100-product.discountPercentage)).toFixed()}</del>
    //                                         <p class="yeniFiyat">${product.price}</p>
    //                                     </div>
                                        
                                
    //                                 </div>

    //                                 <button class="editBtn">Düzenle</button>
    //                                 <button class="deleteBtn">Sil</button>
                                
    //                             </div>` 


    bindEventsAll(".editBtn", "click", handleEditBtn);
    bindEventsAll(".deleteBtn", "click", handleDeleteBtn);
    // getFormInfos();

}

function handleDeleteBtn(){
    
    checkStorage();
    const deleteProductId = this.parentElement.id;
    const deleteProduct = products.find(product => product.id == deleteProductId);
    const productIndex = products.indexOf(deleteProduct);
    products.splice(productIndex, 1);
    localStorage.setItem("products", JSON.stringify(products));

    showProducts();

}

function handleEditBtn(){

    checkStorage();

    const editedProductId = this.parentElement.id;
 console.log(this.previousElementSibling.firstElementChild);
    const editTitle = this.previousElementSibling.firstElementChild;
    editTitle.innerHTML = `<input class="editInput" type="text" name="editTitle" placeholder="ürün adı">
                            <button class="changeBtn">Değiştir</button>`;
    const editInput = qs(".editInput");
    const changeBtn = qs(".changeBtn");
    
    changeBtn.addEventListener("click", function(e){
        e.preventDefault();
        products[editedProductId-1].title = editInput.value;
        editTitle.innerHTML = `${editInput.value}`;
        localStorage.setItem("products", JSON.stringify(products));
    })
}
let sayac = {sayac:1};

if(!localStorage.getItem("sayac")){
    localStorage.setItem("sayac", JSON.stringify(sayac));
}
async function init(){
    if (localStorage.getItem("sayac")) {
        sayac = JSON.parse(localStorage.getItem("sayac"));
    }
    if (sayac.sayac == 1) {
        products = await getItems("products?limit=10"); 
        localStorage.setItem("products", JSON.stringify(products));    
    }
    sayac.sayac = 0;

    localStorage.setItem("sayac", JSON.stringify(sayac));


    showProducts();
    getFormInfos();
    console.log(products);
}

init();