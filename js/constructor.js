const tableRows = []; 

// About books

function Book(id, title, author, genre, numPages, summary, coverImgURL) {
    this.id = id ? id : "xxxxxx";
    this.title = title ? title : "";
    this.author = author ? author : "";
    this.genre = genre ? genre : "";
    this.numPages = numPages ? numPages : ""; 
    this.summary = summary ? summary : "";
    this.coverImgURL = coverImgURL ? coverImgURL : "";

    this.borrower = "";
    this.borrowDate = "";
    this.returnDate = "";
}
  
// About Users
function User(memberid, firstName, lastName) {
    this.memberid = memberid;
    this.firstName = firstName;
    this.lastName = lastName ? lastName : null;

    this.borrowedBooks = [];
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