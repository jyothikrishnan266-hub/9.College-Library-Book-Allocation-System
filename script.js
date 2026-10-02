// ============================================
// DATA
// ============================================

let students =
    JSON.parse(localStorage.getItem("libraryStudents")) || [];

let books =
    JSON.parse(localStorage.getItem("libraryBooks")) || [];

let transactions =
    JSON.parse(localStorage.getItem("libraryTransactions")) || [];

let waitingList =
    JSON.parse(localStorage.getItem("libraryWaiting")) || [];


// ============================================
// LIBRARY SETTINGS
// ============================================

// Maximum number of days a book can be issued
const ISSUE_DAYS = 14;

// Fine charged per overdue day
const FINE_PER_DAY = 5;


// ============================================
// SAVE DATA
// ============================================

function saveData() {

    localStorage.setItem(
        "libraryStudents",
        JSON.stringify(students)
    );

    localStorage.setItem(
        "libraryBooks",
        JSON.stringify(books)
    );

    localStorage.setItem(
        "libraryTransactions",
        JSON.stringify(transactions)
    );

    localStorage.setItem(
        "libraryWaiting",
        JSON.stringify(waitingList)
    );
}


// ============================================
// NAVIGATION
// ============================================

function showSection(sectionId) {

    document
        .querySelectorAll(".section")
        .forEach(section => {
            section.classList.remove("active");
        });

    document
        .getElementById(sectionId)
        .classList.add("active");

    updateAll();
}


// ============================================
// DATE FUNCTIONS
// ============================================

function getDateAfterDays(days) {

    const date = new Date();

    date.setDate(
        date.getDate() + days
    );

    return date.toISOString();
}


function formatDate(dateString) {

    return new Date(dateString)
        .toLocaleDateString();
}


// ============================================
// STUDENT REGISTRATION
// ============================================

document
    .getElementById("studentForm")
    .addEventListener("submit", function(e) {

        e.preventDefault();

        const studentId =
            document
                .getElementById("studentId")
                .value
                .trim();

        // Prevent duplicate Student ID
        if (
            students.some(
                student =>
                    student.id.toLowerCase() ===
                    studentId.toLowerCase()
            )
        ) {

            alert("Student ID already exists.");

            return;
        }

        const student = {

            id: studentId,

            name:
                document
                    .getElementById("studentName")
                    .value
                    .trim(),

            department:
                document
                    .getElementById("department")
                    .value,

            year:
                document
                    .getElementById("studentYear")
                    .value,

            phone:
                document
                    .getElementById("studentPhone")
                    .value
                    .trim()
        };

        students.push(student);

        saveData();

        this.reset();

        updateAll();

        alert("Student registered successfully.");
    });


// ============================================
// DISPLAY STUDENTS
// ============================================

function renderStudents() {

    const table =
        document.getElementById("studentTable");

    table.innerHTML = "";

    students.forEach(student => {

        table.innerHTML += `

            <tr>

                <td>${student.id}</td>

                <td>${student.name}</td>

                <td>${student.department}</td>

                <td>${student.year}</td>

                <td>${student.phone}</td>

            </tr>
        `;
    });
}


// ============================================
// BOOK REGISTRATION
// ============================================

document
    .getElementById("bookForm")
    .addEventListener("submit", function(e) {

        e.preventDefault();

        const isbn =
            document
                .getElementById("bookISBN")
                .value
                .trim();

        // ISBN search key
        if (
            books.some(
                book => book.isbn === isbn
            )
        ) {

            alert("ISBN already exists.");

            return;
        }

        const copies =
            Number(
                document
                    .getElementById("bookCopies")
                    .value
            );

        const book = {

            id: Date.now(),

            title:
                document
                    .getElementById("bookTitle")
                    .value
                    .trim(),

            author:
                document
                    .getElementById("bookAuthor")
                    .value
                    .trim(),

            isbn: isbn,

            category:
                document
                    .getElementById("bookCategory")
                    .value,

            totalCopies: copies,

            availableCopies: copies,

            issueCount: 0
        };

        books.push(book);

        saveData();

        this.reset();

        updateAll();

        alert("Book registered successfully.");
    });


// ============================================
// DISPLAY BOOKS
// ============================================

