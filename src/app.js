const group = [];
let nameGroup = "";

function addUser() {
    let userName = document.getElementById("name").value;
    let userCosts = parseFloat(document.getElementById("costs").value);
    if (!userName || !userCosts) {
        alert("Введіть ім'я i сумму");
        return;
    }
    group.push({
        name: userName,
        expenses: userCosts,
    });

    document.getElementById("name").value = "";
    document.getElementById("costs").value = "";
    addUserToTable();
}

function addUserToTable() {
    let tableOfUsers = document.getElementById("UserTable");
    tableOfUsers.innerHTML = "";
    tableOfUsers.innerHTML = `<tr><th colspan="2">${nameGroup}</th><tr><th>Ім'я</th><th>Сумма</th></tr></tr>`;

    for (let i = 0; i < group.length; i++) {
        let row = document.createElement("tr");

        let nameCell = document.createElement("td");
        nameCell.textContent = group[i].name;
        row.appendChild(nameCell);

        let costCell = document.createElement("td");
        costCell.textContent = group[i].expenses;
        row.appendChild(costCell);

        tableOfUsers.appendChild(row);
    }
    document.getElementById("calculateDebtsB").style.display = "block";
}

function createNameGroupe() {
    if (!document.getElementById("inputNameGroup").value) {
        alert("Але ж ви не ввели нічого...");
        return;
    } else {
        nameGroup = document.getElementById("inputNameGroup").value;
        document.getElementById("conteinerUsers").style.display = "block";
        document.getElementById("conteinerGroup").style.display = "none";
    }
}

function calculateDebts() {
    const totalExpenses = group.reduce((sum, user) => sum + user.expenses, 0);
    const averageExpense = totalExpenses / group.length;
    const balances = [];

    group.forEach((user) => {
        balances.push({
            name: user.name,
            expenses: averageExpense - user.expenses,
        });
    });

    let tableOfUsers = document.getElementById("finalUserTable");
    tableOfUsers.innerHTML = "";
    tableOfUsers.innerHTML = `<tr><th colspan="2">Загальна сума: ${totalExpenses}, по ${averageExpense} з кожного</th></tr>`;

    for (let i = 0; i < balances.length; i++) {
        let row = document.createElement("tr");
        let res = "";
        if (balances[i].expenses > 0) {
            res = "виннен";
        } else if (balances[i].expenses < 0) {
            res = "винні";
        } else {
            res = " не має боргів";
        }

        let nameCell = document.createElement("td");
        nameCell.textContent = `${balances[i].name} ${res}`;
        row.appendChild(nameCell);
        let costCell = document.createElement("td");
        costCell.textContent = balances[i].expenses;
        row.appendChild(costCell);
        tableOfUsers.appendChild(row);
    }

    localStorage.setItem(`${nameGroup}`, JSON.stringify(balances));
    document.getElementById("print").style.display = "inline-block";
}

function getHistory() {
    document.getElementById("output").innerHTML = "";

    let container = document.getElementById("output");
    const keys = Object.keys(localStorage);
    let costs = "";
    for (let i = 0; i < keys.length; i++) {
        const dayParty = document.createElement("h4");
        dayParty.textContent = `_______________${keys[i]}_______________`;
        if (keys.length <= 1) {
            alert("Історія відсутня");
            return;
        }
        if (keys[i] === "i18nextLng") {
            continue;
        } else {
            container.appendChild(dayParty);

            const storedData = localStorage.getItem(keys[i]);
            const data = JSON.parse(storedData);

            data.forEach((item) => {
                const itemElement = document.createElement("p");
                if (item.expenses > 0) {
                    costs = "винен";
                } else if (item.expenses < 0) {
                    costs = "винні";
                } else {
                    costs = "немає боргів";
                }

                itemElement.textContent = `${item.name}, ${costs}: ${item.expenses}`;
                container.appendChild(itemElement);
            });
            document.getElementById("clearHistory").style.display = "block";
        }
    }
}

function clearHistoryB() {
    localStorage.clear();
    document.getElementById("output").style.display = "none";
    document.getElementById("clearHistory").style.display = "none";
}

let calculateDebtsButton = document.getElementById("calculateDebtsB");
calculateDebtsButton.addEventListener("click", calculateDebts);

let addUserButton = document.getElementById("addUser");
addUserButton.addEventListener("click", addUser);

let createGroupeButton = document.getElementById("createGroupeButton");
createGroupeButton.addEventListener("click", createNameGroupe);

let gethistoryButton = document.getElementById("historyButton");
gethistoryButton.addEventListener("click", getHistory);

let clearHistoryButton = document.getElementById("clearHistory");
clearHistoryButton.addEventListener("click", clearHistoryB);
