const catalog = "catalog.html"
const home = "../index.html"

const query = `
  query ExampleQuery($mediaId: Int) {
  Media(id: $mediaId) {
    id
    coverImage {
      extraLarge
      color
    }
    episodes
    duration
    description
    genres
    hashtag
    meanScore
    bannerImage
    duration
    startDate {
      year
      month
      day
    }
    title {
      english
      romaji
    }
  }
}
`;

async function getShows(mediaId) {
  let response;
     try {
    response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {mediaId},
    }),
  });
  } catch (err) {
    throw new ApiError("Network error: " + err.message, 0);
  }

  let json = null;
  try {
    json = await response.json();
  } catch {}

  if (!response.ok) {
    const msg = json?.errors?.[0]?.message ?? response.statusText;
    throw new ApiError(msg, response.status);throw new Error(`AniList error: ${response.status}`);
  }
  if (json?.errors?.length) {
    throw new ApiError(json.errors[0].message, json.errors[0].status ?? 500);
  }
  if (!json?.data?.Media) {
    throw new ApiError("Show not found", 404);
  }
    return json.data.Media;
}

function getId() {
    const queryString = window.location.search;
    const id = parseInt(queryString.slice(2));
    return id;
}

function SetBack() {
  const queryString = window.location.search;
  const lastScreenID = queryString.at(1);
  var lastScreen = home
  if (lastScreenID === 'C') {
    lastScreen = catalog
  }
  const back = document.querySelectorAll(".backBtn");
  back.forEach(btn => {
    btn.addEventListener("click", () => {
    window.location.href = lastScreen;
  }, {});
  });
  

}
async function SetUpPage() {
  const id = getId()
  /*var show;
    const rawData = sessionStorage.getItem("shows");
  if (rawData != null) {
    const parsedShows = rawData ? JSON.parse(rawData) : null;
    const last = new Date(parsedShows.time);
    console.log(last)
    console.log(id)
    var showIn = null;
    for (const showGroup of parsedShows.shows){
      showIn = showGroup.find(item => item.id == id);
      if (showIn != null) {
        console.log(showIn);
        break;
      }
    };
    console.log(showIn);
    if (showIn != null) {
      show = showIn;
    } else {
      show = await getShows(id);
      }
  } else {*/
  try {
    show = await getShows(id);
  //}
  console.log(show.id)
    
    
    console.log(show.title.english);

    const title = document.querySelector("#title");
    title.textContent = show.title.english || show.title.romaji;

    const header = document.querySelector("#header");
    document.querySelector("#loadeScreen").classList.add("disable")
    header.style.backgroundImage = `url('${show.bannerImage}')`;
    header.style.backgroundSize = 'cover';
    header.style.backgroundPosition = 'center';
    header.style.backgroundRepeat = 'no-repeat';
    

    const summery = document.querySelector("#summery");
  summery.innerText = show.description.replaceAll("<br>", "")/*.replaceAll("<b>","").replaceAll("</b>","");*/;
  const ganre = document.querySelector("#ganre");
  ganre.innerText = show.genres;

  
    const duration = document.querySelector("#duration");
   
    duration.innerText = show.duration;
    } catch (error) {
    APIError(error);
  }
}

function APIError(error) {
  switch (error.status) {
    case 404:
      console.error("Not Found:", error.message);
      showError("That show couldn't be found.");
      break;
    case 429:
      console.error("Rate limited: too many requests.");
      showError("Too many requests. Please wait a moment and try again.");
      break;
    case 0:
      console.error(error.message);
      showError("Network problem. Check your connection.");
      break;
    default:
      console.error("Unexpected error:", error);
      showError("Something went wrong.");
  }
}

function showError(message) {
  document.querySelector("#loadeScreen").classList.add("disable")
  document.querySelector("#errorScreen").classList.remove("disable")
  document.querySelector("#errorMesage").textContent = message;
}

SetUpPage()
SetBack()


class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}