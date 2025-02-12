const tableRows = []; 

const RETURN_ALERT = 4; // The number of days for program to alert librarian that the book is about to be overdue. 
const TODAY_YEAR = 2025;
const TODAY_MONTH = 2;
const TODAY_DAY = 10; 
const today = new Date(TODAY_YEAR, TODAY_MONTH-1, TODAY_DAY); // month counts from 0 in javascript 

document.querySelector("#header-date").textContent = DateOps.parseDate(today.getFullYear(), today.getMonth()+1, today.getDate()); 

// About books

function Book(id, title, author, genre, numPages, summary, coverImgURL) {
    this.id = id ? id : "xxxxxx";
    this.title = title ? title : "";
    this.author = author ? author : "";
    this.genre = genre ? genre : "";
    this.numPages = numPages ? numPages : ""; 
    this.summary = summary ? summary : "";
    this.coverImgURL = coverImgURL ? coverImgURL : "";

    this.borrower = null; 
    this.borrowDate = null;
    this.expectedReturnDate = null; 
    this.actualReturnDate = null;
    this.borrowHistory = []; 
}
  
// About Users
function User(memberid, firstName, lastName) {
    this.memberid = memberid;
    this.firstName = firstName;
    this.lastName = lastName ? lastName : null;

    this.borrowHistory = []; 
    this.borrowedBooks = [];
}

function createBook(id, title, author, genre, numPages, summary, coverImgURL) {
    let newBook = new Book(id, title, author, genre, numPages, summary, coverImgURL);
    library.push(newBook);
    newBook.createTableRow(id, title, author); 

    return newBook;
}

function createUser(memberid, firstName, lastName) {
    // Validate there is no duplicate memberid
    let duplicate = users.filter(user => user.memberid === memberid);

    if (duplicate.length > 0) {
        return "duplicate"; 
    }
    let newUser = new User(memberid, firstName, lastName);
    users.push(newUser);

    return newUser;
}

Book.prototype.createTableRow = function () {
    let tableRow = {}; 

    const DUMMY_CELLS = 4; // Cells that do not need to be filled in at the moment
    const libraryTable = document.querySelector("#content table tbody");
    const row = document.createElement("tr");
    tableRow.element = row;
    
    row.setAttribute("data-book-id", this.id);

    const clickables = {
        edit: {
            wrapper: document.createElement("div"),
            img: document.createElement("img"),
            desc: "View / Edit Book",
            src: "./images/svg/edit.svg",
            class: "edit",
        },

        borrow: {
            wrapper: document.createElement("div"),
            img: document.createElement("img"),
            desc: "Borrow / Return Book",
            src: "./images/svg/book.svg",
            class: "borrow",
        },

        trash: {
            wrapper: document.createElement("div"),
            img: document.createElement("img"),
            desc: "Delete Book",
            src: "./images/svg/delete.svg",
            class: "delete",
        }
    }

    tableRow.clickables = clickables; 

    const cells = {
        id: document.createElement("td"),
        title: document.createElement("td"),
        author: document.createElement("td"),
        borrower: document.createElement("td"),
        from: document.createElement("td"),
        to: document.createElement("td"),
        duration: document.createElement("td"),
        bookAvailability: document.createElement("td"),
        icons: document.createElement("td"),
    }

    tableRow.cells = cells;

    for (let key in clickables) {
        let each = clickables[key];
        each.wrapper.classList.add("icon");
        each.wrapper.classList.add(each.class);
        each.wrapper.title = each.desc;
        each.img.src = each.src;
        each.img.altText = each.desc;
        each.wrapper.appendChild(each.img);
        cells.icons.appendChild(each.wrapper);
    };

    cells.id.textContent = this.id === "" ? "xxxxxx" : this.id;
    cells.title.textContent = this.title === "" ? "-" : this.title;
    cells.author.textContent = this.author === "" ? "-" : this.author;
    cells.bookAvailability.textContent = "Available";
    cells.bookAvailability.classList.add("available"); 
    cells.borrower.textContent = "-";
    cells.from.textContent = "-";
    cells.to.textContent = "-";
    cells.duration.textContent = "-";
    for (let key in cells) {
        let each = cells[key];
        row.appendChild(each);
    }

    libraryTable.append(row);

    tableRows.push(tableRow); 
} 

Book.prototype.addListenerForNewRow = function (editListenerCallBack, borrowListenerCallBack, deleteListenerCallBack) {
    tableRows.at(-1).clickables.edit.wrapper.bookState = "existing";   
    tableRows.at(-1).clickables.edit.wrapper.addEventListener("click", editListenerCallBack);
    tableRows.at(-1).clickables.borrow.wrapper.addEventListener("click", borrowListenerCallBack);
    tableRows.at(-1).clickables.trash.wrapper.addEventListener("click", deleteListenerCallBack);
}

