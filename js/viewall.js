import { getFlights } from "./flights.js";

async function getDestinations() {
  const dest = await getFlights();

  const uniqueDEstinations = dest.reduce((acc, current) => {
    const existed = acc.some((d) => {
      return d.cityDestination === current.cityDestination;
    });
    if (!existed) {
      acc.push(current);
    }

    return acc;
  }, []);
  return uniqueDEstinations
  
}


async function createDestinations(){

    const destinations= await getDestinations();
    console.log(destinations);
    const destinationsSection= document.getElementsByClassName('dest')[0];
Array.from(destinations).forEach((destination) => {
    const article = document.createElement("article");
    article.classList.add(
      ...[
        "rounded-2xl",
        "h-[50vh]",
        "text-white",
        "flex",
        "flex-col",
        "group",
        "overflow-hidden",
        "relative",
        "z-40",
        "w-[300px]",
       
        "w-[45%]",
        "shrink-0"
                
      ],
    );

    const overlay = document.createElement("div");
    overlay.classList.add(
      ...[
        "top-0",
        "absolute",
        "h-full",
        "w-full",
        "bg-cover",
        "bg-no-repeat",
        "z-0",
        "group-hover:scale-[1.1]",
        "duration-500",
        "ease-in-out",
      ],
    );
    overlay.style.backgroundImage = `url(${destination.cityDestinationPhoto})`;
    article.appendChild(overlay);

    const div = document.createElement("div");
    div.classList.add(...["rounded-lg", "p-2", "z-30"]);
    const h3 = document.createElement("h3");
    h3.textContent = destination.cityDestination;
    h3.classList.add(...["font-bold", "text-xl"]);

    const p = document.createElement("p");
    p.textContent = `From $ ${destination.price}`;
    p.classList.add("text-sm");

    const divExplore = document.createElement("div");
    divExplore.classList.add(
      ...[
        "text-center",
        "opacity-0",
        "group-hover:opacity-100",
        "transition",
        "duration-800",
        "ease-in-out",
        "font-bold",
        "inset-0",
        "absolute",
        "top-[45%]",
      ],
    );
    const linkExplore = document.createElement("button");

    const exploreIcon = document.createElement("span");
    exploreIcon.innerHTML = `<i class="fa-regular fa-circle-right" ></i>`;

    linkExplore.innerText = `explore flights `;
    linkExplore.classList.add(
      ...[
        "bg-white/90",
        "p-2",
        "text-[var(--navy-blue)]",
        "rounded-xl",
        "text-sm",
        "cursor-pointer",
      ],
    );
    linkExplore.type = "button";
    linkExplore.addEventListener("click", () => {
      localStorage.setItem("destination",destination.cityDestination);
      window.location.href="./explore.html"


    });

    linkExplore.appendChild(exploreIcon);
    divExplore.appendChild(linkExplore);
    article.appendChild(div);
    article.appendChild(divExplore);
    div.appendChild(h3);
    div.appendChild(p);
    destinationsSection.appendChild(article);
  });


}

createDestinations()