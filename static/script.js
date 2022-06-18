// async function populate() {
//   const requestURL = "http://localhost:3000/k";
//   const request = new Request(requestURL);

//   const response = await fetch(request);
//   const superHeroesText = await response.text();

//   const contacts = JSON.parse(superHeroesText);

//   //let html = "";
//   // contacts.forEach((element) => {
//   //   html += `<h1>${element.name} phone number : ${element.phone}</h1>`;
//   // });
//   // document.querySelector(".hii").innerHTML = html;
// }
// populate();

const login = document.querySelector(".login");
const signup = document.querySelector(".signup");

login.addEventListener("click", () => {
  location.href = "/login";
});

signup.addEventListener("click", () => {
  location.href = "/signup";
});

const product = document.querySelectorAll(".product");

async function populate(obj, ele) {
  const requestURL = `/${obj}`;
  const request = new Request(requestURL);

  const response = await fetch(request);
  const superHeroesText = await response.text();

  const list = JSON.parse(superHeroesText);
  console.log(list);

  let html = "";
  if (ele == 1) {
    for (let i = 0; i < 4; i++) {
      html += `<div id=${list[i]._id} class="icons" >
      <img src=${list[i].Image} class="pho" />
      <h3>${list[i].ProductsName}</h3>
      <p>Cost:Rs${list[i].Cost}</p>
    </div>`;
    }
  } else {
    for (let i = 0; i < 4; i++) {
      html += `<div id=${list[i]._id} class="icons" >
      <img src=${list[i].Image} />
      <h3>${list[i].ProductsName}</h3>
      <p>Cost:Rs${list[i].Cost}</p>
    </div>`;
    }
  }
  product[ele].innerHTML = html;
  const icons = document.querySelectorAll(".icons");
  icons.forEach((element) => {
    element.addEventListener("click", () => {
      console.log(element.id);
      warn.classList.remove("hidden");
    });
  });
  //console.log(icons);
}

populate("mobile", 0);
populate("bicycle", 1);

const item = document.querySelectorAll(".items");
const warn = document.querySelector(".warn");
const img = document.querySelector(".img");
//const icons = document.querySelectorAll(".icons");
const btn = document.querySelector(".btn");
const navbar = document.getElementById("navbar");
const seller = navbar.lastElementChild;
const Search = document.querySelector(".Searc");
item.forEach((element) => {
  element.addEventListener("click", () => {
    warn.classList.remove("hidden");
  });
});
img.addEventListener("click", () => {
  warn.classList.add("hidden");
});
btn.addEventListener("click", () => {
  warn.classList.remove("hidden");
});
seller.addEventListener("click", () => {
  warn.classList.remove("hidden");
});
Search.addEventListener("click", () => {
  warn.classList.remove("hidden");
});
