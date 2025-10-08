const itemsList = [
  {name:"Pen", price:10},
  {name:"Notebook", price:60},  // no sub-items
  {name:"Pencil", variants:[
      {name:"Small", price:5},
      {name:"Medium", price:8},
      {name:"Big", price:10}
  ]},
  {name:"Eraser", price:3},
  {name:"Marker", variants:[
      {name:"Red", price:18},
      {name:"Blue", price:20},
      {name:"Black", price:22}
  ]},
  {name:"paayi", variants:[
      {name:"Big", price:1000},
      {name:"18", price:800},
      {name:"Small", price:500}
  ]},
  {name:"Scale", price:15}
];
const itemSelect = document.getElementById('item');
const qtyInput = document.getElementById('quantity');
const tbody = document.querySelector('#invoiceTable tbody');
const grandEl = document.getElementById('grandTotal');
const customerInput = document.getElementById('customer');
const transportInput = document.getElementById('transport');
const variantWrapper = document.getElementById('variantWrapper');

let invoiceItems = [];

// Populate main items dropdown
function populateItemDropdown(){
  itemSelect.innerHTML = ''; // clear existing

  const placeholder = document.createElement('option');
  placeholder.value = "";
  placeholder.textContent = "Select Item";
  placeholder.disabled = true;
  placeholder.selected = true;
  itemSelect.appendChild(placeholder);

  itemsList.forEach(it=>{
    const opt = document.createElement('option');
    opt.value = it.name;
    opt.textContent = it.name;
    itemSelect.appendChild(opt);
  });
}
populateItemDropdown();

// Show variants if applicable
itemSelect.addEventListener('change', ()=>{
  variantWrapper.innerHTML = '';
  const selectedItem = itemsList.find(i=>i.name===itemSelect.value);
  if(selectedItem && selectedItem.variants){
    const variantSelect = document.createElement('select');
    variantSelect.id = 'variantSelect';
    variantSelect.style.width = "100%";
    const ph = document.createElement('option');
    ph.value = "";
    ph.textContent = "Select Type";
    ph.disabled = true;
    ph.selected = true;
    variantSelect.appendChild(ph);
    selectedItem.variants.forEach(v=>{
      const opt = document.createElement('option');
      opt.value = v.name;
      opt.textContent = `${v.name} (${v.price.toFixed(2)})`;
      variantSelect.appendChild(opt);
    });
    variantWrapper.appendChild(variantSelect);
  }
});

// Add item
function addItem(){
  const name = itemSelect.value;
  const qty = parseInt(qtyInput.value) || 0;
  if(!name || qty<=0){
    alert("Please select a valid item and quantity.");
    return;
  }

  const item = itemsList.find(i=>i.name===name);
  let finalName = item.name;
  let price = item.price || 0;

  if(item.variants){
    const variantSelect = document.getElementById('variantSelect');
    if(!variantSelect || !variantSelect.value){
      alert("Please select a type for this item.");
      return;
    }
    const variant = item.variants.find(v=>v.name===variantSelect.value);
    finalName += ` (${variant.name})`;
    price = variant.price;
  }

  invoiceItems.push({
    name: finalName,
    price: price,
    quantity: qty,
    total: price*qty
  });

  renderInvoice();
  qtyInput.value = 1;
  itemSelect.value = "";
  variantWrapper.innerHTML = '';
}

// Add transport
function addTransport(){
  const fee = parseFloat(transportInput.value);
  if(isNaN(fee) || fee <=0){
    transportInput.value = "";
    renderInvoice();
    return;
  }

  const existing = invoiceItems.find(i => i.name === "Transportation");
  if(existing){
    existing.total = fee;
    existing.price = fee;
    existing.quantity = "-";
  } else {
    invoiceItems.push({
      name: "Transportation",
      price: fee,
      quantity: "-",
      total: fee
    });
  }
  transportInput.value = "";
  renderInvoice();
}

// Remove item
function removeItem(index){
  invoiceItems.splice(index,1);
  renderInvoice();
}

// Clear all
function clearAll(){
  if(confirm("Are you sure you want to clear all items?")){
    invoiceItems = [];
    customerInput.value = '';
    itemSelect.value = "";
    transportInput.value = "";
    variantWrapper.innerHTML = '';
    renderInvoice();
  }
}

// Render invoice
function renderInvoice(){
  tbody.innerHTML='';
  let grand=0;
  invoiceItems.forEach((it,idx)=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`
      <td>${it.name}</td>
      <td>${it.price.toFixed(2)}</td>
      <td>${it.quantity}</td>
      <td>${it.total.toFixed(2)}</td>
      <td><button style="background:#dc3545;color:white;border:none;padding:5px 8px;border-radius:4px;" onclick="removeItem(${idx})">X</button></td>
    `;
    tbody.appendChild(tr);
    grand+=Number(it.total);
  });
  grandEl.textContent=grand.toFixed(2);
}

// Print invoice
function printInvoice(){
  if(invoiceItems.length===0){ alert('No items to print'); return; }
  const customer=customerInput.value || "N/A";
  const dateStr=new Date().toLocaleDateString();
  const grand=grandEl.textContent;

  let html=`<html><head><meta charset="utf-8"><title>Invoice</title><style>
    body{font-family:Arial,sans-serif;padding:20px;}
    h1{text-align:center;margin-bottom:10px;}
    .header{display:flex;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;}
    table{width:100%;border-collapse:collapse;margin-top:10px;}
    th,td{border:1px solid black;padding:8px;text-align:center;}
    th{background:#f2f2f2;}
    .total{text-align:right;font-weight:bold;font-size:16px;margin-top:10px;}
    </style></head><body>
    <h1>Invoice</h1>
    <div class="header"><div><strong>Customer:</strong> ${customer}</div><div><strong>Date:</strong> ${dateStr}</div></div>
    <table><thead><tr><th>Item</th><th>Price</th><th>Qty</th><th>Total</th></tr></thead><tbody>`;

  invoiceItems.forEach(it=>{
    html+=`<tr><td>${it.name}</td><td>${it.price.toFixed(2)}</td><td>${it.quantity}</td><td>${it.total.toFixed(2)}</td></tr>`;
  });

  html+=`</tbody></table><div class="total">Grand Total: ${grand}</div></body></html>`;

  const w=window.open('','_blank','width=800,height=600');
  w.document.write(html);
  w.document.close();
  w.focus();
  w.print();
}

renderInvoice();
