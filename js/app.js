const tableLibrary = document.querySelector("#content table");
const addBookBtn = document.querySelector("#content #add-book-btn");
const virtualFileInput = createFileInput();
const reader = new FileReader();

modals.confirmOps.querySelector(".yes-btn").addEventListener("click", evt => {
    let confirmWhat = modals.confirmOps.temp.confirmWhat;

    if (confirmWhat === "deleteBook") {
        operateDeletion(modals.confirmOps.temp.var);
    } 
    else if (confirmWhat === "borrowBook") {
        operateBorrow();
    }

    else if (confirmWhat === "returnBook") {
        operateReturn();
    }

    else if (confirmWhat === "saveBook") {
        operateSave();
    }
})

tableLibrary.querySelectorAll(".icon.edit").forEach(eachEditIcon => {
    // Model
    eachEditIcon.bookState = "existing";
    eachEditIcon.addEventListener("click", showBookOpsModal);

    // View
})

tableLibrary.querySelectorAll(".icon.delete").forEach(eachDeleteIcon => {

    eachDeleteIcon.addEventListener("click", evt => {
        modals.confirmOps.temp = {
            confirmWhat: "deleteBook",
            confirmMessage: `delete book with title of "${buffer.book.func.findBook(getParent(eachDeleteIcon, "tr").getAttribute("data-book-id")).title}"?`,
            var: eachDeleteIcon,
        };

        modals.confirmOps.showModal();
        modals.func.confirmOps.updateMessage(modals.confirmOps.temp.confirmMessage);
    })
})

tableLibrary.querySelectorAll(".icon.borrow").forEach(eachBorrowIcon => {
    // Model
    eachBorrowIcon.addEventListener("click", initBorrowOpsModel);

    // View
    eachBorrowIcon.addEventListener("click", showBorrowOpsModal);


})

modals.borrowOps.addEventListener("close", () => {
    // Model
    buffer.book.borrow.func.reset.call(buffer.book.borrow);
    buffer.user.func.reset.call(buffer.user);

    // View
    modals.func.borrowOps.resetModalUI();
})

modals.borrowOps.querySelector("#rd-existing").addEventListener("click", () => {
    // View
    modals.func.borrowOps.disableInputsForExistingUser(true);
    modals.func.borrowOps.resetAllInputsVal();
    modals.func.borrowOps.hideInputsVisibilityForExistingUser(true);
    modals.func.borrowOps.makeInputsRequired("new", false);
})

modals.borrowOps.querySelector("#rd-new").addEventListener("click", () => {
    // View
    modals.func.borrowOps.disableInputsForNewUser(true);
    modals.func.borrowOps.resetAllInputsVal();
    modals.func.borrowOps.makeInputsRequired("new", true);
})

modals.borrowOps.querySelector("#user-search-member-id").addEventListener("keydown", evt => {
    const query = evt.currentTarget.value;

    if (evt.key === "Enter") {
        // Model
        buffer.user.instance = buffer.user.func.findUser(query) ? buffer.user.func.findUser(query) : null;

        // View
        if (buffer.user.instance) {
            modals.func.borrowOps.updateName(buffer.user.instance);
            modals.func.borrowOps.hideInputsVisibilityForExistingUser(false);
        }
        else {
            modals.func.borrowOps.updateName(null);
            modals.func.borrowOps.hideInputsVisibilityForExistingUser(true);
        }

    }
})

modals.borrowOps.querySelectorAll(".for-borrow").forEach(each => {
    each.querySelector("input").addEventListener("input", e => {
        if (modals.func.borrowOps.getUserSelection() === "existing") {
            modals.func.borrowOps.checkBtnEnableCriteria("borrow", "new");
        }
        else {

            modals.func.borrowOps.checkBtnEnableCriteria("borrow");
        }

    })
})

