import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where,addDoc, doc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

import { signInWithEmailAndPassword,createUserWithEmailAndPassword, } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

import {  setPersistence, browserLocalPersistence,   } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDfksP9wLa7sznEWDXSRwhHsgcHNeRAxg8",
    authDomain: "donutweb-2bf64.firebaseapp.com",
    projectId: "donutweb-2bf64",
    storageBucket: "donutweb-2bf64.appspot.com",
    messagingSenderId: "709582753728",
    appId: "1:709582753728:web:4a1f1bb40a28bd03f7c225"
};




const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log("Authentication persistence set to LOCAL.");
    })
    .catch((error) => {
        console.error("Error setting persistence:", error.message);
    });


    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log("User is logged in:", user.email);
        
            const adminQuery = query(collection(db, "users"), where("email", "==", user.email));
            const adminDocs = await getDocs(adminQuery);
            const customerQuery=query(collection(db,'customers'),where("email","==",user.email));
            const customerDocs = await getDocs(customerQuery);

        
    
            if (!adminDocs.empty) {
                console.log("Admin found");
                
            } else if (!customerDocs.empty) {
                console.log("Customer found");
            
            } else {
                console.log("User not found in either collection");
                
            }
    
        }
    
            
    }); 

    let newP=null;
    let mail="";
    let cate="";
    let n='';
    let quantityS=null;

    const fetchCart = async (userEmail) => {
        mail = userEmail; 
        const div = document.getElementById('Cartitems');
        const totalDisplay = document.getElementById('TotalPrice'); 
        let totalPrice = 0; 
    
        const updateTotalPrice = () => {
            totalDisplay.innerText = `Total Price: R${totalPrice.toFixed(2)}`;
        };
    
        try {
            const cartSnapshot = await getDocs(collection(db, 'Cart'));
            cartSnapshot.docs.forEach((doc) => {
                const data = doc.data();
                const { quantity, price, imageUrl, name, category } = data;
                cate=category;
                n=name;
                if (imageUrl) {
                    const CartDiv = document.createElement('div');
                    CartDiv.classList.add('cart-item');
    
                    const img = document.createElement('img');
                    img.src = imageUrl;
                    img.style.width = '300px';
                    img.style.maxWidth = '60%';
                    img.style.maxHeight = '50%';
    
                    const h = document.createElement('h1');
                    h.innerText = name;
                    h.style.fontSize = '20px';
    
                    const sech = document.createElement('span');
                    sech.innerText = category;
    
                    const priceDisplay = document.createElement('span');
                    priceDisplay.innerText = `R${price}`;
                    priceDisplay.style.fontSize = '20px';
    
                    const quantityDisplay = document.createElement('span');
                    quantityDisplay.innerText = `Quantity: ${quantity}`;
                    quantityDisplay.style.margin = '10px';
                    quantityDisplay.style.fontSize = '16px';
    
                    const plus = document.createElement('button');
                    plus.style.width = "50px";
                    plus.innerText = '+';
                    plus.style.fontSize = '20px';
    
                    const minus = document.createElement('button');
                    minus.style.width = "50px";
                    minus.innerText = '-';
                    minus.style.fontSize = '20px';
    
                    let count = 1;
                    let remainingStock = quantity;
    
                    totalPrice += price;
                    updateTotalPrice();
    
                    const updateUI = (newQuantity, newPrice) => {
                        priceDisplay.innerText = `R${newPrice}`;
                        quantityDisplay.innerText = `Quantity: ${newQuantity}`;
                        let quantitySold = quantity - newQuantity;
                        newP=newPrice;
                        quantityS=quantitySold;
                     
                    };
    
                    plus.addEventListener('click', (e) => {
                        e.preventDefault();
    
                        if (remainingStock > 0) {
                            count++;
                            remainingStock--;
                            const newPrice = price * count;
    
                            totalPrice += price; 
                            updateTotalPrice();
                            updateUI(remainingStock, newPrice);
                        } else {
                            alert('No more items left in stock.');
                        }
                    });
    
                    minus.addEventListener('click', (e) => {
                        e.preventDefault();
    
                        if (count > 1) {
                            count--;
                            remainingStock++;
                            const newPrice = price * count;
    
                            totalPrice -= price; 
                            updateTotalPrice();
                            updateUI(remainingStock, newPrice);
                        } else {
                            alert('Cannot decrease below 1.');
                        }
                    });
    
                    CartDiv.appendChild(img);
                    CartDiv.appendChild(h);
                    CartDiv.appendChild(sech);
                    CartDiv.appendChild(priceDisplay);
                    CartDiv.appendChild(quantityDisplay);
                    CartDiv.appendChild(plus);
                    CartDiv.appendChild(minus);
    
                    CartDiv.style.color = 'pink';
                    CartDiv.style.textShadow = '3px 1px 3px rgb(245, 14, 133)';
                    CartDiv.style.padding = '10px';
                    CartDiv.style.display = 'flex';
                    CartDiv.style.flexDirection = 'column';
                    CartDiv.style.alignItems = 'center';
    
                    div.appendChild(CartDiv);
                }

            });
    
            console.log('Successfully fetched cart items');
        } catch (error) {
            alert(`Error fetching your cart: ${error.message}`);
        }
    };



    const buybutton = document.getElementById('buying');
    buybutton.addEventListener('click', function (e) {
        e.preventDefault();
        console.log("Buy button clicked with values:", { newP, mail, n, cate, quantityS });
    
        if (!newP || !mail || !n || !cate || !quantityS) {
            alert("Cannot place order: Missing data.");
            console.error("Undefined values in buybutton click handler:", {
                newP,
                mail,
                n,
                cate,
                quantityS,
            });
            return;
        }
    
        HandleBuy(newP, mail, n, cate, quantityS);
    });
    
   
         

    const HandleBuy = async (price, customer, foodname, cat, quantity) => {
        console.log("HandleBuy called with values:", { price, customer, foodname, cat, quantity });
    
        if (!price || !customer || !foodname || !cat || !quantity) {
            alert("Error: Missing required fields for placing an order.");
            console.error("Undefined values in HandleBuy arguments:", {
                price,
                customer,
                foodname,
                cat,
                quantity,
            });
            return; 
        }
    
        try {
            await addDoc(collection(db, 'orders'), {
                cusEmail: customer,
                name: foodname,
                category: cat,
                quantity: quantity,
                price: price,
            });
            alert('Product added to orders successfully.');
        } catch (error) {
            alert("Error while adding to the orders:", error.message);
            console.error(error);
        }
    };
    


window.onload = () => {
     
    const stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
    const elements = stripe.elements();
    const cardElement = elements.create('card');
    cardElement.mount('#card-element'); 

    const handlePay = async () => {
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.error(error);
            alert(error.message);
        } else {
            console.log('Payment method created:', paymentMethod);
            alert('Payment method created successfully!');
        }
    };
};

// Initialize cart data
fetchCart();

