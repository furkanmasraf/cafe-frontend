const backendUrl = "http://localhost:8080";

// Sayfa yüklendiğinde verileri çek
window.onload = function () {
  fetchMenuItems();
  fetchTables();
  fetchOrders();
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
        li.innerHTML += ` <button onclick="deleteMenuItem(${item.id})">Delete</button>`;
        list.appendChild(li);
      });
    });
}

function addMenuItem() {
  const name = document.getElementById("itemName").value;
  const price = parseFloat(document.getElementById("itemPrice").value);

  fetch(`${backendUrl}/menu`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price })
  }).then(() => {
    document.getElementById("itemName").value = "";
    document.getElementById("itemPrice").value = "";
    fetchMenuItems();
  });
}

function deleteMenuItem(id) {
  fetch(`${backendUrl}/menu/${id}`, {
    method: "DELETE"
  }).then(fetchMenuItems);
}

// Masa İşlemleri
function fetchTables() {
  fetch(`${backendUrl}/tables`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("tableList");
      list.innerHTML = "";
      data.forEach(table => {
        const li = document.createElement("li");
        li.textContent = `Table ${table.tableNumber} - ${table.status}`;
        li.innerHTML += ` <button onclick="deleteTable(${table.id})">Delete</button>`;
        list.appendChild(li);
      });
    });
}

function addTable() {
  const tableNumber = document.getElementById("tableNumber").value;
  const status = document.getElementById("tableStatus").value;

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
function createOrder() {
  const tableId = document.getElementById("orderTableId").value;
  const totalPrice = parseFloat(document.getElementById("orderTotalPrice").value);

  fetch(`${backendUrl}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tableId, totalPrice, paid: false })
  }).then(() => {
    document.getElementById("orderTableId").value = "";
    document.getElementById("orderTotalPrice").value = "";
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
        li.innerHTML = `Table ${order.tableId} - ${order.totalPrice} TL - ${order.paid ? "✅ Paid" : "❌ Unpaid"} 
          ${!order.paid ? `<button onclick="payOrder(${order.id})">Pay</button>` : ""}`;
        list.appendChild(li);
      });
    });
}

function payOrder(id) {
  fetch(`${backendUrl}/orders/${id}/pay`, {
    method: "PUT"
  }).then(fetchOrders);
}
