const testArray = [[1, 2, 3, 4, 5, 6, 7, 8, 9,10], [8, 9, 10, 11, 12, 13], [15, 16, 17, 18, 19, 20],[15, 16, 17, 18, 19, 20]];
const colimbCount = 5;

function createShowCard(rowId,cardId) {
    const card = document.createElement('div');
    card.classList.add('show');
    card.setAttribute("show-id", cardId);

    const displayLink = document.createElement('button');
    displayLink.classList = "project-link"

    displayLink.addEventListener("click", () => {
        const link = project.link + "?scrollTarget=" + i;
        window.location.href = link;
    });

    const displayImage = document.createElement('img');
    displayImage.classList.add("project-image")
    //displayImage.src = "Images/" + project.imageName;
    //displayImage.alt = project.alt;

    const diaplayName = document.createElement('h2');
    diaplayName.classList.add('project-name');
    diaplayName.textContent = "test" + testArray[rowId][cardId];


    displayLink.appendChild(displayImage);
    card.appendChild(displayLink);
    card.appendChild(diaplayName);

    return card;
}
function UpdateShowCard(card, id) {
    const displayImage = card.querySelector(".project-image");

    const diaplayName = card.querySelector(".project-name");
    diaplayName.textContent = "test" + id;

}
function createRow(id) {
    offset = 0;
    const row = document.createElement('section');
    row.classList.add('displayRow');
    row.setAttribute("row-id", id);

    const displayItems = document.createElement('li');
    displayItems.classList.add("displayItems");
    const itemsArr = testArray[id];
    for (let index = 0; index < colimbCount; index++) {
        displayItems.appendChild(createShowCard(id,index));
    }


    const backBtn = document.createElement('button');
    backBtn.classList.add("scrollBtn");
    backBtn.classList.add("backScrollBtn");
    backBtn.textContent = "<";
    backBtn.addEventListener("click", () => { Scroll(id, "down") });
    if(offset - 1 <= 0){ 
        backBtn.classList.add("disable");
    }
     

    const forwerdBtn = document.createElement('button');
    forwerdBtn.classList.add("scrollBtn");
    forwerdBtn.classList.add("forwerScrollBtn");
    forwerdBtn.textContent = ">";
    forwerdBtn.addEventListener("click", () => { Scroll(id, "up") });
    if(offset >=itemsArr.length){ 
        forwerdBtn.classList.add("disable");
    }

    row.appendChild(backBtn);
    row.appendChild(displayItems)
    row.appendChild(forwerdBtn);
    return row
}

function Scroll(id, direction) {
    
    const itemsArr = testArray[id];
    const row = document.querySelector(".displayRow[row-id=\"" + String(id) + "\"]");
    console.log(row);
    const shows = row.querySelectorAll(".show");
    console.log(shows);

    for (let index = 0; index < shows.length; index++) {
        const dis = shows[index];
        oldShow = Number(dis.getAttribute("show-id"));
        console.log("Position:"+ index +":" + oldShow);
        
        var newID = oldShow + colimbCount;
        if(direction == "down"){
            newID = oldShow - colimbCount;
        }

        console.log(newID);
        if (newID  > itemsArr.length-1 ) {
            newID = newID - itemsArr.length;   
        } else if (newID < 0) {
                newID = newID + itemsArr.length;
        }
        UpdateShowCard(dis, itemsArr[newID])
        dis.setAttribute("show-id", newID);

        const back = row.querySelector(".backScrollBtn").classList.remove("disable");
    }
}
    
for (let index = 0; index < testArray.length; index++) {
    const contaner = document.querySelector("#displayAria");
    const row = createRow(index);
    contaner.appendChild(row);
    
}
