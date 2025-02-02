// Create initial users
for (letter of "ABCDEFGHIJ") {
    let birthYear = random(65, 99).toString();
    let birthMonth = random(1, 12).toString(); 
    let birthDay = random(1, 28).toString();
    let middleTwoDigits = random(1, 99).toString();
    let lastFourDigits = random(1, 9999).toString();
    
    let id = birthYear + birthMonth.padStart(2,"0") + birthDay.padStart(2, "0") + middleTwoDigits.padStart(2, "0") + lastFourDigits.padStart(4, "0");


    createUser(id, letter + letter + letter, "User");
    
}

// Create initial books 
for (let i = 0; i < 7; i++) {
    let bookID = random(1, 999999).toString().padStart(6, "0");
    let bookTitle = "Book " + i.toString().padStart(3, "0");
    let bookAuthor = random(0, 1) === 0? null : "Author " + i.toString().padStart(3, "0");
    let bookGenre = random(0, 1) === 0? null : ["Thriller", "Romance", "Mystery", "Novel", "Kid"][random(0, 4)];
    let bookNumPages = random(0, 1) === 0? null : random(10, 3000); 
    let bookSummary = random(0, 1) === 0? null : "Hello World, my friend!! ".repeat(random(3, 15)); 

    createBook(bookID, bookTitle, bookAuthor, bookGenre, bookNumPages, bookSummary);  
}


