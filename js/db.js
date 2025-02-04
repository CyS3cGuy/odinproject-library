const library = [];
const users = [];

// Store temporary data as buffer before saving as permanent
const buffer = {
    book: {
        instance: null,
        metadata: {
            idSelected: null,
            state: null,
        },
        func: {
            reset: function () {
                this.instance = null; 
                // this.instance.id = "xxxxxx"; 
                // this.instance.title = "";
                // this.instance.author = "";
                // this.instance.genre = "";
                // this.instance.numPages = "";
                // this.instance.summary = "";
                // this.instance.coverImgURL = "";
        
                // this.instance.borrower = "";
                // this.instance.borrowDate = "";
                // this.instance.returnDate = "";
        
                this.metadata.idSelected = null;
                this.metadata.state = null;  
            }
        },
    },

    user: {
        instance: null,
    },
}

// Create initial users
for (letter of "ABCDEFGHIJ") {
    let birthYear = random(65, 99).toString();
    let birthMonth = random(1, 12).toString();
    let birthDay = random(1, 28).toString();
    let middleTwoDigits = random(1, 99).toString();
    let lastFourDigits = random(1, 9999).toString();

    let id = birthYear + birthMonth.padStart(2, "0") + birthDay.padStart(2, "0") + middleTwoDigits.padStart(2, "0") + lastFourDigits.padStart(4, "0");


    createUser(id, letter + letter + letter, "User");

}

// Create initial books 
for (let i = 0; i < 7; i++) {
    let bookID = random(1, 999999).toString().padStart(6, "0");
    let bookTitle = "Book " + i.toString().padStart(3, "0");
    let bookAuthor = "Author " + i.toString().padStart(3, "0");
    let bookGenre = random(0, 1) === 0 ? "" : ["Thriller", "Romance", "Mystery", "Novel", "Kid"][random(0, 4)];
    let bookNumPages = random(0, 1) === 0 ? "" : random(10, 3000).toString(); 
    let bookSummary = random(0, 1) === 0 ? "" : "Hello World, my friend!! ".repeat(random(3, 15));

    createBook(bookID, bookTitle, bookAuthor, bookGenre, bookNumPages, bookSummary);
}

// Define modals
const modals = {
    bookOps: Array.from(document.querySelectorAll("dialog"))[0],
    borrowOps: Array.from(document.querySelectorAll("dialog"))[1],
    confirmOps: Array.from(document.querySelectorAll("dialog"))[2],
};
