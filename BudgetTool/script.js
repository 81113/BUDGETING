let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let income = parseFloat(localStorage.getItem("income")) || 0;

// Load initial data
window.onload = function() {
    if (income > 0) {
        document.getElementById("total-income").textContent = income;
    }
    updateExpenseList();
    updateSummary();
};

// Save monthly income
function saveIncome() {
    const incomeInput = document.getElementById("income").value;
    if (incomeInput && income === 0) {
        income = parseFloat(incomeInput);
        localStorage.setItem("income", income);
        document.getElementById("total-income").textContent = income;
        document.getElementById("income").value = '';
    }
}

// Add a new expense
function addExpense() {
    const expenseName = document.getElementById("expense-name").value;
    const expenseAmount = parseFloat(document.getElementById("expense-amount").value);
    const expenseCategory = document.getElementById("expense-category").value;
    const date = new Date().toLocaleString();

    if (expenseName && expenseAmount) {
        const expense = {
            name: expenseName,
            amount: expenseAmount,
            category: expenseCategory,
            date: date
        };
        expenses.push(expense);
        localStorage.setItem("expenses", JSON.stringify(expenses));
        updateExpenseList();
        updateSummary();

        // Clear form fields
        document.getElementById("expense-name").value = '';
        document.getElementById("expense-amount").value = '';
    }
}

// Update the expense list UI
function updateExpenseList() {
    const expenseList = document.getElementById("expense-list");
    expenseList.innerHTML = '';
    expenses.forEach((expense, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${expense.name} - $${expense.amount} (${expense.category}) on ${expense.date} 
            <button onclick="deleteExpense(${index})">Delete</button>
            <button onclick="editExpense(${index})">Edit</button>`;
        expenseList.appendChild(li);
    });
}

// Update summary information
function updateSummary() {
    const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
    const balance = income - totalExpenses;

    document.getElementById("total-expenses").textContent = totalExpenses.toFixed(2);
    document.getElementById("balance").textContent = balance.toFixed(2);
}

// Delete an expense
function deleteExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    updateExpenseList();
    updateSummary();
}

// Edit an expense
function editExpense(index) {
    const expense = expenses[index];
    document.getElementById("expense-name").value = expense.name;
    document.getElementById("expense-amount").value = expense.amount;
    document.getElementById("expense-category").value = expense.category;

    // Delete the original expense
    deleteExpense(index);
}

// Delete all expenses
function deleteAllExpenses() {
    expenses = [];
    localStorage.setItem("expenses", JSON.stringify(expenses));
    updateExpenseList();
    updateSummary();
}
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('budget-tracker-cache').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/style.css',
                '/script.js'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});
