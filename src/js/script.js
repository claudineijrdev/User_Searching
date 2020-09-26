let txtBusca;
let btnBusca;
let users;
let estatisticas;
let wsData;
let filteredData;
let estatisticasData;
const wsUrl =
  "https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo";

window.addEventListener("load", () => {
  txtBusca = document.querySelector("#txtBusca");
  btnBusca = document.querySelector("#btnBusca");
  users = document.querySelector("#users");
  estatisticas = document.querySelector("#estatisticas");

  txtBusca.addEventListener("input", setButtonActive);
  btnBusca.addEventListener("click", find);

  // fetchingServer();
  fetchingAsync()
  console.log("started");
});

function filterData(event){
  if (event.target.value.length ) {
    return wsData.filter((user) =>
      user.fullName.toLowerCase().trim().includes(event.target.value.toLowerCase().trim())
    );
  }
  return null
}

function sortData(){
  return (filteredData ?? filteredData.sort((a,b) => { a.fullName.localeCompare(b.fullName) }))
}

function calcData(){
  if (filteredData){
    let totalMale = filteredData.filter((data) => data.gender === 'male');
    let totalFemale = filteredData.filter((data) => data.gender === 'female');
    let agesSum = filteredData.reduce((a, b) => ({age: a.age + b.age}));
    let agesAvg = (agesSum.age / filteredData.length).toFixed(2);

    return{
      totalMale: totalMale.length,
      totalFemale: totalFemale.length,
      agesSum: agesSum.age,
      agesAvg
    } 
  }
}

function renderUsers(){
  let htmlUsers = `<h2>${filteredData.length} Usuário(s) Encontrado(s)</h2>` ;
  filteredData.forEach((user) => {
    const innerHtmlUsers = `
      <div class='users'>
        <div>
          <img src="${user.picture}" alt="${user.firstName}"/>
        </div>
        <div class="user-details">
          <div>
            <label>${user.firstName} ${user.lastName}</label>
          </div>
          <div>
            <label>${user.age} anos</label>
          </div>
        </div>
      </div>
    `

    htmlUsers+= innerHtmlUsers;

  });
  users.innerHTML = htmlUsers;
}
function renderEstatisticas(){
  const innerHtmlEstatisticas = `
  <div class='estatisticas'>
    <div>
    <label>Sexo Masculino: ${estatisticasData.totalMale}</label>
      </div>        
      <div>
      <label>Sexo Feminino: ${estatisticasData.totalFemale}</label>
      </div>
      <label>Soma das Idades: ${estatisticasData.agesSum}</label>
      <div>
      </div>
      <div>
      <label>Média das Idades: ${estatisticasData.agesAvg}</label>
      </div>
    </div>
  </div>
`
  
  estatisticas.innerHTML = `<h2>Estatísticas</h2>` + innerHtmlEstatisticas;
}
function render(){
  if (filteredData){
    renderUsers();
    renderEstatisticas();   
  }else{
    users.innerHTML = '<h2>Nenhum usuário filtrado<h2>';
    estatisticas.innerHTML = '<h2 id="estatisticas">Nada a ser exibido</h2>';
  }
}

function setButtonActive(event) {
  btnBusca.disabled = event.target.value.length === 0;
  filteredData = filterData(event);
  filteredData = filteredData ? sortData() : filteredData;
  estatisticasData = calcData();
  render(); 
}

function find(event) {
  event.preventDefault();
}

async function fetchingAsync(){
  try {
    const res  = await fetch(wsUrl)
    const data = await res.json()
    wsData = data.results.map(user => {
      const {name, dob, gender, picture} = user
        return {
          firstName: name.first,
          lastName: name.last,
          fullName: `${name.first} ${name.last}`, 
          age: dob.age,
          picture: picture.medium,
          gender
        };
      });
  } catch (error) {
    console.log(error)
  }
}

function fetchingServer() {
  fetch(wsUrl)
    .then((res) => res.json())
    .then((data) => {
      wsData = data.results.map(user => {
      const {name, dob, gender, picture} = user
        return {
          firstName: name.first,
          lastName: name.last,
          fullName: `${name.first} ${name.last}`, 
          age: dob.age,
          picture: picture.medium,
          gender
        };
      });
      console.log(wsData);
    })
    .catch((err) => console.log(err));
}
