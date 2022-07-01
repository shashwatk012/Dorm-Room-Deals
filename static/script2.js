const box = document.querySelector(".box");

async function populate() {
  namei = localStorage.getItem("names");
  console.log(namei);
  const requestURL = `/ProdutsName`;
  const request = new Request(requestURL);

  const response = await fetch(request);
  const superHeroesText = await response.text();

  const list = JSON.parse(superHeroesText);
  console.log(list);

  let html = "";
  list.forEach((element) => {
    if (element.ProductsName.toLowerCase().includes(namei)) {
      html += `<div id=${element._id} class="icons">
      <img src="./static/public/images/${element.Image}" />
      <h3>${element.ProductsName}</h3>
      <p>Cost:Rs${element.Cost}</p>
    </div>`;
    } else if (element.Type.toLowerCase().includes(namei)) {
      html += `<div id=${element._id} class="icons">
      <img src="./static/public/images/${element.Image}" />
      <h3>${element.ProductsName}</h3>
      <p>Cost:Rs${element.Cost}</p>
    </div>`;
    } else if (element.BrandsName.toLowerCase().includes(namei)) {
      html += `<div id=${element._id} class="icons">
      <img src="./static/public/images/${element.Image}" />
      <h3>${element.ProductsName}</h3>
      <p>Cost:Rs${element.Cost}</p>
    </div>`;
    }
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
