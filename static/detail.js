const detail = document.querySelector(".detail");

async function populate() {
  const id = localStorage.getItem("id");
  const requestURL = `/details/${id}`;
  const request = new Request(requestURL);

  const response = await fetch(request);
  const superHeroesText = await response.text();

  const list = JSON.parse(superHeroesText);

  let html = "";
  list.forEach((element) => {
    html += `<div id=${element._id} class="img"><img src="./static/public/images/${element.Image}" alt="" /><h2 class="hidden">${element.ProductsName}</h2></div>
    <div class="inform">
      <h2>${element.ProductsName}</h2>
      <h3>Cost:Rs${element.Cost}</h3>
      <h3>Owner's Details</h3>
      <h6>Owner's Name: ${element.Name}</h6>
      <h6>Owner's Mobile number: ${element.Phone}</h6>
      <h6>Owner's Email: ${element.Email}</h6>
      <h3>Product's Details</h3>
      <h6>${element.Type}</h6>
      <h6>Brand's Name:${element.BrandsName}</h6>
      <h6>Old: ${element.Age}</h6>
      <div class="btn">Add to Cart</div>
      <h3>More details</h3>
      <h6>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime vitae
        iure id incidunt quas beatae mollitia quam odio quia labore minus
        illo, itaque rerum molestias nobis dolore molestiae at voluptates.
        Repellat iure id facilis quia nemo reprehenderit, animi sequi.
      </h6>
    </div>`;
  });
  detail.innerHTML = html;
  const add = document.querySelector(".btn");
  add.addEventListener("click", async () => {
    const img = document.querySelector(".img");
    const id = img.id;
    const params = {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        id: id,
      }),
    };
    const requestURL = "/add";
    const request = new Request(requestURL);
    const response = await fetch(request, params);
    const superHeroesText = await response.text();
    const list = JSON.parse(superHeroesText);
    location.href = "/add";
  });
}
populate();