// Adding custom validation for return date
modals.borrowOps.querySelector("#user-expected-return-date").addEventListener("input", () => modals.func.borrowOps.validateReturnDate(true));
modals.borrowOps.querySelector("#user-return-date").addEventListener("input", () => modals.func.borrowOps.validateReturnDate(false));

modals.borrowOps.querySelector(".borrow-btn").addEventListener("click", evt => {
    evt.preventDefault() // Prevent submission. we will submit manually

    if (!modals.borrowOps.querySelector("#borrow-form").checkValidity()) {
        modals.borrowOps.querySelector("#borrow-form").reportValidity(); // Because this is not a submit event, we have to call this manually to report validity
    }

    else {
        if (modals.func.borrowOps.getUserSelection() === "existing" || modals.func.borrowOps.getUserSelection() === "new") {

            modals.confirmOps.temp = {
                confirmWhat: "borrowBook",
                confirmMessage: `lend book with title of "${buffer.book.borrow.instance.title}"?`,
                var: null,
            };

            modals.confirmOps.showModal();
            modals.func.confirmOps.updateMessage(modals.confirmOps.temp.confirmMessage);
        }
    }
})

modals.borrowOps.querySelector(".return-btn").addEventListener("click", evt => {
    evt.preventDefault() // Prevent submission. we will submit manually

    if (!modals.borrowOps.querySelector("#borrow-form").checkValidity()) {
        modals.borrowOps.querySelector("#borrow-form").reportValidity(); // Because this is not a submit event, we have to call this manually to report validity
    }

    else {

        modals.confirmOps.temp = { 
            confirmWhat: "returnBook",
            confirmMessage: `return book with title of "${buffer.book.borrow.instance.title}"?`,
            var: null,
        };

        modals.confirmOps.showModal();
        modals.func.confirmOps.updateMessage(modals.confirmOps.temp.confirmMessage);
    }
})

modals.bookOps.addEventListener("close", () => {
    // Model
    buffer.book.func.reset.call(buffer.book);

    // View
    modals.func.bookOps.resetInputVal();
    modals.func.bookOps.toggleInput(false);
    modals.func.bookOps.toggleSaveButton(true);
    modals.func.bookOps.toggleEditIcon(false);
})

addBookBtn.addEventListener("click", e => {
    let btn = e.currentTarget;
    btn.bookState = "new";

    showBookOpsModal(e);
})

modals.bookOps.querySelector("#book-cover .add-photo-trigger").addEventListener("click", () => virtualFileInput.click());

modals.bookOps.addEventListener("close", () => {
    // Model
    buffer.book.func.reset.call(buffer.book);

    // View
    modals.func.bookOps.resetInputVal();
    modals.func.bookOps.toggleInput(false);
    modals.func.bookOps.toggleSaveButton(true);
    modals.func.bookOps.toggleEditIcon(false);
})

modals.bookOps.querySelectorAll(".form-set .edit").forEach(eachEdit => {
    eachEdit.addEventListener("click", e => {
        let inputElement = eachEdit.previousElementSibling;
        inputElement.disabled = false;
    })
})

// Logic for the modals input
// Check if the input has been changed 
// Determine if the save button should be enabled or disabled 
Array.from(modals.bookOps.querySelectorAll(".form-set .input")).forEach(eachInput => {

    eachInput.addEventListener("input", () => {

        if (buffer.book.metadata.state === "existing") {
            let bookSelected = buffer.book.instance;
            let inputVal = eachInput.value;
            let currentField = eachInput.getAttribute("data-input-field");

            eachInput.changed = bookSelected[currentField] === inputVal ? false : true;

            // Check for whether any of the inputs have been changed and enable/disable save button
            modals.func.bookOps.toggleSaveButton(modals.func.bookOps.checkInputChanged());
        }
    })
})