function renderBooks() {

    const table =
        document.getElementById("bookTable");

    table.innerHTML = "";

    books.forEach(book => {

        const issued =
            book.totalCopies -
            book.availableCopies;

        table.innerHTML += `

            <tr>

                <td>${book.title}</td>

                <td>${book.author}</td>

                <td>${book.isbn}</td>

                <td>${book.category}</td>

                <td>${book.totalCopies}</td>

                <td class="${
                    book.availableCopies > 0
                    ? "available"
                    : "unavailable"
                }">

                    ${book.availableCopies}

                </td>

                <td>${issued}</td>

            </tr>
        `;
    });
}


// ============================================
// BOOK SEARCH
// ============================================

function searchBooks() {

    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();

    const table =
        document.getElementById("searchTable");

    table.innerHTML = "";

    const results =
        books.filter(book =>

            book.title
                .toLowerCase()
                .includes(search)

            ||

            book.author
                .toLowerCase()
                .includes(search)

            ||

            book.category
                .toLowerCase()
                .includes(search)

            ||

            book.isbn
                .toLowerCase()
                .includes(search)
        );

    results.forEach(book => {

        table.innerHTML += `

            <tr>

                <td>${book.title}</td>

                <td>${book.author}</td>

                <td>${book.isbn}</td>

                <td>${book.category}</td>

                <td class="${
                    book.availableCopies > 0
                    ? "available"
                    : "unavailable"
                }">

                    ${
                        book.availableCopies > 0
                        ? "Available"
                        : "Not Available"
                    }

                </td>

            </tr>
        `;
    });
}


// ============================================
// LOAD DROPDOWNS
// ============================================

function loadDropdowns() {

    const issueStudent =
        document.getElementById("issueStudent");

    const issueBook =
        document.getElementById("issueBook");

    const returnBook =
        document.getElementById("returnBook");

    const waitStudent =
        document.getElementById("waitStudent");

    const waitBook =
        document.getElementById("waitBook");


    issueStudent.innerHTML =
        `<option value="">
            Select Student
        </option>`;

    waitStudent.innerHTML =
        `<option value="">
            Select Student
        </option>`;


    students.forEach(student => {

        const option = `
            <option value="${student.id}">
                ${student.id} - ${student.name}
            </option>
        `;

        issueStudent.innerHTML += option;

        waitStudent.innerHTML += option;
    });


    issueBook.innerHTML =
        `<option value="">
            Select Available Book
        </option>`;

    waitBook.innerHTML =
        `<option value="">
            Select Book
        </option>`;


    books.forEach(book => {

        if (book.availableCopies > 0) {

            issueBook.innerHTML += `

                <option value="${book.id}">
                    ${book.title}
                </option>
            `;
        }

        waitBook.innerHTML += `

            <option value="${book.id}">
                ${book.title}
            </option>
        `;
    });


    returnBook.innerHTML =
        `<option value="">
            Select Issued Book
        </option>`;


    transactions
        .filter(
            transaction =>
                transaction.status === "issued"
        )
        .forEach(transaction => {

            returnBook.innerHTML += `

                <option value="${transaction.id}">

                    ${transaction.studentName}
                    -
                    ${transaction.bookTitle}

                </option>
            `;
        });
}


// ============================================
// ISSUE BOOK
// ============================================

function issueBook() {

    const studentId =
        document
            .getElementById("issueStudent")
            .value;

    const bookId =
        Number(
            document
                .getElementById("issueBook")
                .value
        );

    if (!studentId || !bookId) {

        alert(
            "Select a student and book."
        );

        return;
    }

    const student =
        students.find(
            s => s.id === studentId
        );

    const book =
        books.find(
            b => b.id === bookId
        );

    if (!student || !book) return;

    if (book.availableCopies <= 0) {

        alert(
            "This book is not available."
        );

        return;
    }

    // Check whether student already has this book
    const alreadyIssued =
        transactions.some(
            transaction =>
                transaction.studentId === studentId &&
                transaction.bookId === bookId &&
                transaction.status === "issued"
        );

    if (alreadyIssued) {

        alert(
            "This student already has this book."
        );

        return;
    }

    const transaction = {

        id: Date.now(),

        studentId: student.id,

        studentName: student.name,

        bookId: book.id,

        bookTitle: book.title,

        issueDate:
            new Date().toISOString(),

        dueDate:
            getDateAfterDays(ISSUE_DAYS),

        returnDate: null,

        status: "issued",

        fine: 0
    };

    transactions.push(transaction);

    book.availableCopies--;

    book.issueCount++;

    saveData();

    updateAll();

    alert(
        `${book.title} issued to ${student.name}.`
    );
}


