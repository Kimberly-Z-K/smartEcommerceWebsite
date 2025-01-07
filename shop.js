import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import {  setPersistence, browserLocalPersistence, onAuthStateChanged,  } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";


// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDfksP9wLa7sznEWDXSRwhHsgcHNeRAxg8",
    authDomain: "donutweb-2bf64.firebaseapp.com",
    projectId: "donutweb-2bf64",
    storageBucket: "donutweb-2bf64.appspot.com",
    messagingSenderId: "709582753728",
    appId: "1:709582753728:web:4a1f1bb40a28bd03f7c225"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);







    
const fetchStoreItems = async () => {
    let div = document.getElementById('products');
   
    try {
        const productDocs = await getDocs(collection(db, "products"));
        productDocs.forEach(doc => {
            const imageUrl = doc.data().imageUrl; 
            const name = doc.data().name;
            const category = doc.data().category;
            const description = doc.data().description;
            const price=doc.data().price;

            if (imageUrl) {
                let productDiv = document.createElement('div');
                productDiv.classList.add('product-item');
                
                let cartdiv=document.createElement('div');

               
                const addCart=document.createElement('button');
                addCart.style.marginLeft='30px';
                addCart.style.marginTop='20px';
                addCart.innerText='Add to cart';
                addCart.style.width='300px';
                addCart.style.height='50px';
                addCart.style.maxHeight='100%';
                addCart.style.maxWidth='100%';
                addCart.style.backgroundColor='pink';
                addCart.style.color='rgb(233, 30, 99)';
                addCart.style.textShadow='3px 1px 3px rgb(250, 250, 250)';

                addCart.addEventListener('click',function(e){
                    e.preventDefault(e);
                    moveTocart(doc);

                })

                let img = document.createElement('img');
                let p=document.createElement('span');
                let h = document.createElement('h1');
                
                let sech = document.createElement('span');
                let span = document.createElement('p');

                img.src = imageUrl;
                img.style.maxWidth = '60%';
                img.style.maxHeight='50%';

                h.innerText = name;
            //    h.style.height='30px';
                sech.innerText = category;
               // sech.style.height='20px';
                span.innerText = description;
                //span.style.height='40px';
                p.innerHTML= 'R'+ price;
                p.style.fontSize='20px';
               
                cartdiv.style.color='pink';
                cartdiv.style.textShadow='3px 1px 3px rgb(245, 14, 133)';
                
                cartdiv.appendChild(addCart);
               
                productDiv.appendChild(img);
                productDiv.appendChild(h);
                productDiv.appendChild(sech);
                productDiv.appendChild(p);
                productDiv.appendChild(span);

                productDiv.appendChild(cartdiv);
              
                div.appendChild(productDiv);

            
            }
            
           
        });

    } catch (error) {
        console.error('Error while fetching database information:', error);
        alert('Error while fetching database information');
    }
};


const moveTocart=async(doc)=>{
   
    try{
     await  addDoc(collection(db,'Cart'),{
        name: doc.data().name,
        category: doc.data().category,
        description: doc.data().description,
        quantity: doc.data().quantity-1, 
        imageUrl: doc.data().imageUrl,
        price:doc.data().price,
     })
     alert('product added to cart');
    }
    catch(error){
        alert(error, 'while adding to the cart');
    }

}


fetchStoreItems();


