const backendUrl = "http://localhost:8080";

// Sayfa yüklendiğinde ürünleri, siparişleri ve masaları yükle
window.onload = () => {
  loadProductsForSelect();
  fetchOrders();
  fetchTables();
};

function loadProductsForSelect() {
  fetch(`${backendUrl}/menu`)
    .then(response => response.json())
    .then(products => {
      const select = document.getElementById("productSelect");
      select.innerHTML = ""; // Önceki ürünleri temizle

      products.forEach(product => {
        const option = document.createElement("option");
        option.value = product.id;
        option.textContent = `${product.name} - ${product.price}₺`;
        option.setAttribute("data-price", product.price);
        select.appendChild(option);
      });
    });
}

function updatePrice() {
  const select = document.getElementById("productSelect");
  let total = 0;

  Array.from(select.selectedOptions).forEach(option => {
    total += parseFloat(option.getAttribute("data-price") || 0);
  });

  document.getElementById("productPrice").value = total.toFixed(2);
}

function addOrderWithProduct() {
  const select = document.getElementById("productSelect");
  const selectedProductIds = Array.from(select.selectedOptions).map(option => option.value);
  const totalPrice = parseFloat(document.getElementById("productPrice").value);
  const tableId = prompt("Masa numarasını giriniz:");

  if (selectedProductIds.length === 0) {
    alert("Lütfen en az bir ürün seçin.");
    return;
  }

  if (!tableId) {
    alert("Lütfen masa numarasını girin.");
    return;
  }

  fetch(`${backendUrl}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tableId: tableId,
      productIds: selectedProductIds,
      totalPrice: totalPrice,
      paid: false
    })
  }).then(() => {
    select.value = "";
    document.getElementById("productPrice").value = "";
    fetchOrders();
  });
}

function addTable() {
  const tableNumber = document.getElementById("tableNumber").value;
  const status = document.getElementById("tableStatus").value;

  if (!tableNumber || !status) {
    alert("Lütfen masa numarası ve durumunu seçin.");
    return;
  }

  fetch(`${backendUrl}/tables`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tableNumber, status })
  }).then(() => {
    document.getElementById("tableNumber").value = "";
    document.getElementById("tableStatus").value = "";
    fetchTables();
  });
}

// Placeholder fonksiyonlar
function fetchOrders() {
  console.log("Siparişler yüklenecek...");
}

function fetchTables() {
  console.log("Masalar yüklenecek...");
}