// ============================================
// RETURN BOOK
// ============================================

function returnBook() {

    const transactionId =
        Number(
            document
                .getElementById("returnBook")
                .value
        );

    if (!transactionId) {

        alert(
            "Select an issued book."
        );

        return;
    }

    const transaction =
        transactions.find(
            t => t.id === transactionId
        );

    if (!transaction) return;

    const book =
        books.find(
            b => b.id === transaction.bookId
        );

    if (!book) return;

    transaction.returnDate =
        new Date().toISOString();

    transaction.fine =
        calculateFine(transaction);

    transaction.status =
        "returned";

    book.availableCopies++;

    saveData();

    updateAll();

    alert(
        `Book returned.\nFine: ₹${transaction.fine}`
    );
}


// ============================================
// FINE CALCULATION
// ============================================

function calculateFine(transaction) {

    const endDate =
        transaction.returnDate
        ? new Date(transaction.returnDate)
        : new Date();

    const dueDate =
        new Date(transaction.dueDate);

    if (endDate <= dueDate) {
        return 0;
    }

    const difference =
        endDate - dueDate;

    const overdueDays =
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );

    return overdueDays *
           FINE_PER_DAY;
}


// ============================================
// OVERDUE TRACKING
// ============================================

function renderOverdue() {

    const table =
        document.getElementById("overdueTable");

    table.innerHTML = "";

    const today =
        new Date();

    transactions
        .filter(
            transaction =>
                transaction.status === "issued"
        )
        .forEach(transaction => {

            const dueDate =
                new Date(
                    transaction.dueDate
                );

            if (today > dueDate) {

                const difference =
                    today - dueDate;

                const days =
                    Math.ceil(
                        difference /
                        (1000 * 60 * 60 * 24)
                    );

                const fine =
                    days * FINE_PER_DAY;

                table.innerHTML += `

                    <tr>

                        <td>
                            ${transaction.studentName}
                        </td>

                        <td>
                            ${transaction.bookTitle}
                        </td>

                        <td>
                            ${formatDate(
                                transaction.dueDate
                            )}
                        </td>

                        <td class="overdue">
                            ${days} days
                        </td>

                        <td class="overdue">
                            ₹${fine}
                        </td>

                    </tr>
                `;
            }
        });
}


// ============================================
// ISSUED BOOKS TABLE
// ============================================

function renderIssuedBooks() {

    const table =
        document.getElementById("issuedTable");

    table.innerHTML = "";

    transactions
        .slice()
        .reverse()
        .forEach(transaction => {

            let fine =
                transaction.status === "returned"
                ? transaction.fine
                : calculateFine(transaction);

            let status =
                transaction.status;

            table.innerHTML += `

                <tr>

                    <td>
                        ${transaction.studentName}
                    </td>

                    <td>
                        ${transaction.bookTitle}
                    </td>

                    <td>
                        ${formatDate(
                            transaction.issueDate
                        )}
                    </td>

                    <td>
                        ${formatDate(
                            transaction.dueDate
                        )}
                    </td>

                    <td class="${
                        status === "returned"
                        ? "returned"
                        : "issued"
                    }">

                        ${status}

                    </td>

                    <td>
                        ₹${fine}
                    </td>

                </tr>
            `;
        });
}


// ============================================
// WAITING LIST
// ============================================

