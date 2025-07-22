const backendUrl = "http://localhost:8080";

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
      select.innerHTML = "";

      products.forEach(product => {
        const option = document.createElement("option");
        option.value = product.id;
        option.textContent = product.name + " - " + product.price + "₺";
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
  const selectedProductNames = Array.from(select.selectedOptions).map(option => option.textContent);
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

function fetchOrders() {
  fetch(`${backendUrl}/orders`)
    .then(res => res.json())
    .then(orders => {
      const tbody = document.querySelector("#orderTable tbody");
      tbody.innerHTML = "";

      orders.forEach(order => {
        const tr = document.createElement("tr");
        const products = order.products.map(p => p.name).join(", ");

        tr.innerHTML = `
          <td>${order.tableId}</td>
          <td>${products}</td>
          <td>${order.totalPrice.toFixed(2)}₺</td>
        `;
        tbody.appendChild(tr);
      });
    });
}

function fetchTables() {
  fetch(`${backendUrl}/tables`)
    .then(res => res.json())
    .then(tables => {
      const tbody = document.querySelector("#tableList tbody");
      tbody.innerHTML = "";

      tables.forEach(table => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${table.tableNumber}</td>
          <td>${table.status === "available" ? "Boş" : "Dolu"}</td>
        `;
        tbody.appendChild(tr);
      });
    });
}
