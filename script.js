// Predefined items with prices
const itemsList = [
  { name: "Paayi", price: 1000 },
  { name: "Notebook", price: 50 },
  { name: "Pencil", price: 5 },
  { name: "Eraser", price: 3 },
  { name: "Marker", price: 20 }
];

// Populate item dropdown
const itemSelect = document.getElementById("item");
itemsList.forEach(item => {
  const option = document.createElement("option");
  option.value = item.name;
  option.textContent = `${item.name} (Rs.${item.price})`;
  itemSelect.appendChild(option);
});

let invoiceItems = [];

function addItem() {
  const itemName = itemSelect.value;
  const quantity = parseInt(document.getElementById("quantity").value);
  const item = itemsList.find(i => i.name === itemName);
  
  if(!item || quantity <= 0) return;

  invoiceItems.push({
    name: item.name,
    price: item.price,
    quantity: quantity,
    total: item.price * quantity
  });

  renderInvoice();
}

function removeItem(index) {
  invoiceItems.splice(index, 1);
  renderInvoice();
}

function renderInvoice() {
  const tbody = document.querySelector("#invoiceTable tbody");
  tbody.innerHTML = "";
  let grandTotal = 0;

  invoiceItems.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>Rs.${item.price}</td>
      <td>${item.quantity}</td>
      <td>Rs.${item.total}</td>
      <td><button onclick="removeItem(${index})">Remove</button></td>
    `;
    tbody.appendChild(tr);
    grandTotal += item.total;
  });

  document.getElementById("grandTotal").textContent = grandTotal;
}

// Print invoice
function printInvoice() {
  const customerName = document.getElementById("customer").value || "N/A";
  let grandTotal = document.getElementById("grandTotal").textContent;

  let html = `
    <html>
    <head>
      <title>Invoice</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1, h2 { text-align: center; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid black; padding: 8px; text-align: center; }
        th { background-color: #f2f2f2; }
        .total { text-align: right; font-weight: bold; margin-top: 10px; }
      </style>
    </head>
    <body>
      <h1>Invoice</h1>
      <p><strong>Customer Name:</strong> ${customerName}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Price (Rs.)</th>
            <th>Quantity</th>
            <th>Total (Rs.)</th>
          </tr>
        </thead>
        <tbody>
  `;

  invoiceItems.forEach(item => {
    html += `
      <tr>
        <td>${item.name}</td>
        <td>Rs.${item.price}</td>
        <td>${item.quantity}</td>
        <td>Rs.${item.total}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
      <p class="total">Grand Total: Rs.${grandTotal}</p>
    </body>
    </html>
  `;

  const printWindow = window.open('', '', 'height=600,width=800');
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
