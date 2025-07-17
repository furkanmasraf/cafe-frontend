const backendUrl = "http://localhost:8080";

// Sayfa yüklendiğinde verileri çek
window.onload = function () {
  fetchMenuItems();
  fetchTables();
  fetchOrders();
  loadProductsForSelect();
};

// Menü İşlemleri
function fetchMenuItems() {
  fetch(`${backendUrl}/menu`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("menuItems");
      list.innerHTML = "";
      data.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - ${item.price} TL`;
        li.innerHTML += ` <button onclick="deleteMenuItem(${item.id})">Sil</button>`;
        list.appendChild(li);
      });
    });
}

function addMenuItem() {
  const name = document.getElementById("itemName").value;
  const price = parseFloat(document.getElementById("itemPrice").value);

  if (!name || isNaN(price)) {
    alert("Lütfen ürün adı ve fiyatını doğru giriniz.");
    return;
  }

  fetch(`${backendUrl}/menu`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price })
  }).then(() => {
    document.getElementById("itemName").value = "";
    document.getElementById("itemPrice").value = "";
    fetchMenuItems();
    loadProductsForSelect(); // Ürünler güncellendiğinde dropdown da güncellenmeli
  });
}

function deleteMenuItem(id) {
  fetch(`${backendUrl}/menu/${id}`, {
    method: "DELETE"
  }).then(() => {
    fetchMenuItems();
    loadProductsForSelect();
  });
}

// Masa İşlemleri
function fetchTables() {
  fetch(`${backendUrl}/tables`)
    .then(res => res.json())
    .then(data => {
      const grid = document.getElementById("tableGrid");
      grid.innerHTML = "";

      data.forEach(table => {
        const div = document.createElement("div");
        div.classList.add("table-box");

        if (table.status === "available") {
          div.classList.add("table-available");
        } else {
          div.classList.add("table-occupied");
        }

        div.innerHTML = `
          Masa ${table.tableNumber}<br>
          Durum: ${table.status === "available" ? "Boş" : "Dolu"}<br>
          <button onclick="deleteTable(${table.id})">Sil</button>
        `;
        grid.appendChild(div);
      });
    });
}

function addTable() {
  const tableNumber = document.getElementById("tableNumber").value;
  const status = document.getElementById("tableStatus").value;

  if (!tableNumber) {
    alert("Lütfen masa numarasını giriniz.");
    return;
  }

  fetch(`${backendUrl}/tables`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tableNumber, status })
  }).then(() => {
    document.getElementById("tableNumber").value = "";
    fetchTables();
  });
}

function deleteTable(id) {
  fetch(`${backendUrl}/tables/${id}`, {
    method: "DELETE"
  }).then(fetchTables);
}

// Sipariş / Ödeme İşlemleri

// Ürünleri dropdown'a yükle
function loadProductsForSelect() {
  fetch(`${backendUrl}/menu`)
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("productSelect");
      select.innerHTML = `<option value="" data-price="0">Ürün Seçiniz</option>`;
      data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item.name;
        option.setAttribute("data-price", item.price);
        select.appendChild(option);
      });
    });
}

// Seçilen ürün fiyatını güncelle
function updatePrice() {
  const select = document.getElementById("productSelect");
  const selectedOption = select.options[select.selectedIndex];
  const price = selectedOption.getAttribute("data-price") || 0;
  document.getElementById("productPrice").value = price;
}

function addOrderWithProduct() {
  const productId = document.getElementById("productSelect").value;
  const price = parseFloat(document.getElementById("productPrice").value);
  const tableId = document.getElementById("orderTableId").value;

  if (!productId) {
    alert("Lütfen bir ürün seçin.");
    return;
  }
  if (!tableId) {
    alert("Lütfen masa numarasını girin.");
    return;
  }

  fetch(`${backendUrl}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tableId, totalPrice: price, paid: false })
  }).then(() => {
    document.getElementById("productSelect").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("orderTableId").value = "";
    fetchOrders();
  });
}

function fetchOrders() {
  fetch(`${backendUrl}/orders`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("orderList");
      list.innerHTML = "";
      data.forEach(order => {
        const li = document.createElement("li");
        li.innerHTML = `Masa ${order.tableId} - ${order.totalPrice} TL - ${order.paid ? "✅ Ödendi" : "❌ Ödenmedi"} 
          ${!order.paid ? `<button onclick="payOrder(${order.id})">Öde</button>` : ""}`;
        list.appendChild(li);
      });
    });
}

function payOrder(id) {
  fetch(`${backendUrl}/orders/${id}/pay`, {
    method: "PUT"
  }).then(fetchOrders);
}
