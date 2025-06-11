import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where,addDoc, doc, deleteDoc} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
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

    let mail="";
    onAuthStateChanged(auth, async (user) => {
       
        if (user) {
            console.log("User is logged in:", user.email);
             mail=user.email;
         
        
        }
    
            
    }); 

    let cartItems = [];
    let removedItems=[];
    let loc={};
   let newP=0;
   let div = document.getElementById('Cartitems'); 
   let CartDiv = document.createElement('div');
   const fetchCart = async () => {
        
   
    const totalDisplay = document.getElementById('TotalPrice'); 
    let totalPrice = 0; 
       
   
    
    const updateTotalPrice = () => {
        totalDisplay.innerText = `Total Price: R${totalPrice.toFixed(2)}`;
    };

    try {
        const cartSnapshot = await getDocs(collection(db, 'Cart'));
       
        cartSnapshot.docs.forEach((doc) => {
            const removal=document.createElement('button');
            removal.innerText='remove';
            removal.style.fontSize='10px';
            removal.style.width = "50px";

         

            const data = doc.data();
            
            const { quantity, price, imageUrl, name, category } = data;

           
            cartItems.push({ category, name, price, quantityBought: 1 });
           
            if (imageUrl) {

               
                CartDiv.classList.add('cart-item');

//button from removing things from the cart
                removal.addEventListener('click', async (e) => {
                    e.preventDefault();
                    try {
                        await documentremoval(name);
                        cartItems = cartItems.filter(item => item.name !== name);
                          
                        console.log(`Item '${name}' removed successfully.`);
                        CartDiv.remove(); 
                    
                    } catch (error) {
                        console.error('Error removing document:', error);
                    }
                
                });

                const updateQuantity = (itemName, newQuantity) => {
                    const cartItem = cartItems.find(item => item.name === itemName);
                    if (cartItem) {
                        cartItem.quantityBought = newQuantity;
                        console.log(`Updated quantity for ${itemName}:`, newQuantity);
                    }}

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
                quantityDisplay.innerText = `in stock: ${quantity}`;
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
                console.log('this is how much there is',quantity);

                const updateUI = (newQuantity, newPrice) => {
                    priceDisplay.innerText = `R${newPrice}`;
                    quantityDisplay.innerText = `in stock: ${newQuantity}`;
                   
                   
                 
                };
              
                
                plus.addEventListener('click', (e) => {
                    e.preventDefault();
                   

                    if (remainingStock > 0) {
                        count++;
                        remainingStock--;
                        updateQuantity(name, count);
                     
                        const newPrice = price * count;

                        totalPrice += price;
                        newP=totalPrice;
                       
                        
            
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
                        updateQuantity(name, count);
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
                CartDiv.appendChild(removal);

                CartDiv.style.color = 'pink';
                CartDiv.style.textShadow = '3px 1px 3px rgb(245, 14, 133)';
                CartDiv.style.backgroundColor='#B0C4DE';
                CartDiv.style.width='50%';
                CartDiv.style.marginLeft='25%';
                CartDiv.style.marginBottom="2%";
                CartDiv.style.borderStyle='solid';
                CartDiv.style.borderColor='white';

                CartDiv.style.borderWidth='2px';
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





  
    //function for adding items to the order page
    const placeOrder = async () => {
        try {
            if (!cartItems) {
                alert('Cannot place order: Missing data');
               // console.error("Missing data:", {cartItems, newP});
                return;
            }
            if(!mail){
            alert('please ensure you re logged in');
            return;
            }
            if (!loc || Object.keys(loc).length === 0) {
                alert('Please provide a delivery location.');
                CartDiv.innerHTML = '';
                showlocationForm();
                return;
            }
            
           
          
          
    
        } catch (error) {
            alert(`Failed to place order: ${error.message}`);
            console.error('Error placing order:', error);
        }
    };

    const showlocationForm = async () => {
        const locationForm = document.getElementById('locationform');
        locationForm.style.display = 'block';
    
        const submitButton = document.getElementById('sub');
    
        const validateForm = (street, city, country) => {
            if (!street || !city || !country) {
                alert('Please fill in all location fields.');
                return false;
            }
            if (country !== 'south africa') {
                alert('We only deliver to South Africa. Sorry!');
                return false;
            }
            return true;
        };
    
        const handleSubmit = async (e) => {
            e.preventDefault();
    
            const street = document.getElementById('street').value.trim().toLowerCase();
            const city = document.getElementById('city').value.trim().toLowerCase();
            const country = document.getElementById('country').value.trim().toLowerCase();
    
            if (!validateForm(street, city, country)) return;
    
            const loc = { street, city, country };
            const orderData = {
                email: mail,
                items: cartItems,
                totalPrice: newP,
                location: loc,
                orderDate: new Date().toISOString(),
            };
    
            try {
             //   locationForm.style.pointerEvents = 'none'; 
              //  locationForm.style.opacity = '0.6'; 
                submitButton.disabled = true;
    
                await addDoc(collection(db, 'Orders'), orderData);
    
                const cartSnapshot = await getDocs(collection(db, 'Cart'));
                const deletePromises = cartSnapshot.docs.map((doc) => deleteDoc(doc.ref));
                await Promise.all(deletePromises);
    
                console.log("All cart documents deleted successfully.");
                alert('Order placed successfully!');
               

            } catch (error) {
                alert(`Failed to place order: ${error.message}`);
                console.error('Error placing order:', error);
            } finally {
                locationForm.style.pointerEvents = 'auto';
                locationForm.style.opacity = '1'; 
                submitButton.disabled = false;
            }
        };
    
        submitButton.removeEventListener('click', handleSubmit); 
        submitButton.addEventListener('click', handleSubmit);
    };
    
     //buy button responsible for bringing location form
    const setupBuyButton = () => {
        const buybutton = document.getElementById('buying');
    
        buybutton.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log("Buy button clicked with values:", { mail, newP,cartItems});
    
         
            await placeOrder();

        });
    };

     const documentremoval = async (dom) => {
        try {
            const cartSnapshot = await getDocs(collection(db, "Cart"));
        
            cartSnapshot.docs.forEach(async (doc) => {
              if (doc.data().name === dom) {
                
                await deleteDoc(doc.ref);
                console.log(`Document with name '${dom}' has been deleted successfully.`);
              }
            });
          } catch (error) {
            console.error("Error deleting document:", error);
          }
  };
    
    fetchCart() ;
    window.onload = () => {
        setupBuyButton();
    };