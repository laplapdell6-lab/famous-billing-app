const itemsList = [
  { name: "Pen", price: 10 },
  {
    name: "Notebook",
    variants: [
      { name: "Small", price: 40 },
      { name: "Medium", price: 50 },
      { name: "Large", price: 60 }
    ]
  },
  {
    name: "Pencil",
    variants: [
      { name: "Small", price: 5 },
      { name: "Medium", price: 8 },
      { name: "Big", price: 10 }
    ]
  },
  { name: "Eraser", price: 3 },
  { name: "Marker", price: 20 },
  { name: "Scale", price: 15 }
];

let invoiceItems = [];

function populateItemDropdown() {
  const itemSelect = document.getElementById("itemName");
  itemSelect.innerHTML = '<option value="">Select Item</option>';
  itemsList.forEach((item, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = item.name;
    itemSelect.appendChild(opt);
  });
}

function handleItemChange() {
  const itemSelect = document.getElementById("itemName");
  const selectedItem = itemsList[itemSelect.value];
  const variantWrapper = document.getElementById("variantWrapper");

  variantWrapper.innerHTML = "";

  if (selectedItem && selectedItem.variants) {
    const variantSelect = document.createElement("select");
    variantSelect.id = "variantSelect";
    variantSelect.className = "variant-select";
    variantSelect.innerHTML = '<option value="">Select Type</option>';

    selectedItem.variants.forEach((v, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = `${v.name} - ₹${v.price.toFixed(2)}`;
      variantSelect.appendChild(opt);
    });

    variantWrapper.appendChild(variantSelect);
  }
}

function addItem() {
  const itemSelect = document.getElementById("itemName");
  const qty = document.getElementById("quantity").value;
  const transport = document.getElementById("transport").value || 0;

  if (!itemSelect.value || qty <= 0) {
    alert("Please select an item and enter quantity.");
    return;
  }

  const selectedItem = itemsList[itemSelect.value];
  let itemName = selectedItem.name;
  let price = selectedItem.price || 0;

  if (selectedItem.variants) {
    const variantSelect = document.getElementById("variantSelect");
    if (!variantSelect || !variantSelect.value) {
      alert("Please select a type for this item.");
      return;
    }
    const variant = selectedItem.variants[variantSelect.value];
    itemName += ` (${variant.name})`;
    price = variant.price;
  }

  const total = price * qty;
  invoiceItems.push({ name: itemName, qty, price, total });

  renderTable(transport);
}

function renderTable(transport) {
  const tableBody = document.getElementById("billTableBody");
  tableBody.innerHTML = "";

  let grandTotal = 0;

  invoiceItems.forEach((item, index) => {
    grandTotal += item.total;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>${item.price.toFixed(2)}</td>
      <td>${item.total.toFixed(2)}</td>
    `;
    tableBody.appendChild(row);
  });

  const transportFee = parseFloat(transport) || 0;
  grandTotal += transportFee;

  document.getElementById("grandTotal").textContent = grandTotal.toFixed(2);
}

function clearAll() {
  invoiceItems = [];
  document.getElementById("billTableBody").innerHTML = "";
  document.getElementById("grandTotal").textContent = "0.00";
  document.getElementById("customerName").value = "";
  document.getElementById("quantity").value = "";
  document.getElementById("itemName").value = "";
  document.getElementById("transport").value = "";
  document.getElementById("variantWrapper").innerHTML = "";
}

function printBill() {
  window.print();
}

document.addEventListener("DOMContentLoaded", () => {
  populateItemDropdown();
  document.getElementById("itemName").addEventListener("change", handleItemChange);
});
