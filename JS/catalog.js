const genres = ["Action", "Sci-Fi", "Adventure", "Comedy", "Romance", "Horror", "Slice Of Life", "Thriller", "Fantasy", "Mecha", "Mystery"];
var controllers = [];
var showArray = []
const colimbCount = 7;
const showPerGenre = 30;
const prizeScreen = "prize.html"

const query = `
  query ExampleQuery($genre: String, $page: Int, $perPage: Int ) {
  Page(page: $page, perPage: $perPage) {
    media(genre: $genre, type: ANIME, isAdult: false, sort: POPULARITY_DESC) {
      title {
        english
        romaji
      }
      coverImage {
        extraLarge
        large
        color
      }
        id
    }
    pageInfo {
      total
      hasNextPage
      currentPage
    }
  }
}
`;

async function getShowsByGenre(genre, perPage = 30, page = 1, ) {
  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { genre, page, perPage },
    }),
  });

   if (!response.ok) {
    throw new Error(`AniList error: ${response.status}`);
  }

  const json = await response.json();
  return json.data.Page;
}

function createShowCard(rowId, cardId) {
    const card = document.createElement('div');
    card.classList.add('show');
    card.setAttribute("show-id", cardId);

    const displayLink = document.createElement('button');
    displayLink.classList = "project-link"

    const displayImage = document.createElement('img');
    displayImage.classList.add("project-image")
    
    //displayImage.alt = project.alt;

    const diaplayName = document.createElement('h3');
    diaplayName.classList.add('project-name');
    
    try{
    if (cardId >= 0) {
        const show = showArray[rowId][cardId];
        displayImage.src = show.coverImage.extraLarge;
        diaplayName.textContent = show.title.english || show.title.romaji;
        diaplayName.style.color = show.coverImage.color

        displayLink.addEventListener("click", () => {
        const link = prizeScreen + "?" + show.id;
        window.location.href = link;
    }, { signal: controllers[rowId].signal });
    }
    } catch (error) {
    console.error("row: "+ rowId + ", card:"+ cardId + error);
  }
    displayLink.appendChild(displayImage);
    card.appendChild(displayLink);
    card.appendChild(diaplayName);

    return card;
}
function UpdateShowCard(card, show, rowId) {
    const displayImage = card.querySelector(".project-image");
    displayImage.src = show.coverImage.extraLarge;
    const diaplayName = card.querySelector(".project-name");
    diaplayName.textContent = show.title.english || show.title.romaji;
    const displaylink = card.querySelector(".project-link");
    displaylink.addEventListener("click", () => {
        const link = prizeScreen + "?" + show.id;
        window.location.href = link;
    }, { signal: controllers[rowId].signal });

}

function createRow(id) {
    offset = 0;
    const section = document.createElement('section');
    section.classList.add('displaySection');
    section.setAttribute("row-id", id);
    

    section.addEventListener('mouseenter', () => {
        EnableScrollBtn(id,true);
    });

    section.addEventListener('mouseleave', () => {
        EnableScrollBtn(id,false);
    });

    const header = document.createElement('h2');
    header.classList.add("displayHeader")
    header.textContent = genres[id];
    
    
    const row = document.createElement('section');
    row.classList.add('displayRow');
    row.setAttribute("scrolled", false);
    

    controllers[id] =  new AbortController();
    const displayItems = document.createElement('li');
    displayItems.classList.add("displayItems");
    var rowColimbCount = colimbCount
    while (showArray[id].length < rowColimbCount) {
        rowColimbCount = rowColimbCount - 1;
        console.log(rowColimbCount);
        row.setAttribute("short", true);
    }
    for (let index = 0; index < rowColimbCount; index++) {
       var card
        if (rowColimbCount == colimbCount) {
            card = createShowCard(id, index - 1);
            if (index == 0) {
                card.classList.add("disable");
            }
        } else {
            card = createShowCard(id, index);
        }
        
        displayItems.appendChild(card);
        
    }

    row.appendChild(displayItems)

    if (rowColimbCount > colimbCount-2){
        const backBtn = document.createElement('button');
        backBtn.classList.add("scrollBtn");
        backBtn.classList.add("backScrollBtn");
        backBtn.textContent = "<";
        backBtn.addEventListener("click", () => { Scroll(id, "down") });
        backBtn.classList.add("disable");

        

        const forwerdBtn = document.createElement('button');
        forwerdBtn.classList.add("scrollBtn");
        forwerdBtn.classList.add("forwerdScrollBtn");
        forwerdBtn.textContent = ">";
        forwerdBtn.addEventListener("click", () => { Scroll(id, "up") });
        forwerdBtn.classList.add("disable");   
        
        row.appendChild(backBtn);
        row.appendChild(forwerdBtn);
    }

    section.appendChild(header);
    section.appendChild(row);
    return section
}

