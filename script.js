// === Items data ===
const itemsList = [
  {name:"Pen", price:10},
  {name:"Notebook", price:50},
  {name:"Pencil", price:5},
  {name:"Eraser", price:3},
  {name:"Marker", price:20},
  {name:"Scale", price:15}
];

// Elements
const itemSelect = document.getElementById('item');
const qtyInput = document.getElementById('quantity');
const tbody = document.querySelector('#invoiceTable tbody');
const grandEl = document.getElementById('grandTotal');
const customerInput = document.getElementById('customer');

// Populate dropdown with placeholder
const placeholder = document.createElement('option');
placeholder.value = "";
placeholder.textContent = "Select Item";
placeholder.disabled = true;
placeholder.selected = true;
itemSelect.appendChild(placeholder);

// Add actual items
itemsList.forEach(it=>{
  const opt = document.createElement('option');
  opt.value = it.name;
  opt.textContent = `${it.name} (Rs.${it.price})`;
  itemSelect.appendChild(opt);
});

let invoiceItems = [];

// Add item
function addItem(){
  const name = itemSelect.value;
  const qty = parseInt(qtyInput.value) || 0;
  if(!name || qty<=0) {
    alert("Please select a valid item and quantity.");
    return;
  }

  const item = itemsList.find(i=>i.name===name);
  invoiceItems.push({
    name: item.name,
    price: item.price,
    quantity: qty,
    total: item.price*qty
  });
  renderInvoice();
  qtyInput.value = 1;
  itemSelect.value = ""; // reset dropdown to placeholder
}

// Remove item
function removeItem(index){
  invoiceItems.splice(index,1);
  renderInvoice();
}

// Clear all
function clearAll(){
  if(confirm("Are you sure you want to clear all items and customer name?")){
    invoiceItems = [];
    customerInput.value = '';
    itemSelect.value = "";
    renderInvoice();
  }
}

// Render table
function renderInvoice(){
  tbody.innerHTML='';
  let grand=0;
  invoiceItems.forEach((it,idx)=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`
      <td>${it.name}</td>
      <td>Rs.${it.price}</td>
      <td>${it.quantity}</td>
      <td>Rs.${it.total}</td>
      <td><button style="background:#dc3545;color:white;border:none;padding:5px 8px;border-radius:4px;" onclick="removeItem(${idx})">X</button></td>
    `;
    tbody.appendChild(tr);
    grand+=it.total;
  });
  grandEl.textContent=grand;
}

// Print invoice
function printInvoice(){
  if(invoiceItems.length===0){ alert('No items to print'); return; }
  const customer=customerInput.value || "N/A";
  const dateStr=new Date().toLocaleDateString();
  const grand=grandEl.textContent;

  let html=`
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice</title>
      <style>
        body{font-family:Arial,sans-serif; padding:20px;}
        h1{text-align:center; margin-bottom:10px;}
        .header{display:flex; justify-content:space-between; margin-bottom:10px; flex-wrap:wrap;}
        table{width:100%; border-collapse:collapse; margin-top:10px;}
        th,td{border:1px solid black; padding:8px; text-align:center;}
        th{background:#f2f2f2;}
        .total{text-align:right; font-weight:bold; font-size:16px; margin-top:10px;}
      </style>
    </head>
    <body>
      <h1>Invoice</h1>
      <div class="header">
        <div><strong>Customer:</strong> ${customer}</div>
        <div><strong>Date:</strong> ${dateStr}</div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Price (Rs.)</th>
            <th>Qty</th>
            <th>Total (Rs.)</th>
          </tr>
        </thead>
        <tbody>
  `;
  invoiceItems.forEach(it=>{
    html+=`
      <tr>
        <td>${it.name}</td>
        <td>Rs.${it.price}</td>
        <td>${it.quantity}</td>
        <td>Rs.${it.total}</td>
      </tr>
    `;
  });
  html+=`
        </tbody>
      </table>
      <div class="total">Grand Total: Rs.${grand}</div>
    </body>
    </html>
  `;

  const w=window.open('','_blank','width=800,height=600');
  w.document.write(html);
  w.document.close();
  w.focus();
  w.print();
}

// Initial render
renderInvoice();