// Clicking save button should update the real book object to the changed value and also update the table DOM display
modals.bookOps.querySelector(".save-btn").addEventListener("click", e => {
    e.preventDefault(); // Don't close the dialog upon save. define ourselves

    modals.confirmOps.temp = {
        confirmWhat: "saveBook",
        confirmMessage: `save the changes?`,
        var: null,
    };

    modals.confirmOps.showModal();
    modals.func.confirmOps.updateMessage(modals.confirmOps.temp.confirmMessage);
    

})

function operateSave() {
    let allInputs = modals.bookOps.querySelectorAll(".form-set .input");
    let bookOpsForm = modals.bookOps.querySelector("form");
    let currentField = "";

    if (buffer.book.metadata.state === "existing") {
        allInputs.forEach(each => {
            currentField = each.getAttribute("data-input-field");


            // Model 
            let bookSelected = buffer.book.instance;
            let rowObj = tableRows.find(row => row.cells.id.textContent === buffer.book.metadata.idSelected);
            let pointedCell = rowObj.cells[currentField];

            // View
            // If there is a change in the input value
            // update the book object
            if (each.changed) {
                bookSelected[currentField] = each.value;
            }

            // table will selectively display certain cells from book
            // so we need to check if the property of the cells exist.. for example, genre, summary does not have a place in the table cell itself, so "pointedCell" will fetch undefined as it cannot find the key-value pair
            if (pointedCell) {
                pointedCell.textContent = each.value;
            }


            // Reset the changed variable in the input
            each.changed = false;
        })

        modals.func.bookOps.toggleSaveButton(false); // disable the save button

        // Disable all inputs except the cover image
        modals.func.bookOps.toggleInput(true);

    } else {

        if (modals.func.bookOps.checkValidInputs()) {
            // Model
            let get = modals.func.bookOps.getInput;
            createBook(get("id"), get("title"), get("author"), get("genre"), get("numPages"), get("summary"), get("coverImgURL"));
            library.at(-1).addListenerForNewRow(showBookOpsModal, combineModelAndViewForBorrowOps, operateDeletion);

            // View
            bookOpsForm.submit();
        }
        else {
            bookOpsForm.reportValidity();
        }

    }
}

// For fetching files
virtualFileInput.addEventListener("change", e => {
    const pics = e.target.files;
    let pic = pics[0];
    if (pic) {
        reader.readAsDataURL(pic);
        modals.bookOps.querySelector(".save-btn").disabled = false;
    }

});

// For reading photos and update it as background cover photo 
reader.addEventListener("load", e => {
    // Model
    // Set to buffer first
    buffer.book.metadata.coverImgURL = e.target.result;

    // View
    modals.func.bookOps.setCoverImage(e.target.result);

    if (buffer.book.instance && e.target.result !== buffer.book.instance.coverImgURL) {
        modals.bookOps.querySelector("#book-cover").changed = true;
    }

    if (buffer.book.metadata.state === "existing") {
        // Check for whether any of the inputs have been changed and enable/disable save button
        modals.func.bookOps.toggleSaveButton(modals.func.bookOps.checkInputChanged());
    }

    virtualFileInput.value = null;

});

// Show the book operation dialog
function showBookOpsModal(evt) {
    buffer.book.metadata.state = evt.currentTarget.bookState;


    // If it is existing book, we want to disable the input
    if (buffer.book.metadata.state === "existing") {

        // Model
        buffer.book.metadata.idSelected = getParent(evt.currentTarget, "tr").getAttribute("data-book-id");
        buffer.book.instance = library.find(bk => buffer.book.metadata.idSelected === bk.id);

        let book = buffer.book.instance;

        // View

        // Disabling all inputs and save button
        modals.func.bookOps.toggleInput(true);
        modals.bookOps.querySelector(".save-btn").disabled = true;
        modals.bookOps.querySelector(".save-btn").textContent = "Save";

        // then we want to update DOM by populating the input with existing data
        modals.func.bookOps.setCoverImage(book.coverImgURL);
        modals.bookOps.querySelector("#book-id").value = book.id;
        modals.bookOps.querySelector("#book-title").value = book.title;
        modals.bookOps.querySelector("#book-author").value = book.author;
        modals.bookOps.querySelector("#book-genre").value = book.genre;
        modals.bookOps.querySelector("#book-title").value = book.title;
        modals.bookOps.querySelector("#book-pages").value = book.numPages;
        modals.bookOps.querySelector("#book-summary").value = book.summary;
    }

    else {
        // Model

        buffer.book.metadata.idSelected = generateBookID();

        // View
        modals.bookOps.querySelector("#book-id").value = buffer.book.metadata.idSelected;
        modals.bookOps.querySelector("#book-id").disabled = true;

        modals.bookOps.querySelector(".save-btn").textContent = "Create New";
        modals.func.bookOps.toggleEditIcon(true);
    }

    modals.bookOps.showModal();
};


