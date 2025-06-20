import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword,createUserWithEmailAndPassword, } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where,getDocs, doc  } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import {  setPersistence, browserLocalPersistence, onAuthStateChanged,  } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDfksP9wLa7sznEWDXSRwhHsgcHNeRAxg8",
    authDomain: "donutweb-2bf64.firebaseapp.com",
    projectId: "donutweb-2bf64",
    storageBucket: "donutweb-2bf64.firebasestorage.app",
    messagingSenderId: "709582753728",
    appId: "1:709582753728:web:4a1f1bb40a28bd03f7c225"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);





let loginBtn=document.getElementById('logbtn');


let mail="";
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log("Authentication persistence set to LOCAL.");
    })
    .catch((error) => {
        console.error("Error setting persistence:", error.message);
    });

    
    onAuthStateChanged(auth, async (user) => {
       let name=document.getElementById('user');
        if (user) {
           
            mail=user.email;

            if(mail){
               let cusDocs=collection(db,'customers');
               let q=query(cusDocs,where('Email','==',mail));
               let docs=await getDocs(q);
               if(docs){
                let info=''
                docs.forEach(doc=>{
                    info=doc.data();
                    let nam =info.Username;
                    name.innerHTML=nam;
                })
                
                  
               }
               else{
                let userDocs=collection(db,'users');
                let que=query(userDocs,where('email','==',mail));
                let Docs=await getDocs(que);
               if(Docs){
                    let inf='';
                    Docs.forEach(doc=>{
                      inf=doc.data();
                      let Name =inf.username;
                      name.innerHTML=Name;
                    })

                  
                 }
               }

            }
            orders(mail);
            
            console.log("User is logged in:", user.email);
        }
        else{
            alert.alert('please login for a smooth shopping experience :)');
        }
    
            
    });  


    //get users order
    const orders=async()=>{
        let stats=('');
        let pending=document.getElementById('pending');

        console.log('in oders function email is',mail);

        try{
          let  ordersdocs= collection(db,'Orders');
          let q=query(ordersdocs,where('email','==',mail));
          let ord= await getDocs(q);
         if(ord){
            ord.forEach(doc => {
                let infor=doc.data();

                let category;
                let name;
                let price;
                let quantityBought;
    
                infor.items.forEach(item=>{
                   
                let cat=document.createElement('h3');
                let na=document.createElement('h3');
                let q=document.createElement('h3');
                let span=document.createElement('span');

            //fetching the data from the database
                  category=item.category;
                  name=item.name;
                  price=item.price;
                  quantityBought=item.quantityBought;
                
                //displaying the data
                
                 cat.innerText=category;
                 na.innerText=name;
                 q.innerText=quantityBought;
                 span.innerText=price;
                 
 
                 let line=document.createElement('div');
                 line.style.width='100%';
                 line.style.borderBottom='dashed';
                 
                pending.append( cat, na, q,span,line); 

                })
                
          let totalp=infor.totalPrice;
          let h1=document.createElement('h2');
          h1.innerText=totalp;
          

           let city=infor.location.city;
           let cit=document.createElement('h2');
           cit.innerText=city;

           let country=infor.location.country;
           let cou=document.createElement('h2');
           cou.innerText=country;

           let street=infor.location.street;
           let stree=document.createElement('h2');
           stree.innerText=street;

       pending.append(h1,cit,cou,stree);
            });

            

          //  pending.innerText=ord;
         }
         else{
            let h2=document.createElement('h2');
            h2.innerHTML='ypu have no pending orders';
            pending.appendChild(h2);
         }
          
        }
        catch(error){
            console.error("Error getting user orders:", error.message); 
        }
    }
    


if (loginBtn) {
    console.log('we are in the login form');
    loginBtn.addEventListener("click",function(e){
        e.preventDefault();
      login();
    
    });
}


 



const login = async () => {
    const email = document.getElementById("emaillog").value.trim();
    const password = document.getElementById("passlog").value.trim();

    console.log("Info was submitted");

    try {
       
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User signed in:", user.email);
        const adminCollectionRef = collection(db,"users");
        const q = query(adminCollectionRef, where("email", "==",email));
            
    
            
            const adminDocs = await getDocs(q);
              
            if (!adminDocs.empty) {
                console.log("Admin detected, redirecting to Admin page.");
                window.location.href = "Admin.Html";
            } else {
                alert("loading to home page...");
                window.location.href = "shop.Html";
            }

    } catch (error) {
        console.error("Error signing in or fetching admin data:", error.message);
        alert("Authentication failed! Please check your credentials.");
    }

   
    
 
};
//wanted to check type of user logged in
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


let signUp =document.getElementById('signinbtn');

if (signUp) {
    console.log('we are in the sign-up form');
    signUp.addEventListener("click",function(e){
        e.preventDefault();
        SignUp();
   })
   
    
}


const SignUp = async () => {
    try {
        const userName = document.getElementById("user").value.trim();
        const firstName = document.getElementById("name").value.trim();
        const lastName = document.getElementById("surname").value.trim();
        const email = document.getElementById("email").value.trim();
        const location = document.getElementById("loc").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!userName || !firstName || !lastName || !email || !location || !password) {
            alert("Please fill out all fields before signing up.");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await addDoc(collection(db,'customers'), {
            Username: userName,
            Name: firstName,
            Surname: lastName,
            Email: email,
            Location: location,
            UID: user.uid
        });

        alert("You've been successfully signed up!");
    } catch (error) {
       console.log('error while signing up',error);
    }
};