// Trials, Enrollment & Waitlist Forms

document.addEventListener("DOMContentLoaded", function () {
    const addChildBtn = document.getElementById("addChildBtn");
    const removeChildBtn = document.getElementById("removeChildBtn");
    const childrenContainer = document.getElementById("childrenContainer");

    let childCount = 1;

    addChildBtn.addEventListener("click", () => {
        childCount++;

        const childSection = document.createElement("div");
        childSection.classList.add("child-section");

        childSection.innerHTML = `
            <h2 style = "margin-top: 90px;">Child ${childCount}</h2>
            <div class = "field-left">
                <input type = "t\ext" id = "child${childCount}FirstName" name = "child${childCount}FirstName" placeholder = "First Name" required>
            </div>

            <div class = "field-right">
                <input type = "text" id="child${childCount}LastName" name = "child${childCount}LastName" placeholder = "Last Name" required>
            </div>

            <div class = "field">
                <label for = "child${childCount}DOB">Birth Date</label>
                <input type = "date" id = "child${childCount}DOB" name = "child${childCount}DOB" required>
            </div>
        `;

        childrenContainer.appendChild(childSection);

        // Show "Remove" button if more than one child
        if (childCount > 1) {
            removeChildBtn.style.display = "inline-block";
        }
    });

    removeChildBtn.addEventListener("click", () => {
        if (childCount > 1) {
            const lastChild = childrenContainer.querySelector(".child-section:last-of-type");
            if (lastChild) {
                childrenContainer.removeChild(lastChild);
                childCount--;
            }
        }

        // Hide button if only one child remains
        if (childCount === 1) {
            removeChildBtn.style.display = "none";
        }
    });
});