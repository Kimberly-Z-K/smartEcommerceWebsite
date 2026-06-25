import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    setPersistence, 
    browserLocalPersistence, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs,
    doc ,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Firebase config
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

// Set persistent login
setPersistence(auth, browserLocalPersistence)
    .then(() => console.log("Authentication persistence set to LOCAL"))
    .catch(err => console.error("Persistence error:", err));

// ---------------- SIGN UP ----------------
let signUpBtn = document.getElementById('signinbtn');
if (signUpBtn) {
    signUpBtn.addEventListener("click", e => {
        e.preventDefault();
        signUp();
    });
}

const signUp = async () => {
    const userName = document.getElementById("user").value.trim();
    const firstName = document.getElementById("name").value.trim();
    const lastName = document.getElementById("surname").value.trim();
    const email = document.getElementById("email").value.trim();
    const location = document.getElementById("loc").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role")?.value ; // default to customer

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

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await addDoc(collection(db, 'customers'), {
            Username: userName,
            Name: firstName,
            Surname: lastName,
            Email: email,
            Location: location,
            Role: role, 
            UID: user.uid
        });

        alert("You've been successfully signed up!");
        //  redirect after signup
        window.location.href = "Login.html";

    } catch (error) {
        console.error('Error during sign-up:', error);
        if (error.code === "auth/email-already-in-use") {
            alert("This email is already in use. Try logging in.");
        } else {
            alert("Sign-up failed. Please try again.");
        }
    }
};

// ---------------- LOGIN ----------------
let loginBtn = document.getElementById("logbtn");
if (loginBtn) {
    loginBtn.addEventListener("click", e => {
        e.preventDefault();
        login();
    });
}

const login = async () => {
    const email = document.getElementById("emaillog").value.trim();
    const password = document.getElementById("passlog").value.trim();
    const roleSelect = document.getElementById("role");
    const role = roleSelect?.value;

    if (!email || !password) {
        alert("Please enter email and password!");
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User signed in:", user.email);

        // Fetch user document to check role
        const userQuery = query(collection(db, "customers"), where("Email", "==", email));
        const userDocs = await getDocs(userQuery);

        if (!userDocs.empty) {
            const userData = userDocs.docs[0].data();

            if (userData.Role !== role) {
                alert(`Incorrect role selected. Your role is: ${userData.Role}`);
                return;
            }

            if (userData.Role === "admin") {
                window.location.href = "Admin.Html";
            } else {
                window.location.href = "shop.Html";
            }

        } else {
            alert("User not found in the customers database.");
        }

    } catch (err) {
        console.error("Login error:", err);
        alert("Authentication failed! Check your email, password, or role.");
    }
};

// PERSISTENT LOGIN 
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("User still logged in:", user.email);
        if(user.email){
              loadOrders( user.email);
        }
        else{
               const ordersDiv = document.getElementById("pending");


                box.style.background = "#FFF5EE";
               box.style.marginBottom = "20px";
               box.style.padding = "15px";
               box.style.borderRadius = "8px";
               box.style.width = "350px";

                box.innerHTML = `<h3>Please login to see your orders</h3>`;

        }
        
        // Fetch user document to check role
        const userQuery = query(collection(db, "customers"), where("Email", "==", user.email));
        const userDocs = await getDocs(userQuery);

        if (!userDocs.empty) {
            const userData = userDocs.docs[0].data();
            if (userData.Role === "admin") {
                window.location.href = "Admin.Html";
            } else {
                window.location.href = "shop.Html";
            }
        }
    }
});


//Each user's specific order is shown here
async function loadOrders(Email) {
    console.log("Are we in the Load orders function", Email);

    const ordersDiv = document.getElementById("pending");

    ordersDiv.style.justifyContent = "center";
    ordersDiv.style.display = "flex";
    ordersDiv.style.flexDirection = "row";
    ordersDiv.style.flexWrap = "wrap";
    ordersDiv.style.gap = "20px";

    ordersDiv.innerHTML = "";

    const docs = await getDocs(collection(db, "Orders"));

    if (docs.empty) {
        const box = document.createElement("div");

        box.style.background = "#FFF5EE";
        box.style.marginBottom = "20px";
        box.style.padding = "15px";
        box.style.borderRadius = "8px";
        box.style.width = "350px";

        box.innerHTML = `<h3>No orders currently</h3>`;
        ordersDiv.appendChild(box);
        return;
    }

    docs.forEach(docSnap => {
        const data = docSnap.data();

        if (data.email === Email) {

            const box = document.createElement("div");

            box.style.background = "#FFF5EE";
            box.style.marginBottom = "20px";
            box.style.padding = "15px";
            box.style.borderRadius = "8px";
            box.style.width = "350px";

            // STATUS
            const status = document.createElement("h3");
            status.style.color = "#4CBB17";
            status.innerText = data.status;
            box.appendChild(status);

            // EMAIL
            const title = document.createElement("h3");
            title.innerText = data.email;
            box.appendChild(title);

            // ITEMS
            if (data.items) {
                data.items.forEach(i => {
                    const p = document.createElement("p");
                    p.innerText = `${i.name} x${i.quantityBought} - R${i.price}`;
                    box.appendChild(p);
                });
            }

            // TOTAL
            const total = document.createElement("h4");
            total.style.color = "#FF007F";
            total.innerText = "Total: R" + data.totalPrice;
            box.appendChild(total);

            // BUTTON
            const btn = document.createElement("button");
            btn.innerText = "Order received";
            btn.style.background = "#E6E6FA";
            btn.style.padding = "8px";
            btn.style.borderRadius = "5px";

            // hover effects
            btn.addEventListener("mouseover", () => {
                btn.style.background = "#e1ffd3";
                btn.style.transform = "scale(1.05)";
            });

            btn.addEventListener("mouseout", () => {
                btn.style.background = "#E6E6FA";
                btn.style.transform = "scale(1)";
            });

            // DELETE ORDER
            btn.addEventListener("click", () => {
                DeleteOrder(docSnap.id);
            });

            box.appendChild(btn);
            ordersDiv.appendChild(box);
        }
    });
}

async function DeleteOrder(docu) {
    try {
        await deleteDoc(doc(db, "Orders", docu));
        console.log("Order deleted successfully");

    
        loadOrders(auth.currentUser.email);

    } catch (error) {
        console.error("Error deleting order:", error);
    }
}
