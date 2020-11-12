let pokemonRepository = (function () {
	let pokemonList = [];
	let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=60';

	function addToPokemonList(pokemonFromApi) {
		pokemonList.push(pokemonFromApi);
	}
	function getPokemonListContents() {
		return pokemonList;
	}
	// // Loads initial object of name and detailsUrl and adds it to the pokemonList
	function loadDataFromApi() {
		return $.ajax(apiUrl)
			.then((data) => {
				data.results.forEach((item) => {
					let pokemon = {
						name: item.name,
						detailsUrl: item.url,
					};
					addToPokemonList(pokemon);
				});
			})
			.catch((err) => console.error(err));
	}

	// // Loads the auxiliary details as key/value pairs for each Pokemon and stores it in the pokemonList
	function loadDetails(listItem) {
		let url = listItem.detailsUrl;
		return $.ajax(url)
			.then((data) => {
				listItem.abilities = data.abilities;
				listItem.height = data.height;
				listItem.weight = data.weight;
				listItem.imageUrl = data.sprites.other.dream_world.front_default;
				listItem.imageUrlAnimation = data.sprites.versions['generation-v']['black-white'].animated.front_default;
				listItem.types = [];
				data.types.forEach(function (itemType) {
					listItem.types.push(itemType.type.name);
				});
				listItem.abilities = [];
				data.abilities.forEach(function (itemAbility) {
					listItem.abilities.push(itemAbility.ability.name);
				});
			})
			.catch((err) => console.error(err));
	}

	function addToDom(pokemon) {
		loadDetails(pokemon).then(() => {
			let pokemonGrid = $('.row');
			let cardContainer = $('<div></div>').addClass('col-xs col-sm-6 col-md-4');
			let card = $('<div></div>').addClass('card pokemon-card text-center bg-light my-2 border border-warning');

			let cardImg = $('<img>')
				.addClass('card-img-top mx-auto my-3')
				.attr({
					src: pokemon.imageUrlAnimation,
					alt: 'gif of Pokemon',
				})
				.css({
					width: '150px',
					height: '150px',
				});

			let cardBody = $('<div></div>');
			cardBody.addClass('card-body');

			let modalButton = $('<button></button>')
				.text(pokemon.name)
				.addClass('btn btn-primary btn-lg text-capitalize text-warning bg-secondary border border-warning')
				.attr({
					type: 'button',
					'data-toggle': 'modal',
					'data-target': '#ModalCenter',
				});

			cardBody.append(modalButton);
			card.append(cardImg);
			card.append(cardBody);
			cardContainer.append(card);
			pokemonGrid.append(cardContainer);

			modalButton.on('click', function () {
				showModal(pokemon);
			});
		});
	}
	function showModal(pokemon) {
		let modalBody = $('.modal-body');
		modalBody.addClass('text-center');

		let modalTitle = $('.modal-title');

		modalBody.empty();
		modalTitle.empty();

		let name = $('<h1></h1>');
		name.text(pokemon.name);
		name.addClass('text-capitalize');

		let spriteElement = $('<img>');
		spriteElement.attr('src', pokemon.imageUrl);
		spriteElement.addClass('text-center w-50');

		let capitalisedName = pokemon.name[0].toUpperCase().concat(pokemon.name.slice(1));
		let stringifiedTypes = pokemon.types.join(', and ');
		let stringifiedAbilities = pokemon.abilities.join(', and ');
		// The API provided an erroneus value for height, value is missing a "." to denote height in meters (example: 11, instead of 1.1) so I corrected it with the below code after checking the true height on pokemon.com which is displayed there in feet.
		let correctHeight = function () {
			heightFromApi = pokemon.height.toString();

			if (heightFromApi.length < 2) {
				heightFromApi = '0.' + heightFromApi;
			} else {
				heightFromApi = heightFromApi[0] + '.' + heightFromApi[1];
			}
			return heightFromApi;
		};

		let paragraph = $('<p></p>');
		paragraph.text(
			`${capitalisedName} is a Pokemon of type[s]: ${stringifiedTypes} and has a height of ${correctHeight()} meters. Its abilities are: ${stringifiedAbilities}.`
		);
		paragraph.addClass('mt-3');

		modalTitle.append(name);
		modalBody.append(spriteElement);
		modalBody.append(paragraph);
	}

	return {
		addToPokemonList: addToPokemonList,
		getPokemonListContents: getPokemonListContents,
		loadDataFromApi: loadDataFromApi,
		loadDetails: loadDetails,
		addToDom: addToDom,
	};
})();

pokemonRepository.loadDataFromApi().then(function () {
	pokemonRepository.getPokemonListContents().forEach((pokemon) => {
		pokemonRepository.addToDom(pokemon);
	});
});

function searchByName() {
	let filter, gridContainer, cards, a, txtValue;
	filter = $('#input').val().toUpperCase();
	// gridContainer = document.getElementById('pokemon-grid');
	// cards = gridContainer.querySelectorAll('.card');
	cards = $('#pokemon-grid .card');
	console.log(cards);
	for (i = 0; i < cards.length; i++) {
		a = cards[i].querySelector('.card-body').querySelector('.btn');

		txtValue = a.textContent || a.innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
			cards[i].style.display = '';
		} else {
			cards[i].style.display = 'none';
		}
	}
}
let inputElement = $('#input');
inputElement.on('keyup', searchByName);

let clearSearchButton = $('#clear-search');
clearSearchButton.on('click', function () {
	$('#input').val('').trigger('keyup');
});
