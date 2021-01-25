'use strict';

const APIURL = 'https://api.github.com/users/'

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

getUser('florinpop17');

async function getUser(username){
  const resp = await fetch(APIURL + username);
  const respData = await resp.json();

  createUserCard(respData);

  getRepos(username);
}

async function getRepos(username){
  const resp = await fetch(APIURL + username + '/repos');
  const respData = await resp.json();

  addReposToCard(respData);
}

function createUserCard(user){
  const cardHTML = `
    <div class="card">
      <div>
        <img class="avatar" src="${user.avatar_url}" alt="${user.name}" />
      </div>
      <div class="user-info">
        <h2>${user.name}</h2>
        <p>${user.bio}</p>

        <ul class="info">
          <li>${user.followers}<strong>Followers</strong></li>
          <li>${user.following}<strong>Followings</strong></li>
          <li>${user.public_repos}<strong>Repos</strong></li>
        </ul>

        <div id="repos">
        </div>
      </div>
    </div>
  `;

  main.innerHTML = cardHTML;
}

function addReposToCard(repos){
  const reposEl = document.getElementById('repos');
  console.log(repos);

  
  /*
  array.sort()
  콜백 함수에는 a, b 즉 이전 값, 현재 값이 전달되는데
  네가 만약 -(마이너스) 값을 return하게 되면
  첫 번째(a)가 뒤에 것(b)보다 작다고 간주되서 정렬된다.

  만약 반대로 하고 싶으면
  .sort((a, b) => b - a)
  로 하면 점수가 높은 것이 앞에 먼저 나올것임.

  그니까 sort의 리턴값이 0보다 작으면 a, 즉 이전 값이 먼저 오도록 정렬(오름차순)
  리턴값이 0보다 크면 b, 즉 현재 값을 먼저 오도록 정렬(내림차순)

  그래서 먼저 repos의 30개의 item들의 stargazers_count 값이 큰 애들부터 먼저 오도록 내림차순으로 정렬하려는 거.
  */
  // 그리고 나서 얘내들을 slice(0, 9)하면 0번 index에서 8번 index까지만 잘라서(마지막 9번 인덱스는 제외됨) return
  // 그렇게 slice되서 return받은 array에다가 forEach()를 해주는거임. 이때 참고로 slice되는 원본 배열은 바뀌지 않음.
  repos.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 10).forEach(repo => {
    const repoEl = document.createElement('a');
    repoEl.classList.add('repo');

    repoEl.href = repo.html_url;
    repoEl.target = '_blank'; // 해당 href를 새창으로 열기
    repoEl.innerText = repo.name;

    reposEl.appendChild(repoEl);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const user = search.value;

  if (user) {
    getUser(user);

    search.value = '';
  }
});