function Scroll(id, direction) {
    
    const itemsArr = showArray[id];
    
    const section = document.querySelector(".displaySection[row-id=\"" + String(id) + "\"]");
    const row = section.querySelector(".displayRow")
    const shows = row.querySelectorAll(".show");
    //console.log(shows);
    controllers[id].abort();
    controllers[id] =  new AbortController();
    for (let index = 0; index < shows.length; index++) {
        const dis = shows[index];
        oldShow = Number(dis.getAttribute("show-id"));
        //console.log("Position:" + index + ":" + oldShow);
        
        var newID = oldShow + colimbCount - 2;
        if (direction == "down") {
            newID = oldShow - colimbCount + 2;
        }
            //console.log(newID);
            if (newID > itemsArr.length - 1) {
                newID = newID - itemsArr.length;
            } else if (newID < 0) {
                newID = newID + itemsArr.length;
            }

            UpdateShowCard(dis, itemsArr[newID],id)
            dis.setAttribute("show-id", newID);
    }

    
    if (row.getAttribute("scrolled") != "true") {
        shows[0].classList.remove("disable")
    }
    row.setAttribute("scrolled", true);
    const back = row.querySelector(".backScrollBtn").classList.remove("disable");
}
function EnableScrollBtn(id, state) {
    const section = document.querySelector(".displaySection[row-id=\"" + String(id) + "\"]");
    const row = section.querySelector(".displayRow");
    //console.log(row);
    const shows = row.querySelectorAll(".show");
    //console.log(shows);
    const back = row.querySelector(".backScrollBtn")
    const forwerd = row.querySelector(".forwerdScrollBtn")
    if (state) {
        if (row.getAttribute("scrolled") == "true") {
            back.classList.remove("disable");
        }
        
        forwerd.classList.remove("disable");
    } else {
        back.classList.add("disable");
        forwerd.classList.add("disable");
    }
    
} 
function AddColimb(rowId, cardId) {
    const section = document.querySelector(".displaySection[row-id=\"" + String(rowId) + "\"]");
    const row = section.querySelector(".displayRow");
    const display = row.querySelector(".displayItems");
    colimbCount++;
    display.appendChild(createShowCard(rowId,cardId));
}

async function loadAllGenres() {
  const results = await Promise.all(
    genres.map((genre) => getShowsByGenre(genre, showPerGenre))
    );

    showArray = results.map((result) => result.media);

    for (let i = 0; i < showArray.length; i++) {
    console.log(`--- ${genres[i]} ---`);
    for (const show of showArray[i]) {
      console.log(show.title.english ?? show.title.romaji);
    }
  }
}

function buildScreen(){
    for (let index = 0; index < genres.length; index++) {
        const contaner = document.querySelector("#displayAria");
        const row = createRow(index);
        contaner.appendChild(row);
    }
}

async function SetUpScreen() {
  try {
    await loadAllGenres();
    console.log('Data retereved.');

    await buildScreen();
    console.log('Screen built.');
    
  } catch (error) {
    console.error(error);
  }
}
async function getGenres() {
  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query: "query { GenreCollection }" }),
  });

  const json = await response.json();
  return json.data.GenreCollection;
}

getGenres().then(console.log);

SetUpScreen();
