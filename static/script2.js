const box = document.querySelector(".box");

async function populate() {
  namei = localStorage.getItem("names");
  const requestURL = `/${namei}`;
  const request = new Request(requestURL);

  const response = await fetch(request);
  const superHeroesText = await response.text();

  const list = JSON.parse(superHeroesText);

  const requesURL = `/name/${namei}`;
  const reques = new Request(requesURL);

  const respons = await fetch(reques);
  const superHeroesTex = await respons.text();

  const lis = JSON.parse(superHeroesTex);

  const requeURL = `/brands/${namei}`;
  const reque = new Request(requeURL);

  const respon = await fetch(reque);
  const superHeroesTe = await respon.text();

  const li = JSON.parse(superHeroesTe);

  let html = "";
  list.forEach((element) => {
    html += `<div id=${element._id} class="icons">
      <img src=${element.Image} />
      <h3>${element.ProductsName}</h3>
      <p>Cost:Rs${element.Cost}</p>
    </div>`;
  });
  lis.forEach((element) => {
    html += `<div id=${element._id} class="icons">
      <img src=${element.Image} />
      <h3>${element.ProductsName}</h3>
      <p>Cost:Rs${element.Cost}</p>
    </div>`;
  });
  li.forEach((element) => {
    html += `<div id=${element._id} class="icons">
      <img src=${element.Image} />
      <h3>${element.ProductsName}</h3>
      <p>Cost:Rs${element.Cost}</p>
    </div>`;
  });
  if (html === "") {
    html = `<h1 class="sorry" >Sorry! NO results found</h1>`;
    box.style.display = "block";
    box.innerHTML = html;
  } else {
    box.innerHTML = html;
  }
  const icons = document.querySelectorAll(".icons");
  icons.forEach((element) => {
    element.addEventListener("click", () => {
      localStorage.setItem("id", element.id);
      location.href = `/details`;
    });
  });
}

populate();
