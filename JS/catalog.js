function createProjectCard() {
    const card = document.createElement('div');
    card.classList.add('project');
    card.setAttribute("project-id", 1);

    const displayLink = document.createElement('button');
    displayLink.classList = "project-link"

    displayLink.addEventListener("click", () => {
        const link =  project.link + "?scrollTarget=" + i;
        window.location.href = link;
    });

    const displayImage = document.createElement('img');
    displayImage.classList.add("project-image")
    //displayImage.src = "Images/" + project.imageName;
    //displayImage.alt = project.alt;

    const diaplayName = document.createElement('h2');
    diaplayName.classList.add('project-name');
    diaplayName.textContent = "test";


    displayLink.appendChild(displayImage);
    card.appendChild(displayLink);
    card.appendChild(diaplayName);

    return card;
}
for (let index = 0; index < 4; index++) {
    const contaner = document.querySelector(".displayItems");
    const card = createProjectCard();
    contaner.appendChild(card);
    
}
