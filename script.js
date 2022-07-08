const APIURL = "https://api.github.com/users/";

const form = document.getElementById("form");
const main = document.getElementById("main");
const search = document.getElementById("search");

async function getUser(username) {
  try {
    const { data } = await axios(APIURL + username);
    console.log(data);
    createUserCard(data);
    getRepos(username);
  } catch (err) {
    if (err.response.status == 404) {
      createErrorCard(`No profile with this username exists!`);
    }
  }
}

async function getRepos(username) {
  try {
    const { data } = await axios(APIURL + username + "/repos?sort=created");
    addReposToCard(data);
  } catch (err) {
    createErrorCard(`Problem fetching Repos!`);
  }
}

function createErrorCard(msg) {
  const cardHTML = `
<div class="card"><h1>${msg}</h1></div>
`;
  main.innerHTML = cardHTML;
}

function createUserCard(user) {
  const cardHTML = `<div class="card">
        <div>
          <img
            class="avatar"
            alt=${user.name}
            src=${user.avatar_url}
          />
        </div>
        <div class="user-info">
          <div class="user-title"><h2>${user.name}</h2> <a href=${
    user.html_url
  } target="_blank"><h3>Go to Profile</h3></a></div>
          <p>${user.bio ? user.bio : ""}</p>
          <ul>
            <li>${user.followers} <strong>Followers</strong></li>
            <li>${user.following} <strong>Following</strong></li>
            <li>${user.public_repos} <strong>Repos</strong></li>
          </ul>
          <div id="repos"></div>
        </div>
      </div>`;
  main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
  const reposEl = document.getElementById("repos");

  repos.slice(0, 5).forEach((repo) => {
    const repoEl = document.createElement("a");
    repoEl.classList.add("repo");
    repoEl.href = repo.html_url;
    repoEl.target = "_blank";
    repoEl.innerText = repo.name;

    reposEl.appendChild(repoEl);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = search.value;

  if (user) {
    getUser(user);

    search.value = "";
  }
});