function deleteBook(btnIcon) {
    // let btnIcon = evt.currentTarget;
    let associatedTableRow = getParent(btnIcon, "tr");
    let id = associatedTableRow.getAttribute("data-book-id");

    let associatedLibraryIndex = library.findIndex(book => book.id === id);
    btnIcon.parentIndex = associatedLibraryIndex;

    // Remove from library model
    library.splice(associatedLibraryIndex, 1);
}

function deleteBookTableRow(btnIcon) {
    // let btnIcon = evt.currentTarget;

    // remove from DOM
    tableRows[btnIcon.parentIndex].element.remove();

    // remove from the backend DOM array 
    tableRows.splice(btnIcon.parentIndex, 1);
}

function operateDeletion(evt) {
    deleteBook(evt);
    deleteBookTableRow(evt);
}

function initBorrowOpsModel(evt) {
    let id = getParent(evt.currentTarget, "tr").getAttribute("data-book-id");
    let bookInstance = library.find(book => book.id === id);
    buffer.book.borrow.metadata.idSelected = id;
    buffer.book.borrow.instance = bookInstance;
    buffer.user.instance = bookInstance.borrower;
}

function showBorrowOpsModal(evt) {
    let borrower = buffer.book.borrow.instance.borrower;
    let isBorrowed = borrower !== null && borrower !== "";

    modals.func.borrowOps.updateBookTitle(buffer.book.borrow.instance.title);
    modals.func.borrowOps.showBorrowStatus(buffer.book.borrow.instance.computeBorrowStatus());


    if (isBorrowed) {
        // Disable the fieldset and hide it.
        modals.borrowOps.querySelector(".user-status-selection").disabled = true;
        modals.borrowOps.querySelector(".user-status-selection").classList.add("hide");

        // Disable necessary inputs and make certain inputs required
        modals.func.borrowOps.disableInputsUponBorrowed(true);
        modals.func.borrowOps.makeInputsRequired("return", true);
        modals.func.borrowOps.makeInputsRequired("borrow", false);
        modals.func.borrowOps.makeInputsRequired("new", false);

        // Populate the inputs
        modals.borrowOps.querySelector("#user-first-name").value = borrower.firstName;
        modals.borrowOps.querySelector("#user-last-name").value = borrower.lastName;
        modals.borrowOps.querySelector("#user-borrow-date").value = DateOps.serializeDateObj(buffer.book.borrow.instance.borrowDate);
        modals.borrowOps.querySelector("#user-expected-return-date").value = DateOps.serializeDateObj(buffer.book.borrow.instance.expectedReturnDate);
    }
    else {

        // Enable the fieldset and unhide it.
        modals.borrowOps.querySelector(".user-status-selection").disabled = false;
        modals.borrowOps.querySelector(".user-status-selection").classList.remove("hide");

        // Disable necessary inputs and make certain inputs required
        modals.func.borrowOps.disableInputsForExistingUser(true);
        modals.func.borrowOps.makeInputsRequired("borrow", true);
        modals.func.borrowOps.makeInputsRequired("return", false);
        modals.func.borrowOps.makeInputsRequired("new", false);
    }

    buffer.book.borrow.instance.populateBorrowHistoryTable();

    modals.borrowOps.showModal();
}

