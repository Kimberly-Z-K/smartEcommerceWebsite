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

console.log('we are in the accounts');


setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log("Authentication persistence set to LOCAL.");
    })
    .catch((error) => {
        console.error("Error setting persistence:", error.message);
    });


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