const queryInputs = { genreIn: ["Action","fantasy","drama","Romance"], perPage: 100, page: 1 ,durationGreater: 0};
const criteria = "$genreIn: [String], $durationGreater: Int";
const criteriaReverse = " genre_in: $genreIn, duration_greater: $durationGreater";
const prizeScreen = "HTML/prize.html"
var shows = [];
const customQuery = `
query CustomQuery(`+ criteria +`, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(`+ criteriaReverse +`,  type: ANIME, sort: POPULARITY_DESC) {
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
    
    const showid = await ShowSetUPResults();
    const knob = document.querySelector("#knob")
    knob.addEventListener("click", () => {
        configerGift(showid)
    }, { });
    
}
function configerGift(id) {
    if (id != null) {
        const gift = document.querySelector("#giftOut")
        gift.classList.add("ready")
        gift.addEventListener("click", () => {
            GotoReward(id)
        }, {});
    }
}

configerKnob();