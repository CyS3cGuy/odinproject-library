const BOOKID_LENGTH = 6;
const library = [];
const users = [];

// Store temporary data as buffer before saving as permanent
const buffer = {
    book: {
        instance: null,

        metadata: {
            idSelected: null,
            state: null,
            coverImgURL: null,
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
                this.metadata.coverImgURL = null;
            }
        },

        borrow: {
            instance: null,

            metadata: {
                idSelected: null,
            }
        }
    },

    user: {
        instance: null,
        metadata: {

        },

        func: {
            findUser: function (memberid) {
                return users.find(user => user.memberid === memberid);
            }
        }
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

// Create a predictable user
createUser("0000", "Adrian", "Eu");

// Create initial books 
for (let i = 0; i < 2; i++) {
    let bookID = random(1, 499999).toString().padStart(BOOKID_LENGTH, "0");
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
    func: {
        bookOps: {
            getInput: function (fieldName) {
                return Array.from(modals.bookOps.querySelectorAll(".form-set .input")).find(eachInput => eachInput.getAttribute("data-input-field") === fieldName).value;
            },

            resetInputVal: function () {
                modals.bookOps.querySelectorAll(".form-set .input").forEach(eachInput => {
                    eachInput.value = "";
                    eachInput.changed = false;
                });
                modals.func.bookOps.setCoverImage(null);
            },

            checkValidInputs: function () {
                let isValid = true;
                modals.bookOps.querySelectorAll(".form-set .input").forEach(eachInput => {

                    if (eachInput.validity) {
                        isValid = isValid && eachInput.validity.valid;
                    }
                });

                return isValid;
            },

            toggleInput: function (disable) {
                modals.bookOps.querySelectorAll(".form-set .input").forEach(eachInput => {
                    eachInput.disabled = disable;

                    let starRequired = eachInput.parentElement.querySelector(".aria-required");

                    if (starRequired) {
                        starRequired.style.display = disable ? "none" : "inline-block";
                    }
                });
            },

            toggleSaveButton: function (inputChanged) {
                modals.bookOps.querySelector(".save-btn").disabled = inputChanged ? false : true;
            },

            checkInputChanged: function () {
                let overallChangeStatus = false;
                modals.bookOps.querySelectorAll(".input").forEach(eachInput => {
                    overallChangeStatus = overallChangeStatus || eachInput.changed;
                })

                return overallChangeStatus;
            },

            setCoverImage: function (picURL) {
                modals.bookOps.querySelector("#book-cover").style.backgroundImage = picURL || picURL !== "" ? `url(${picURL})` : "none";
                modals.bookOps.querySelector("#book-cover").value = picURL || picURL !== "" ? picURL : ""; // set this value (even though not affecting the UI display for use later)
            },

            toggleEditIcon: function (disable) {
                modals.bookOps.querySelectorAll(".form-set .edit").forEach(eachEdit => {
                    eachEdit.style.display = disable ? "none" : "block";
                })
            },
        },
        borrowOps: {
            disableInputsUponBorrowed: function (disable) {
                modals.borrowOps.querySelectorAll("input").forEach(each => each.disabled = false);
                modals.borrowOps.querySelectorAll(".disable-upon-borrowed").forEach(each => each.querySelector("input").disabled = disable);
            },

            disableInputsForNewUser: function (disable) {
                modals.borrowOps.querySelectorAll("input").forEach(each => each.disabled = false);
                modals.borrowOps.querySelectorAll(".disable-new").forEach(each => each.querySelector("input").disabled = disable);
            },

            disableInputsForExistingUser: function (disable) {
                modals.borrowOps.querySelectorAll("input").forEach(each => each.disabled = false);
                modals.borrowOps.querySelectorAll(".disable-existing").forEach(each => each.querySelector("input").disabled = disable);
                modals.borrowOps.querySelector(".disable-existing-btn").disabled = disable;
            },

            hideInputsVisibilityForExistingUser: function (hide) {
                modals.borrowOps.querySelectorAll(".show-existing").forEach(each => {
                    if (hide) {
                        each.classList.remove("show-existing");
                        each.classList.add("hide-existing"); 
                        
                    }
                })

                modals.borrowOps.querySelectorAll(".hide-existing").forEach(each => {
                    if (!hide) {
                        each.classList.remove("hide-existing");
                        each.classList.add("show-existing"); 
                        
                    }
                })
            },

            showBorrowStatus: function (borrowStatus) {
                const borrowStatusLabel = modals.borrowOps.querySelector("#user-borrow-status");
                const nextActionLabel = modals.borrowOps.querySelector("#user-available-action");
                borrowStatusLabel.textContent = borrowStatus;

                if (borrowStatus === "Available") {
                    borrowStatusLabel.classList.add("borrow-available");
                    nextActionLabel.textContent = "Borrowed";
                }
                else if (borrowStatus.includes("Almost Overdue")) {
                    borrowStatusLabel.classList.add("borrow-almost-overdue");
                    nextActionLabel.textContent = "Returned";
                }
                else {
                    borrowStatusLabel.classList.add("borrow-overdue");
                    nextActionLabel.textContent = "Returned";
                }
            },

            updateBookTitle: function (title) {
                modals.borrowOps.querySelector(".selected-book").textContent = title;
            },

            updateName: function (user) {
                modals.borrowOps.querySelector("#user-first-name").value = user && user !== ""? user.firstName : "";
                modals.borrowOps.querySelector("#user-last-name").value = user && user !== ""? user.lastName : "";

                if (user && user !== "") {
                    modals.borrowOps.querySelector("#user-not-found").classList.add("hide");
                }
                else {
                    modals.borrowOps.querySelector("#user-not-found").classList.remove("hide"); 
                }
                
            }

        },
        confirmOps: {

        }
    },
};
