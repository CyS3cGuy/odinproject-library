const tableLibrary = document.querySelector("#content table");
const virtualFileInput = createFileInput();
const reader = new FileReader();


tableLibrary.querySelectorAll(".icon.edit").forEach(eachEditIcon => {
    eachEditIcon.bookState = "existing";
    eachEditIcon.addEventListener("click", showBookOpsModal, false);
})

modals.bookOps.querySelector("#book-cover .add-photo-trigger").addEventListener("click", () => virtualFileInput.click());

// Call reset of all the metadata and buffer variables of a book
modals.bookOps.querySelectorAll(".close-modal").forEach(eachButton => {
    eachButton.addEventListener("click", () => buffer.book.func.reset.call(buffer.book));
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
Array.from(modals.bookOps.querySelectorAll(".form-set .input")).forEach((eachInput, ind, allInputs) => {
    let saveButton = modals.bookOps.querySelector(".save-btn");
    eachInput.addEventListener("input", () => {


        if (buffer.book.metadata.state === "existing") {
            let bookSelected = buffer.book.instance;
            let inputVal = eachInput.value;
            let currentField = eachInput.getAttribute("data-input-field");

            eachInput.changed = bookSelected[currentField] === inputVal ? false : true;

            // Check for whether any of the inputs have been changed
            let overallChangeStatus = false;

            allInputs.forEach(each => {

                overallChangeStatus = overallChangeStatus || each.changed;
            })
            saveButton.disabled = overallChangeStatus ? false : true;


        }
    })
})

// Clicking save button should update the real book object to the changed value and also update the table DOM display
modals.bookOps.querySelector(".save-btn").addEventListener("click", e => {
    e.preventDefault(); // Don't close the dialog upon save. define ourselves
    
    let allInputs = modals.bookOps.querySelectorAll(".form-set .input"); 

    allInputs.forEach(each => {
        let currentField = each.getAttribute("data-input-field");


        if (buffer.book.metadata.state === "existing") {
            

            let bookSelected = buffer.book.instance;
            let rowObj = tableRows.find(row => row.cells.id.textContent === buffer.book.metadata.idSelected);
            let pointedCell = rowObj.cells[currentField];

            
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
        }

        // Reset the changed variable in the input
        each.changed = false;
    })

    e.currentTarget.disabled = true; 

    allInputs.forEach(each => each.disabled = true); 
})

// For fetching files
virtualFileInput.addEventListener("change", e => { 
    const pic = e.target.files[0];
    if (pic) {
        reader.readAsDataURL(pic);
        modals.bookOps.querySelector(".save-btn").disabled = false;
    }
});

// For reading photos and update it as background cover photo 
reader.addEventListener("load", e => updateCoverPhoto(e.target.result, buffer.book.metadata));

// Show the book operation dialog
function showBookOpsModal(evt) {
    buffer.book.metadata.state = evt.currentTarget.bookState;


    // If it is existing book, we want to disable the input
    if (buffer.book.metadata.state === "existing") {
        buffer.book.metadata.idSelected = getParent(evt.currentTarget, "tr").getAttribute("data-book-id");


        buffer.book.instance = library.find(bk => buffer.book.metadata.idSelected === bk.id); 

        let book = buffer.book.instance;

        // Disabling all inputs and save button
        modals.bookOps.querySelectorAll(".form-set").forEach(eachSet => {
            eachSet.querySelector(".input").disabled = true;

            let starRequired = eachSet.querySelector(".aria-required");
            if (starRequired) {
                starRequired.style.display = "none";
            }
        })

        modals.bookOps.querySelector(".save-btn").disabled = true;

        // then we want to populate the input with existing data
        modals.bookOps.querySelector("#book-cover").style.backgroundImage = book.coverImgURL ? `url(${book.coverImgURL})` : "none";
        modals.bookOps.querySelector("#book-id").value = book.id;
        modals.bookOps.querySelector("#book-title").value = book.title;
        modals.bookOps.querySelector("#book-author").value = book.author;
        modals.bookOps.querySelector("#book-genre").value = book.genre;
        modals.bookOps.querySelector("#book-title").value = book.title;
        modals.bookOps.querySelector("#book-pages").value = book.numPages;
        modals.bookOps.querySelector("#book-summary").value = book.summary;
    }

    modals.bookOps.showModal();
};




function updateCoverPhoto(rawPicData, bookObj) {
    bookObj.coverImgURL = rawPicData;
    modals.bookOps.querySelector("#book-cover").style.backgroundImage = `url(${rawPicData})`;
}