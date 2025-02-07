const tableRows = []; 

const RETURN_ALERT = 4;  
const TODAY_YEAR = 2025;
const TODAY_MONTH = 5;
const TODAY_DAY = 13; 
const today = new Date(TODAY_YEAR, TODAY_MONTH, TODAY_DAY); 

document.querySelector("#header-date").textContent = DateOps.parseDate(today.getFullYear(), today.getMonth(), today.getDate());       

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
    this.borrowDate = "";
    this.expectedReturnDate = ""; 
    this.actualReturnDate = "";
    this.borrowHistory = []; 
}
  
// About Users
function User(memberid, firstName, lastName) {
    this.memberid = memberid;
    this.firstName = firstName;
    this.lastName = lastName ? lastName : null;

    this.borrowedBooks = [];
    this.borrowHistory = []; 
}

function createBook(id, title, author, genre, numPages, summary, coverImgURL) {
    let newBook = new Book(id, title, author, genre, numPages, summary, coverImgURL);
    library.push(newBook);
    newBook.createTableRow(id, title, author); 
}

function createUser(memberid, firstName, lastName) {
    let newUser = new User(memberid, firstName, lastName);
    users.push(newUser);
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

Book.prototype.addEditListenerForNewRow = function (listenerCallBack) {
    tableRows.at(-1).clickables.edit.wrapper.bookState = "existing";   
    tableRows.at(-1).clickables.edit.wrapper.addEventListener("click", listenerCallBack);
}

Book.prototype.computeBorrowStatus = function () {
    let isBorrowed = this.borrower !== null && this.borrower !== "";  

    if (!isBorrowed) {return "Available";}
        
    return today > this.expectedReturnDate? "Not Available (Overdue)" : DateOps.diffDays(today, this.expectedReturnDate) < RETURN_ALERT? "Not Available (Almost Overdue)" : "Not Available (Borrowed)";
}