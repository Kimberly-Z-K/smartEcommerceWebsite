import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";
import { getFirestore, collection, addDoc,query, where,getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

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
const storage = getStorage(app);




const imageInput = document.getElementById('imageInput');
const productPreview = document.getElementById('preview');
const addProductButton = document.getElementById('addProduct');

imageInput.addEventListener('change', () => {
    productPreview.innerHTML = '';
    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = 'Product Preview';
            img.style.maxWidth = '300px';
            img.style.border = '1px solid #ccc';
            productPreview.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
});

addProductButton.addEventListener("click",function(e){
    e.preventDefault(e)
    addImages()

});


const addImages = async () => {
    const imgElement = productPreview.querySelector('img');
    const category = document.getElementById('cat').value.trim();
    const productname = document.getElementById('productname').value.trim();
    const description = document.getElementById('descript').value.trim();
    const quantity = document.getElementById('count').value.trim();
    const price=document.getElementById('price').value.trim();

    if (!category || !productname || !description || !quantity || !price) {
        alert("All fields are required!");
        return;
    }

    if (!imgElement) {
        alert("Please select an image to upload.");
        return;
    }

    try {
        const srcURL = imgElement.src; 
        
        await addDoc(collection(db, "products"), {
            name: productname,
            category: category,
            description: description,
            quantity: parseInt(quantity, 10), 
            imageUrl: srcURL,
            price: parseFloat(price),
        });

        alert("Product added successfully!");
        resetForm();
    } catch (error) {
        console.error("Error saving product details:", error);
        alert("Failed to save product details.");
    }
};


const resetForm = () => {
    document.getElementById('cat').value = '';
    document.getElementById('productname').value = '';
    document.getElementById('descript').value = '';
    document.getElementById('count').value = '';
    document.getElementById('price').value='';
    productPreview.innerHTML = '';
    addProductButton.disabled = false;
};

let remvButton=document.getElementById('removeProduct');

remvButton.addEventListener('click',(e)=>{
    e.preventDefault();
   removeFile();
})

const removeFile = async () => {
    let rmvName = document.getElementById('prodname').value.trim();

    try {
        
        const productDocsRef = collection(db, "products");
        const q = query(productDocsRef, where("name", "==", rmvName));

        
        const productSnapshot = await getDocs(q);

        if (productSnapshot.empty) {
            alert(`No product found with the name "${rmvName}".`);
            return;
        }

      
       const promises= productSnapshot.docs.map((docSnapshot) =>
            deleteDoc(docSnapshot.ref)
        );

        
        await Promise.all(promises);

        alert(`Product "${rmvName}" has been successfully deleted.`);
    } catch (error) {
        console.error('Error deleting your data from the database:', error);
        alert('Error deleting your data from the database.');
    }
};

const ordersForm=async()=>{
    
}

//buttons

let remove=document.getElementById('remove');
let order=document.getElementById('order');
let add=document.getElementById('add');
let removeVisible=document.getElementById('removeProd');
let removeVisiblerem=document.getElementById('red');
let rmveVisbleorder=document.getElementById('orderRemov');
//divs they show

const addProds=document.getElementById('newproducts');
const removeProds=document.getElementById('removal');
const  orderstab=document.getElementById('orders');

function RemoveVisible(div,button,btn,but){
    if(div.style.display==="block"){
        div.style.display="none";
        button.style.display="block";
        btn.style.display="block";
        but.style.display="block";
    }
}

removeVisible.addEventListener('click',function(e){
e.preventDefault();
  RemoveVisible(addProds,remove,order,add);

})
removeVisiblerem.addEventListener('click',function(e){
    e.preventDefault();
    RemoveVisible(removeProds,remove,order,add,);
})

rmveVisbleorder.addEventListener('click',function(e){
    e.preventDefault();
    RemoveVisible(orderstab,remove,order,add);
})


add.addEventListener('click', function() {
    visible(addProds,remove,order,add);
});


remove.addEventListener('click',function(){
    visible(removeProds,add,order,remove);
});

order.addEventListener('click',function(){
    visible(orderstab,remove,add,order);
});

function visible(div,button,btn,but){
    if(div.style.display==="none"||div.style.display===""){

        div.style.display="block";
        div.style.flexDirection="row";
        div.style.marginTop="0%";
        button.style.display="none";
        btn.style.display="none";
        but.style.display="none";

    }
} 


