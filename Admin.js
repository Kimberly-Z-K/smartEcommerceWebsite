import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, updateDoc,doc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDfksP9wLa7sznEWDXSRwhHsgcHNeRAxg8",
  authDomain: "donutweb-2bf64.firebaseapp.com",
  projectId: "donutweb-2bf64",
  storageBucket: "donutweb-2bf64.appspot.com",
  messagingSenderId: "709582753728",
  appId: "1:709582753728:web:4a1f1bb40a28bd03f7c225"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



const cupcakeVid = document.querySelector("video");

const sections = document.querySelectorAll(".section");

function hideVideo() {
  if (cupcakeVid) cupcakeVid.style.display = "none";
}

function showSection(id) {
  sections.forEach(sec => sec.style.display = "none");
  document.getElementById(id).style.display = "block";
  hideVideo();
}


document.getElementById("add").onclick = () => showSection("newproducts");

document.getElementById("remove").onclick = () => showSection("removal");

document.getElementById("order").onclick = () => {
  showSection("orders");
  loadOrders();
};

document.getElementById("analytics").onclick = () => {
  showSection("analyticsSection");
  loadAnalytics();
};


// IMAGE PREVIEW
const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');

imageInput.addEventListener('change', () => {
  preview.innerHTML = '';
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    const img = document.createElement('img');
    img.src = e.target.result;
    preview.appendChild(img);
  };
  reader.readAsDataURL(file);
});


// ADD PRODUCT
document.getElementById("addProduct").onclick = async (e) => {
  e.preventDefault();
  hideVideo();

  const category = cat.value.trim();
  const name = productname.value.trim();
  const description = descript.value.trim();
  const quantity = count.value.trim();
  const Price = price.value.trim();

  if (!category || !name || !description || !quantity || !Price) {
    alert("Fill all fields!");
    return;
  }

  const img = preview.querySelector("img");
  if (!img) return alert("Upload image!");

  try {
    await addDoc(collection(db, "products"), {
      name,
      category,
      description,
      quantity: parseInt(quantity),
      price: parseFloat(Price),
      imageUrl: img.src
    });

    alert("Product added!");
    clearAddForm();

  } catch (err) {
    console.error(err);
    alert("Failed to add product");
  }
};

function clearAddForm() {
  cat.value = "";
  productname.value = "";
  descript.value = "";
  count.value = "";
  price.value = "";
  preview.innerHTML = "";
}

document.getElementById("removeProd").onclick = clearAddForm;


// REMOVE PRODUCT
document.getElementById("removeProduct").onclick = async (e) => {
  e.preventDefault();
  hideVideo();

  const name = prodname.value.trim();
  if (!name) return alert("Enter product name");

  const q = query(collection(db, "products"), where("name", "==", name));
  const snap = await getDocs(q);

  if (snap.empty) return alert("Product not found");

  await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));

  alert("Deleted!");
  prodname.value = "";
};

document.getElementById("red").onclick = () => prodname.value = "";


// ORDERS

async function loadOrders() {
  const ordersDiv = document.getElementById("orders");
  hideVideo();

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

    const box = document.createElement("div");
    
    box.style.background = "#FFF5EE";
    box.style.marginBottom = "20px";
   // box.style.marginLeft = "25%";
    box.style.padding = "15px";
    box.style.borderRadius = "8px";
    box.style.width = "350px";

    
    box.innerHTML = `<h3>${data.email}</h3>`;

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
    total.style.color="#FF007F";
    total.innerText = "Total: R" + data.totalPrice;
    box.appendChild(total);

    // STATUS DROPDOWN
    const statusSelect = document.createElement("select");
   statusSelect.style.background="#E6E6FA";
    const pendingOption = document.createElement("option");
    pendingOption.value = "Pending";
    pendingOption.textContent = "Pending";

    const completeOption = document.createElement("option");
    completeOption.value = "Complete";
    completeOption.textContent = "Complete";

    statusSelect.appendChild(pendingOption);
    statusSelect.appendChild(completeOption);

    statusSelect.value = data.status || "Pending";

    statusSelect.style.marginTop = "10px";
    statusSelect.style.padding = "5px";
    statusSelect.style.borderRadius = "5px";

    
    

          statusSelect.addEventListener("change", async () => {
    try {
        const status = statusSelect.value;

        await updateDoc(
            doc(db, "Orders", docSnap.id),
            {
                status: status
            }
        );

        console.log("Order updated successfully");
        loadOrders();

    } catch (error) {
        console.error("Error updating order:", error);
    }
});
  

    box.appendChild(statusSelect);

    ordersDiv.appendChild(box);
  });
}


// ANALYTICS
async function loadAnalytics() {
  hideVideo();

  const res = await fetch("https://smartecommercewebsite.onrender.com/orders");
  const data = await res.json();

  showAnalytics(data);
}

function showAnalytics(data) {
  hideVideo();

  const items = Object.values(data).flatMap(client =>
    client.items.map(item => ({
      ...item,
      email: client.email
    }))
  );

  const topSelling = {};
  items.forEach(item => {
    if (!topSelling[item.name]) {
      topSelling[item.name] = { totalSold: 0, totalRevenue: 0 };
    }
    topSelling[item.name].totalSold += item.quantityBought;
    topSelling[item.name].totalRevenue += item.price * item.quantityBought;
  });

  const itemNames = Object.keys(topSelling);
  const quantities = itemNames.map(name => topSelling[name].totalSold);
  const revenues = itemNames.map(name => topSelling[name].totalRevenue);

  const clients = Object.values(data);
  const clientEmails = clients.map(c => c.email);
  const clientTotals = clients.map(c => c.totalPrice);

  drawTopSelling(itemNames, quantities, revenues);
  drawLoyalClients(clientEmails, clientTotals);
}


// CHARTS
function drawTopSelling(labels, quantities, revenues) {
  new Chart(document.getElementById("topSellingChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "Quantity Sold", data: quantities },
        { label: "Total Revenue (R)", data: revenues }
      ]
    }
  });
}

function drawLoyalClients(labels, totals) {
  new Chart(document.getElementById("loyalClientsChart"), {
    type: "pie",
    data: {
      labels,
      datasets: [{ data: totals }]
    }
  });
}