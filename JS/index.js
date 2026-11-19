const queryInputs = { genreIn: [""], perPage: 100, page: 1, durationGreater: 0 };
const criteria = "$genreIn: [String], $durationGreater: Int";
const criteriaReverse = " genre_in: $genreIn, duration_greater: $durationGreater";
const prizeScreen = "HTML/prize.html"
var shows = [];
const ganreOptions = ["Action", "Adventure", "Comedy", "Drama", "Ecchi", "Fantasy", "Horror", "Mahou Shoujo", "Mecha", "Music", "Mystery", "Psychological", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller" ]
const customQuery = `
query CustomQuery(`+ criteria +`, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(`+ criteriaReverse +`,  type: ANIME, isAdult: false, sort: POPULARITY_DESC) {
      id
      title {
        romaji
        english
      }
      genres
    }
  }
}
`;
const displayQuery = `
query CustomQuery($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media( type: ANIME, sort: TRENDING_DESC, isAdult: false) {
      coverImage {
      extraLarge
      }
    }
  }
}
`; 


async function getShow(inputs,query) {
  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: inputs,
    }),
  });

   if (!response.ok) {
    throw new Error(`AniList error: ${response.status}`);
  }

  const json = await response.json();
  return json.data.Page.media;
}

async function GetShowList() {
    const showstemp = await getShow(queryInputs, customQuery);
    shows = await showstemp;
    console.log("shows found:" + shows.length)
}

async function ShowSetUPResults() {
    try {
        await GetShowList();
        const show = await shows[Math.floor(Math.random() * shows.length)];
        return "" + show.id;
    } catch (error) {
        console.error(error);
    }
}
function GotoReward(id) {
    const link = prizeScreen + "?I" + id;
    window.location.href = link;
}
async function configerKnob() {
    const knob = document.querySelector("#knob")
    knob.addEventListener("click", () => {
      configerGift()
      gsap.to(knob, {
        rotation: "-=360",
        duration: 1.5,
        transformOrigin: "50% 50%",
        ease: "power2.out"
      });
    }, { });
    
}
async function configerGift() {
  const id = await ShowSetUPResults();
  const gift = document.querySelector("#giftOut")
    if (id != null) {
      gift.classList.add("ready")
      gift.textContent = "Clame youre prize"
        gift.addEventListener("click", () => {
            GotoReward(id)
        }, {});
    } else {
      gift.textContent = "No valid shows"
    }
}

async function setupDisplay() {
  const displays = document.querySelectorAll(".display");
  var dispArr = [];
  const rawData = sessionStorage.getItem("displays");
  if (rawData != null) {
    console.log("using old display shows")
    const parsedShows = rawData ? JSON.parse(rawData) : null;
    dispArr = parsedShows.shows;
  } else {
    console.log("Geting new display shows")
    const displayShows = await (getShow({ perPage: displays.length, page: 1 }, displayQuery));
    dispArr = await displayShows;
    const displaysForLater = { shows: dispArr};
    sessionStorage.setItem("displays",  JSON.stringify(displaysForLater));
  }
  for (let index = 0; index < displays.length; index++) {
      displays[index].src = await dispArr[index].coverImage.extraLarge;
  }
  document.querySelector("#loadeScreen").classList.add("disable")
}

function addCriteria(criteria) {
  queryInputs.genreIn.push(criteria);
}
function clearCriteria() {
  queryInputs.genreIn.length = 0;
  coins = document.querySelectorAll(".coin")
  coins.forEach(coin=> {
    const btn = coin.querySelector(".coinBtn");
    gsap.set(btn, { x: 0, y: 0,});
    coin.classList.remove("disable");
    
  });
}
function setUpCoinCase() {
  const box = document.querySelector("#coinCase")
  const coins = document.createElement('div');
  coins.classList.add("coinsAria")
    coin.classList.add('coin');
  for (let index = 0; index < ganreOptions.length; index++) {
    const coin = document.createElement('div');
    coin.classList.add('coin');
    const coinIcon =  document.createElement('img');
    coinIcon.src = "./Imiges/Coin.png"
    coinIcon.classList.add("iconCoin")
    const coinText = document.createElement('h3');
    coinText.classList.add("coinText")
    coinText.textContent = ganreOptions[index];
    const coinBtn = document.createElement('button');
    coinBtn.classList.add("coinBtn")
    coinBtn.addEventListener("click", () => {
      addCriteria(ganreOptions[index])
      console.log(queryInputs.genreIn)

      const slot = document.querySelector("#coinSlot");
      const gollrect = slot.getBoundingClientRect();
      
      const rect = coinBtn.getBoundingClientRect();
      const deltaX = gollrect.left - rect.left-35;
      const deltaY = gollrect.top - rect.top+10;
      gsap.to(coinBtn, {
        x: `+=${deltaX}`,
        y: `+=${deltaY}`,    
        duration: 1,    
        ease: "power2.out",
        onComplete: () => {
          coin.classList.add("disable");
        }
      });
      
    }, {});
    coinBtn.appendChild(coinIcon);
    coinBtn.appendChild(coinText);
    coin.appendChild(coinBtn);
    coins.appendChild(coin);
  }
  box.appendChild(coins);
  const slot = document.querySelector("#coinSlot");
  slot.addEventListener("click", () => {
          
      box.classList.remove("disable");
  }, {});
  const coinReturn = document.querySelector("#coinReturn");
  coinReturn.addEventListener("click", () => {
    clearCriteria();
  }, {});

  const close = document.querySelector("#closeCase");
  close.addEventListener("click", () => {
    box.classList.add("disable");
  }, {});
}
function setupPannal() {
  
}
configerKnob();
setupDisplay();
setUpCoinCase();