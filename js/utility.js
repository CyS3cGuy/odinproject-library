// Random between min and max included
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Get all parent elements of a child, return as array
// Optionally specify the specific parent element and return the DOM element
function getParent(child, targetParentSelector = null) {
    let els = [];
    let prevChild = null;
    while (child) {
        if (targetParentSelector) {
            if (child.querySelector(targetParentSelector)) {
                return prevChild; 
            }
        }
        els.unshift(child);
        prevChild = child; 
        child = child.parentElement; 
    }
    return els;
}

function createFileInput() {
    const fileInput = document.createElement("input"); 
    fileInput.type = "file";
    fileInput.setAttribute("accept", "image/");
    
    return fileInput;
}