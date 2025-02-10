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

function generateBookID() {
    let allIDs = library.map(book => +book.id); 

    // Possibility that there is no book at all at first place, so has to generate a random number at start
    let max = allIDs.length !== 0? Math.max(...allIDs) : random(1, 199999);

    return (max + 1).toString().padStart(BOOKID_LENGTH, "0"); 
}

function removeAllChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


const DateOps = {

    parseDate: function (year, month, day) {
        return day.toString().padStart(2,"0") + "/" + month.toString().padStart(2,"0") + "/" + year.toString().padStart(4, "0"); 
    }, 

    parseDateObj: function(dateObj) {
        return dateObj.getDate().toString().padStart(2,"0") + "/" + (dateObj.getMonth()+1).toString().padStart(2, "0") + "/" + dateObj.getFullYear().toString().padStart(4, "0");
    },

    serializeDateObj(dateObj) {
        return dateObj.toISOString().slice(0, 10); 
    },

    diffDays: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();
 
        return Math.floor((t2-t1)/(24*3600*1000));
    },
 
    diffWeeks: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();
 
        return parseInt((t2-t1)/(24*3600*1000*7));
    },
 
    diffMonths: function(d1, d2) {
        var d1Y = d1.getFullYear();
        var d2Y = d2.getFullYear();
        var d1M = d1.getMonth();
        var d2M = d2.getMonth();
 
        return (d2M+12*d2Y)-(d1M+12*d1Y);
    },
 
    diffYears: function(d1, d2) {
        return d2.getFullYear()-d1.getFullYear();
    }
}