Book.prototype.computeBorrowStatus = function () {
    let isBorrowed = this.borrower !== null && this.borrower !== "";  

    if (!isBorrowed) {return ["Available", "available"];}
        
    return today > this.expectedReturnDate? ["Not Available (Overdue)", "overdue"] : DateOps.diffDays(today, this.expectedReturnDate) < RETURN_ALERT? ["Not Available (Almost Overdue)", "almost-overdue"] : ["Not Available (Borrowed)", "borrowed"]; 
}

Book.prototype.createNewBorrowHistory = function() {
    const historicalItem = {
        borrower: this.borrower,
        borrowDate: this.borrowDate,
        expectedReturnDate: this.expectedReturnDate,
        actualReturnDate: null,
        expectedBorrowDuration: this.borrowDate !== null && this.expectedReturnDate !== null? DateOps.diffDays(this.borrowDate, this.expectedReturnDate) : -1,
        actualBorrowDuration: -1,
    }

    this.borrowHistory.push(historicalItem); 
}

Book.prototype.returnBook = function(dateActualReturn) {
    let latestBorrowRecord = this.borrowHistory.at(-1);

    this.actualReturnDate = dateActualReturn; 
    latestBorrowRecord["actualReturnDate"] = dateActualReturn;

    // Calculate the duration borrowed
    latestBorrowRecord["actualBorrowDuration"] = latestBorrowRecord.borrowDate != null && dateActualReturn !== null?  DateOps.diffDays(this.borrowDate, this.actualReturnDate) : -1;
    this.borrower = null;
    this.borrowDate = null;
    this.expectedReturnDate = null;
    this.actualReturnDate = null;
}

Book.prototype.returnBookView = function(affectedRow) {
    affectedRow.cells.bookAvailability.textContent = "Available";
    affectedRow.cells.bookAvailability.className = "";
    affectedRow.cells.bookAvailability.classList.add("available"); 
    affectedRow.cells.borrower.textContent = "-";
    affectedRow.cells.from.textContent = "-";
    affectedRow.cells.to.textContent = "-";
    affectedRow.cells.duration.textContent = "-";
}

Book.prototype.populateBorrowHistoryTable = function() {
    const parentTable = modals.borrowOps.querySelector("#book-borrow-history tbody");
    removeAllChildren(parentTable); // Remove all children
    this.borrowHistory.forEach(each => {
        this.addBorrowHistoryRow(each);
    })
}

Book.prototype.addBorrowHistoryRow = function(eachHistoryItem) {
    const parentTable = modals.borrowOps.querySelector("#book-borrow-history tbody");
    const trow = document.createElement("tr");
    const username = document.createElement("td");
    const from = document.createElement("td");
    const to = document.createElement("td");

    username.textContent = eachHistoryItem.borrower.firstName + " " + eachHistoryItem.borrower.lastName;
    from.textContent = DateOps.parseDateObj(eachHistoryItem.borrowDate);
    to.textContent = eachHistoryItem.actualReturnDate? DateOps.parseDateObj(eachHistoryItem.actualReturnDate) : "To Be Returned @ " + DateOps.parseDateObj(eachHistoryItem.expectedReturnDate);  

    trow.appendChild(username);
    trow.appendChild(from);
    trow.appendChild(to);

    parentTable.appendChild(trow);

    return trow;
}

User.prototype.createNewBorrowHistory = function(selectedBook, dateBorrow, dateExpectedReturn) {
    const historicalItem = {
        book: selectedBook,
        borrowDate: dateBorrow,
        expectedReturnDate: dateExpectedReturn,
        actualReturnDate: null,
        expectedBorrowDuration: dateBorrow !== null && dateExpectedReturn !== null? DateOps.diffDays(dateBorrow, dateExpectedReturn) : -1,
        actualBorrowDuration: -1,
    }

    this.borrowHistory.push(historicalItem); 
    this.borrowedBooks.push(selectedBook);
}

User.prototype.returnBook = function(book, dateActualReturn) {
    let latestBorrowRecord = this.borrowHistory.at(-1);
    latestBorrowRecord["actualReturnDate"] = dateActualReturn;

    // Calculate the duration borrowed
    latestBorrowRecord["actualBorrowDuration"] = latestBorrowRecord.borrowDate != null && dateActualReturn !== null?  DateOps.diffDays(latestBorrowRecord.borrowDate, dateActualReturn) : -1; 

    // Find the book to be returned and delete from borrowedBooks array
    let ind = this.borrowedBooks.findIndex(borrowedBook => borrowedBook.id === book.id);
    this.borrowedBooks.splice(ind, 1);
}