function addWaitingRequest() {

    const studentId =
        document
            .getElementById("waitStudent")
            .value;

    const bookId =
        Number(
            document
                .getElementById("waitBook")
                .value
        );

    if (!studentId || !bookId) {

        alert(
            "Select a student and book."
        );

        return;
    }

    const student =
        students.find(
            s => s.id === studentId
        );

    const book =
        books.find(
            b => b.id === bookId
        );

    if (!student || !book) return;

    // Prevent duplicate waiting request
    const duplicate =
        waitingList.some(
            request =>
                request.studentId === studentId &&
                request.bookId === bookId &&
                request.status === "waiting"
        );

    if (duplicate) {

        alert(
            "Student is already on the waiting list."
        );

        return;
    }

    waitingList.push({

        id: Date.now(),

        studentId: student.id,

        studentName: student.name,

        bookId: book.id,

        bookTitle: book.title,

        requestedDate:
            new Date().toISOString(),

        status: "waiting"
    });

    saveData();

    updateAll();

    alert(
        "Added to waiting list."
    );
}


// ============================================
// DISPLAY WAITING LIST
// ============================================

function renderWaitingList() {

    const table =
        document.getElementById("waitingTable");

    table.innerHTML = "";

    const active =
        waitingList.filter(
            request =>
                request.status === "waiting"
        );

    active.forEach(
        (request, index) => {

            table.innerHTML += `

                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${request.studentName}
                    </td>

                    <td>
                        ${request.bookTitle}
                    </td>

                    <td>
                        ${formatDate(
                            request.requestedDate
                        )}
                    </td>

                    <td>
                        Waiting
                    </td>

                </tr>
            `;
        }
    );
}


// ============================================
// POPULAR BOOK STATISTICS
// ============================================

function renderPopularBooks() {

    const table =
        document.getElementById("popularTable");

    table.innerHTML = "";

    const sortedBooks =
        [...books].sort(
            (a, b) =>
                b.issueCount -
                a.issueCount
        );

    sortedBooks.forEach(
        (book, index) => {

            table.innerHTML += `

                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${book.title}
                    </td>

                    <td>
                        ${book.issueCount}
                    </td>

                </tr>
            `;
        }
    );

    const popular =
        sortedBooks[0];

    document.getElementById("popularBook")
        .textContent =
        popular
        ? popular.title
        : "None";
}


// ============================================
// DASHBOARD
// ============================================

function updateDashboard() {

    document.getElementById("totalStudents")
        .textContent =
        students.length;

    document.getElementById("totalBooks")
        .textContent =
        books.reduce(
            (sum, book) =>
                sum + book.totalCopies,
            0
        );

    document.getElementById("availableBooks")
        .textContent =
        books.reduce(
            (sum, book) =>
                sum + book.availableCopies,
            0
        );

    document.getElementById("issuedBooks")
        .textContent =
        transactions.filter(
            t => t.status === "issued"
        ).length;

    const overdue =
        transactions.filter(
            t =>
                t.status === "issued" &&
                new Date() >
                new Date(t.dueDate)
        ).length;

    document.getElementById("overdueBooks")
        .textContent =
        overdue;

    document.getElementById("waitingRequests")
        .textContent =
        waitingList.filter(
            w => w.status === "waiting"
        ).length;
}


// ============================================
// REPORTS
// ============================================

function updateReports() {

    document.getElementById("totalIssues")
        .textContent =
        transactions.length;

    document.getElementById("totalReturns")
        .textContent =
        transactions.filter(
            t => t.status === "returned"
        ).length;

    const totalFine =
        transactions.reduce(
            (sum, transaction) =>
                sum +
                (
                    transaction.status === "returned"
                    ? transaction.fine
                    : calculateFine(transaction)
                ),
            0
        );

    document.getElementById("totalFine")
        .textContent =
        "₹" + totalFine;

    renderPopularBooks();
}


// ============================================
// PRINT REPORT
// ============================================

function printReport() {

    window.print();
}


// ============================================
// CLEAR ALL DATA
// ============================================

function clearAllData() {

    if (
        !confirm(
            "Are you sure you want to delete all library data?"
        )
    ) {
        return;
    }

    students = [];

    books = [];

    transactions = [];

    waitingList = [];

    saveData();

    updateAll();

    alert("All data cleared.");
}


// ============================================
// UPDATE EVERYTHING
// ============================================

function updateAll() {

    renderStudents();

    renderBooks();

    searchBooks();

    loadDropdowns();

    renderIssuedBooks();

    renderWaitingList();

    renderOverdue();

    updateDashboard();

    updateReports();
}


// ============================================
// START APPLICATION
// ============================================

updateAll();