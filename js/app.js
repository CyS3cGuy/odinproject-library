const tableLibrary = document.querySelector("#content table");
const addBookBtn = document.querySelector("#content #add-book-btn");
const virtualFileInput = createFileInput();
const reader = new FileReader();


tableLibrary.querySelectorAll(".icon.edit").forEach(eachEditIcon => {
    // Model
    eachEditIcon.bookState = "existing";
    eachEditIcon.addEventListener("click", showBookOpsModal);

    // View
})

tableLibrary.querySelectorAll(".icon.delete").forEach(eachDeleteIcon => {
    // Model
    eachDeleteIcon.addEventListener("click", deleteBook);

    // View
    eachDeleteIcon.addEventListener("click", deleteBookTableRow);
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
            library.at(-1).addEditListenerForNewRow(showBookOpsModal); 

            // View
            bookOpsForm.submit();
        }
        else {
            bookOpsForm.reportValidity();
        }

    }

})

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


function deleteBook(evt) {
    let btnIcon = evt.currentTarget;
    let associatedTableRow = getParent(btnIcon, "tr");
    let id = associatedTableRow.getAttribute("data-book-id");

    let associatedLibraryIndex = library.findIndex(book => book.id === id);
    btnIcon.parentIndex = associatedLibraryIndex; 

    // Remove from library model
    library.splice(associatedLibraryIndex, 1); 
}

function deleteBookTableRow(evt) {
    let btnIcon = evt.currentTarget;
    
    // remove from DOM
    tableRows[btnIcon.parentIndex].element.remove(); 

    // remove from the backend DOM array 
    tableRows.splice(btnIcon.parentIndex, 1); 
}