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

                this.metadata.idSelected = null;
                this.metadata.state = null;
                this.metadata.coverImgURL = null;
            }
        },

        borrow: {
            instance: null,

            metadata: {
                idSelected: null,
            },

            func: {
                reset: function() {
                    this.instance = null;
                    this.metadata.idSelected = null;
                }
            }
        }
    },

    user: {
        instance: null,

        func: {
            findUser: function (memberid) {
                return users.find(user => user.memberid === memberid);
            },

            reset: function() {
                this.instance = null;
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
            getUserSelection: function() {
                const selectedRadio = modals.borrowOps.querySelector(`.user-status-selection input[name="user-status"]:checked`);
                return selectedRadio.value; 
            },

            resetUserSelection: function() {
                modals.borrowOps.querySelector(".user-status-selection").disabled = false; 
                modals.borrowOps.querySelector(`#rd-existing`).click(); // Select existing as user status
            },

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

            makeInputsRequired: function (criteria, isRequired) {
                let selector = ".for-" + criteria + " input";
                modals.borrowOps.querySelectorAll(selector).forEach(each => each.required = isRequired);
            },

            hideInputsVisibilityForExistingUser: function (hide) {
                modals.borrowOps.querySelectorAll(".show-existing-temp").forEach(each => {
                    if (hide) {
                        each.classList.remove("show-existing-temp");
                        each.classList.add("hide-existing-temp"); 
                        
                    }
                })

                modals.borrowOps.querySelectorAll(".hide-existing-temp").forEach(each => {
                    if (!hide) {
                        each.classList.remove("hide-existing-temp");
                        each.classList.add("show-existing-temp"); 
                        
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
                
            },

            checkBtnEnableCriteria: function(criteria, notCriteria) {
                // Note that the notCriteria argument refers to the string selector which we do not want to include
                // For example, if I have a list of elements with class name of "borrow", out of which, we have one of the elements in which we want to exclude
                // we can specify an exclusion selector as part of "notCriteria"
                let btnSelector = "." + criteria + "-btn";
                let inputSelector = ".for-" + criteria + " input";
                let hasAllFilled = true;
                modals.borrowOps.querySelectorAll(inputSelector).forEach(each => {
                    if (!(notCriteria && each.parentElement.classList.contains("for-" + notCriteria))) {
                        hasAllFilled = hasAllFilled && each.value !== "";
                    }
                })

                modals.borrowOps.querySelector(btnSelector).disabled = hasAllFilled? false : true;   
            },

            resetAllInputsVal: function() {
                
                modals.borrowOps.querySelectorAll(".form-set input").forEach(each => {
                    each.value = "";
                    each.dispatchEvent(new Event("input")); // Ensure the event is fired so that the listener at app.js can operate, like disabling the button
                    modals.borrowOps.querySelectorAll(".error .message").forEach(each => each.classList.add("hide"));
                });
            },

            validateReturnDate: function(isExpectedReturn) {
                const borrowDateDOM = modals.borrowOps.querySelector("#user-borrow-date");
                const expectedReturnDOM = modals.borrowOps.querySelector("#user-expected-return-date");
                const returnDOM = modals.borrowOps.querySelector("#user-return-date");

                let borrowDate = new Date(borrowDateDOM.value);

                let returnDate = isExpectedReturn? new Date(expectedReturnDOM.value) : new Date(returnDOM.value); 

                if (returnDate <= borrowDate) {
                    if (isExpectedReturn) {
                        expectedReturnDOM.setCustomValidity("Expected return date must be greater than borrow date.");
                    } else {
                        returnDOM.setCustomValidity("Return date must be greater than borrow date.");
                    }
                } else {
                    // ✅ Properly clear the validation message
                    if (isExpectedReturn) {
                        expectedReturnDOM.setCustomValidity("");
                    } else {
                        returnDOM.setCustomValidity("");
                    } 
                }
            },

            resetModalUI: function() {
                modals.func.borrowOps.resetUserSelection();
                modals.func.borrowOps.resetAllInputsVal();

            },

        },
        confirmOps: {

        }
    },
    
};
