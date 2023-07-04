const group = [];
let nameGroup = {};

function addUser() {
    let userName = document.getElementById("name").value;
    let userCosts = parseFloat(document.getElementById("costs").value);
    if (!userName || isNaN(userCosts)) {
        alert("Введіть ім'я i сумму коректно");
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
    tableOfUsers.innerHTML = `<tr><th colspan="2">${nameGroup.name} - ${nameGroup.dateGroup}</th><tr><th>Ім'я</th><th>Сумма</th></tr></tr>`;

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
        nameGroup.name = document.getElementById("inputNameGroup").value;
        nameGroup.dateGroup = new Intl.DateTimeFormat("uk-UA").format(
            new Date()
        );
        console.log(nameGroup.dateGroup);

        document.getElementById("conteinerUsers").style.display = "block";
        document.getElementById("conteinerGroup").style.display = "none";
    }
}

function calculateDebts() {
    const totalExpense = group.reduce(
        (sum, expense) => sum + expense.expenses,
        0
    );

    const numParticipants = group.length;
    const averageExpense = totalExpense / numParticipants;

    const debtors = [];
    const creditors = [];

    group.forEach((expense) => {
        const difference = expense.expenses - averageExpense;

        if (difference > 0) {
            debtors.push({
                name: expense.name,
                amount: difference,
            });
        } else if (difference < 0) {
            creditors.push({
                name: expense.name,
                amount: -difference,
            });
        }
    });

    const transactions = [];

    debtors.forEach((debtor) => {
        while (debtor.amount > 0) {
            const creditor = creditors[0];
            const transactionAmount = Math.min(debtor.amount, creditor.amount);

            transactions.push({
                to: debtor.name,
                from: creditor.name,
                amount: transactionAmount,
            });

            debtor.amount -= transactionAmount;
            creditor.amount -= transactionAmount;

            if (creditor.amount === 0) {
                creditors.shift();
            }
        }
    });

    let tableOfUsers = document.getElementById("finalUserTable");
    tableOfUsers.innerHTML = "";
    tableOfUsers.innerHTML = `<tr><th colspan="2">Загальна сума: ${totalExpense}, по ${averageExpense} з кожного</th></tr>`;

    transactions.forEach((transaction) => {
        let row = document.createElement("tr");
        let nameCell = document.createElement("td");
        nameCell.textContent = `${transaction.from} має виплатити ${transaction.amount} для ${transaction.to}`;
        row.appendChild(nameCell);
        tableOfUsers.appendChild(row);
    });
    localStorage.setItem(
        `${nameGroup.name} - ${nameGroup.dateGroup}`,
        JSON.stringify(transactions)
    );
    document.getElementById("print").style.display = "inline-block";
}

//_______________________________________________________________________________________________________
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

                itemElement.textContent = `${item.from} має виплатити ${item.amount} для ${item.to}`;
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
