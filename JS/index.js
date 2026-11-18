
const queryInputs = { genre: "Action" };
const criteria = "$genre: String";
const criteriaReverse = " genre: $genre";
const customQuery = `
  query CustomQuery(`+ criteria +`) {
  Media(`+ criteriaReverse +`, type: ANIME) {
    id
    title {
        english
        romaji
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
  return json.data.Media;
}

getShow(queryInputs,customQuery).then(console.log);