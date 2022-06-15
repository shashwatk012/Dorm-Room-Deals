const detail = document.querySelector(".detail");

async function populate() {
  const id = localStorage.getItem("id");
  const requestURL = `http://localhost:3000/details/${id}`;
  const request = new Request(requestURL);

  const response = await fetch(request);
  const superHeroesText = await response.text();

  const list = JSON.parse(superHeroesText);

  let html = "";
  list.forEach((element) => {
    html += `<img src=${element.Image} alt="" />
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
      <h6>Old: ${element.Age} years</h6>
      <h3>More details</h3>
      <h6>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime vitae
        iure id incidunt quas beatae mollitia quam odio quia labore minus
        illo, itaque rerum molestias nobis dolore molestiae at voluptates.
        Repellat iure id facilis quia nemo reprehenderit, animi sequi.
        Veritatis quae ad similique odio voluptatem eos dolor! Doloribus
        explicabo nobis sed quasi culpa veniam mollitia laudantium! Repellat
        aliquam voluptatem distinctio! Qui perspiciatis unde ullam sequi hic
        nostrum inventore, itaque atque voluptate quibusdam fugit cumque sunt
        explicabo? Quod perferendis dolorum aspernatur dolor ipsum eum, beatae
        ducimus nihil vel, expedita esse. Adipisci! Deserunt cumque possimus
        hic sequi vero, error tempore aspernatur vitae consequatur adipisci in
        quibusdam aperiam, repellendus eos fugiat harum, accusamus placeat?
        Reprehenderit rem beatae laudantium culpa quaerat ex! Obcaecati,
        culpa. Voluptates temporibus nemo sequi iure cupiditate, voluptatem
        accusantium? Dicta, molestiae rerum ut aliquam facilis suscipit et a
        nulla praesentium perspiciatis? Fugiat error obcaecati nihil dolore
        est perferendis, qui omnis excepturi. Provident aliquam accusantium
        quia iste iusto magnam voluptatum earum, repudiandae fugiat alias
        tenetur voluptate suscipit eius accusamus nulla tempora ipsa
        praesentium error nobis placeat voluptatibus expedita quasi eum.
        Veniam, fugit. Perferendis possimus expedita nostrum alias deserunt
        totam nihil voluptatibus in reiciendis cupiditate laudantium quo nam
        placeat enim accusamus labore provident quia, illo dolorem aliquam
        ducimus nemo. Accusantium tempore deserunt dolores! Ab temporibus
        harum minus quaerat maxime quo consectetur quis ad accusantium, iste
        tenetur ipsa nulla at cupiditate earum, laborum quam assumenda
        reprehenderit officiis rem quia? Nam nemo dolorum harum ut? Ipsa rerum
        natus architecto tempore sint. Minus, est consequatur molestiae ullam
        sequi consectetur veniam sapiente, mollitia tempore recusandae quis
        autem expedita eveniet nihil quibusdam nisi laborum saepe repudiandae.
        Perspiciatis, voluptas. Consequuntur similique magni quae? Reiciendis
        non eaque veritatis ducimus facilis laudantium fugiat nostrum tempore
        assumenda velit amet et aut perspiciatis id doloribus, iusto ad error
        nobis, cupiditate maiores. Ipsum, expedita. Amet est facere fugit
      </h6>
    </div>`;
  });
  detail.innerHTML = html;
}
populate();
