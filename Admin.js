import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";
import { getFirestore, collection, addDoc,query, where,getDocs, deleteDoc,getDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

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

//showing the admin orders that are pending
let ordersContainer=document.getElementById('orders');


 const ordersForm=async()=>{
 
     
   
   try{



        const ordersDocs=await getDocs(collection(db,'Orders'));   
   
    

        ordersDocs.forEach(doc=>{

            let select = document.createElement('select');
            let option1 = document.createElement('option');
            option1.value = 'Pending';
            option1.innerText = 'Pending';
            let option2 = document.createElement('option');
            option2.value = 'Shipped';
            option2.innerText = 'Shipped';
            let option3 = document.createElement('option');
            option3.value = 'Delivered';
            option3.innerText = 'Delivered';

            select.append(option1, option2, option3);

           // let orderDiv=document.getElementById('orderitem');
           let orderDiv = document.createElement('div');
              orderDiv.style.backgroundColor='white';
           orderDiv.style.marginTop='10%';
           orderDiv.style.marginBottom='5%';
           orderDiv.style.marginRight='5%';
           orderDiv.style.width='25%';
           orderDiv.style.alignItems='center';
            orderDiv.style.borderStyle='solid';
           orderDiv.style.borderColor='white';
           orderDiv.style.borderWidth='2px';
           orderDiv.style.padding = '10px';

           let headin=document.createElement('h2');
           headin.innerText='Zees Donuts';
           headin.style.marginLeft='25%';
           orderDiv.appendChild(headin);
            const ord=doc.data();

          /*  let email=JSON.stringify(ord.email,null,2);
            let items=JSON.stringify(ord.items,null,2);
            let loc=JSON.stringify(ord.location,null,2);

            console.log(email,items,loc);*/
            let email=ord.email;
            console.log(email);
           



            let category;
            let name;
            let price;
            let quantityBought;

      
            ord.items.forEach(item =>{

                
            
               
    

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
                 
                   

                 orderDiv.append( cat, na, q,span,line); 

           }); 
          
          let totalp=ord.totalPrice;
          let h1=document.createElement('h2');
          h1.innerText=totalp;
          

           let city=ord.location.city;
           let cit=document.createElement('h2');
           cit.innerText=city;

           let country=ord.location.country;
           let cou=document.createElement('h2');
           cou.innerText=country;

           let street=ord.location.street;
           let stree=document.createElement('h2');
           stree.innerText=street;
          // let orderD=ord.orderDate;
           //console.log(country,street,orderD);
           orderDiv.append(h1 ,cit,cou,stree,select);
          
          
           ordersContainer.appendChild(orderDiv);
           ordersContainer.style.display='flex';
           ordersContainer.style.flexDirection='row';
           ordersContainer.style.backgroundColor='rgb(72, 143, 119)';
        })

        

   }
   catch(error){
        console.log('error while fetching orders',error);
    }
    
 }
 ordersForm();

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
//For button styling purposes
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


