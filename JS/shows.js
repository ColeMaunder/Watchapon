const query = `
  query ($genre: String, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        hasNextPage
      }
      media(genre: $genre, type: ANIME, sort: POPULARITY_DESC) {
        id
        title {
          romaji
          english
        }
        genres
        averageScore
        episodes
        coverImage {
          medium
        }
      }
    }
  }
`;

async function getShowsByGenre(genre, page = 1, perPage = 30) {
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

// Usage
getShowsByGenre("Comedy").then((result) => {
    result.media.forEach((show) => {
        console.log(show.title.english || show.title.romaji, show.relese);
    });
    console.log("More pages?", result.pageInfo.hasNextPage);
});