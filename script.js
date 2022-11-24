
let pokemons;
let promises = [];
let sortedPokemons;
let order = 1;
let result = document.getElementById("result");

let pokemonXhr = new XMLHttpRequest();
pokemonXhr.open("GET", "https://pokeapi.co/api/v2/pokemon/?limit=127");
pokemonXhr.responseType = "json";
pokemonXhr.send();

pokemonXhr.onload = function () {
    let responseArray = pokemonXhr.response.results;
    for (const pokemon of responseArray) {
        let promise = new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", pokemon.url);
            xhr.responseType = "json";
            xhr.send();

            xhr.onload = function () {
                if (xhr.status == 200) {
                    resolve(xhr.response);
                } else {
                    reject(xhr.status);
                }
            }

            xhr.onerror = function () {
                reject(xhr.status);
            }
        });
        promises.push(promise);
    }

    Promise.all(promises).then(function (results) {
        pokemons = results;
        sortedPokemons = pokemons.sort();
        for (const pokemon of sortedPokemons) {
            drawPokemon(pokemon);
        }
    })
}

function drawPokemon(pokemon) {
    let div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p>id: #${pokemon.id}</p>
        <hr>
        <h1>${pokemon.name}</h1>
        <img src="${pokemon.sprites.front_default}">
        <div class="stats">
            <p class="hp">&#10084; ${pokemon.stats[0].base_stat}</p>
            <p class="attack">&#9876; ${pokemon.stats[1].base_stat}</p>
            <p class="defense">&#128737; ${pokemon.stats[2].base_stat}</p>
        </div>
    `;

    let ul = document.createElement("ul");
    let types = pokemon.types;
    for (const item of types) {
        let li = document.createElement("li");
        li.textContent = item.type.name;
        ul.appendChild(li);
    }

    div.appendChild(ul);

    let br = document.createElement("br");
    div.appendChild(br);
    result.appendChild(div);
}

let sortForm = document.getElementById("sort-form");

sortForm.addEventListener("change", function (event) {
    if (event.target["name"] == "order") {
        switch (event.target.value) {
            case "asc":
                order = 1;
                break;
            case "desc":
                order = -1
                break;
        }
    }
    switch (sortForm["sort"].value) {
        case "id":
            sortedPokemons = sortedPokemons.sort(function (first, second) {
                if (first.id > second.id) {
                    return order
                }
                if (first.id < second.id) {
                    return -order
                }
                return 0
            });
            break;

        case "name":
            sortedPokemons = sortedPokemons.sort(function (first, second) {
                if (first.name > second.name) {
                    return order
                }
                if (first.name < second.name) {
                    return -order
                }
                return 0
            });
            break;

        case "hp":
            sortedPokemons = sortedPokemons.sort(function (first, second) {
                if (first.stats[0].base_stat > second.stats[0].base_stat) {
                    return order
                }
                if (first.stats[0].base_stat < second.stats[0].base_stat) {
                    return -order
                }
                return 0
            });
            break;

        case "attack":
            sortedPokemons = sortedPokemons.sort(function (first, second) {
                if (first.stats[1].base_stat > second.stats[1].base_stat) {
                    return order
                }
                if (first.stats[1].base_stat < second.stats[1].base_stat) {
                    return -order
                }
                return 0
            });
            break;

        case "defense":
            sortedPokemons = sortedPokemons.sort(function (first, second) {
                if (first.stats[2].base_stat > second.stats[2].base_stat) {
                    return order
                }
                if (first.stats[2].base_stat < second.stats[2].base_stat) {
                    return -order
                }
                return 0
            });
            break;
    }
    reDrawSortedPokemons()
})

function reDrawSortedPokemons() {
    result.innerHTML = ""
    for (const pokemon of sortedPokemons) {
        drawPokemon(pokemon)
    }
}