function combineModelAndViewForBorrowOps(evt) {
    initBorrowOpsModel(evt);
    showBorrowOpsModal(evt);
}

function operateBorrowModel() {

    let memberid = modals.borrowOps.querySelector("#user-member-id").value;
    let firstName = modals.borrowOps.querySelector("#user-first-name").value;
    let lastName = modals.borrowOps.querySelector("#user-last-name").value;

    if (modals.func.borrowOps.getUserSelection() === "new") {
        buffer.user.instance = createUser(memberid, firstName, lastName);
    }

    if (buffer.user.instance && buffer.user.instance !== "duplicate") {
        buffer.book.borrow.instance.borrower = buffer.user.instance;
        buffer.book.borrow.instance.borrowDate = new Date(modals.borrowOps.querySelector("#user-borrow-date").value);
        buffer.book.borrow.instance.expectedReturnDate = new Date(modals.borrowOps.querySelector("#user-expected-return-date").value);
        buffer.book.borrow.instance.createNewBorrowHistory();
        buffer.user.instance.createNewBorrowHistory(buffer.book.borrow.instance, buffer.book.borrow.instance.borrowDate, buffer.book.borrow.instance.expectedReturnDate);
    }
}

function operateBorrowView() {
    let rowObj = tableRows.find(row => row.cells.id.textContent === buffer.book.borrow.metadata.idSelected); // We need this to update the table cell display

    // View
    if (buffer.user.instance && buffer.user.instance !== "duplicate") {
        // Make sure to hide the error if no error in program
        modals.borrowOps.querySelector("#user-duplicate").classList.add("hide");
        modals.borrowOps.querySelector("#user-not-created").classList.add("hide");

        // Update the cells
        // Note that month has to +1 because of how the getMonth() work where Jan is 0 and December is 11.
        rowObj.cells.borrower.textContent = buffer.user.instance.firstName + " " + buffer.user.instance.lastName;
        rowObj.cells.from.textContent = DateOps.parseDate(buffer.book.borrow.instance.borrowDate.getFullYear(), buffer.book.borrow.instance.borrowDate.getMonth() + 1, buffer.book.borrow.instance.borrowDate.getDate());
        rowObj.cells.to.textContent = DateOps.parseDate(buffer.book.borrow.instance.expectedReturnDate.getFullYear(), buffer.book.borrow.instance.expectedReturnDate.getMonth() + 1, buffer.book.borrow.instance.expectedReturnDate.getDate());
        rowObj.cells.duration.textContent = DateOps.diffDays(buffer.book.borrow.instance.borrowDate, buffer.book.borrow.instance.expectedReturnDate);
        rowObj.cells.bookAvailability.textContent = buffer.book.borrow.instance.computeBorrowStatus();

        modals.borrowOps.querySelector("#borrow-form").submit();
    }
    else {
        // Show error message 
        if (buffer.user.instance === "duplicate") {
            modals.borrowOps.querySelector("#user-duplicate").classList.remove("hide");
        }
        else {
            modals.borrowOps.querySelector("#user-not-created").classList.remove("hide");
        }
    }
}

function operateBorrow() {
    operateBorrowModel();
    operateBorrowView(); 
}

function operateReturnModel() {
    let dateReturn = new Date(modals.borrowOps.querySelector("#user-return-date").value);
    buffer.book.borrow.instance.returnBook(dateReturn);
    buffer.user.instance.returnBook(buffer.book.borrow.instance, dateReturn);
}

function operateReturnView() {
    let rowObj = tableRows.find(row => row.cells.id.textContent === buffer.book.borrow.metadata.idSelected);
    buffer.book.borrow.instance.returnBookView(rowObj);
    modals.borrowOps.querySelector("#borrow-form").submit();
}

function operateReturn() {
    operateReturnModel();
    operateReturnView();
}