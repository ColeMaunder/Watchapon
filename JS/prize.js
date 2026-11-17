
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
  const response = await fetch("https://graphql.anilist.co", {
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

   if (!response.ok) {
    throw new Error(`AniList error: ${response.status}`);
  }

  const json = await response.json();
  return json.data.Media;
}

function getId() {
    const queryString = window.location.search;
    const id = parseInt(queryString.slice(1));
    return id;
}
async function SetUpPage() {
    const show = await getShows(getId());
    console.log(show.title.english);

    const title = document.querySelector("#title");
    title.textContent = show.title.english || show.title.romaji;

    const header = document.querySelector("#header");
    
    header.style.backgroundImage = `url('${show.bannerImage}')`;
    header.style.backgroundSize = 'cover';
    header.style.backgroundPosition = 'center';
    header.style.backgroundRepeat = 'no-repeat';
    

    const summery = document.querySelector("#summery");
    summery.innerText = show.description.replaceAll("<br>","")/*.replaceAll("<b>","").replaceAll("</b>","");*/;
}

SetUpPage()