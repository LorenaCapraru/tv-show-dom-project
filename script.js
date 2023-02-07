const boxContainer = document.getElementById("boxContainer");
//const allEpisodes = getAllEpisodes();
let searchContainer = document.getElementById("search");
const resultsNo = document.createElement("p");
let dropDown = document.querySelector(".dropDown");
let dropDownShows = document.querySelector(".dropDownShows");
let allShows = getAllShows();

function displaySearchResults(episodeList) {
  resultsNo.innerHTML = `Got ${episodeList.length} episode(s)`;
  resultsNo.className = "resultsNo";
  searchContainer.appendChild(resultsNo);
}

async function fetchData() {
  const response = await fetch("https://api.tvmaze.com/shows/167/episodes");
  const allEpisodes = await response.json();

  //I initialize the page when it loads the first time
  createDropDown(allEpisodes);
  createSearch(allEpisodes);
  createDropDownShows(allShows);
  allEpisodes.forEach((episode) => createBoxEpisode(episode)); //creates box for each episode
}

function createBoxEpisode(episode) {
  let containerDiv = document.createElement("div");
  boxContainer.appendChild(containerDiv);
  containerDiv.className = "box";

  let seasonNo = document.createElement("span");
  seasonNo.innerHTML = `S${Number(episode.season) > 10 ? 1 : 0}${
    episode.season
  }`;

  let episodeNo = document.createElement("span");
  episodeNo.innerText = `E${Number(episode.number) > 10 ? 1 : 0}${
    episode.number
  }`;

  let title = document.createElement("h3");
  title.innerHTML = `${episode.name.toUpperCase()} - `;
  title.appendChild(seasonNo);
  title.appendChild(episodeNo);
  title.className = "title";

  let episodeBrief = document.createElement("p");
  episodeBrief.innerHTML = episode.summary;
  episodeBrief.className = "brief";

  let episodeImg = document.createElement("img");
  episodeImg.src = episode.image.medium;
  episodeImg.className = "image";
  episodeImg.alt = episode.name;

  containerDiv.appendChild(title);
  containerDiv.appendChild(episodeImg);
  containerDiv.appendChild(episodeBrief);
}

function createSearch(allEpisodes) {
  let searchEpisodes = document.getElementById("searchEpisode");
  searchEpisodes.className = "searchEpisodes";

  let listOfSearchedEp = [];

  searchEpisodes.addEventListener("input", () => {
    boxContainer.innerHTML = "";
    allEpisodes
      .filter((episode) => {
        return (
          episode.name
            .toLowerCase()
            .includes(searchEpisodes.value.toLowerCase()) ||
          episode.summary
            .toLowerCase()
            .includes(searchEpisodes.value.toLowerCase())
        );
      })
      .forEach((ep) => {
        createBoxEpisode(ep);
        listOfSearchedEp.push(ep);
      });

    resultsNo.innerHTML = `Got ${boxContainer.childElementCount} episode(s)`;

    if (boxContainer.childElementCount === 0) {
      let noFoundElement = document.createElement("h1");
      noFoundElement.innerHTML = "No matching results.";
      boxContainer.appendChild(noFoundElement);
    }
  });
}

function createDropDown(allEpisodes) {
  let firstOption = document.createElement("option");
  firstOption.innerText = "All Episodes";
  firstOption.value = "All Episodes";
  dropDown.appendChild(firstOption);

  for (let episode of allEpisodes) {
    let option = document.createElement("option");
    option.innerHTML = `S${Number(episode.season) > 10 ? 1 : 0}${
      episode.season
    }E${Number(episode.number) > 10 ? 1 : 0}${episode.number} - ${
      episode.name
    }`;
    dropDown.appendChild(option);
  }

  dropDown.addEventListener("change", () => {
    if (dropDown.value === "All Episodes") {
      boxContainer.innerHTML = "";
      allEpisodes.forEach((episode) => createBoxEpisode(episode));
    } else boxContainer.innerHTML = "";
    for (let episode of allEpisodes)
      if (
        dropDown.options[dropDown.selectedIndex].text.includes(episode.name)
      ) {
        createBoxEpisode(episode);
        resultsNo.innerHTML = `Got one episode(s)`;
      }
  });
}

function createDropDownShows(allShows) {
  allShows.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  for (let show of allShows) {
    let option = document.createElement("option");
    option.innerText = show.name;
    option.value = show.id;
    dropDownShows.appendChild(option);
  }

  dropDownShows.addEventListener("change", () => {
    let showId = dropDownShows.value;
    fetchEpisodes(showId);
  });
}

async function fetchEpisodes(showId) {
  const response = await fetch(
    `https://api.tvmaze.com/shows/${showId}/episodes`
  );
  const showEpisodes = await response.json();

  boxContainer.innerHTML = "";
  showEpisodes.forEach((episode) => createBoxEpisode(episode));

  dropDown.innerHTML = "";
  createDropDown(showEpisodes);

  createSearch(showEpisodes);
}

function setup() {
  fetchData();
}

window.onload = setup;
