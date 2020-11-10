let pokemonRepository = (function () {
	let pokemonList = [];
	let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=20';

	function addToPokemonList(pokemonFromApi) {
		pokemonList.push(pokemonFromApi);
	}
	function getPokemonListContents() {
		return pokemonList;
	}
	// // Loads initial object of name and detailsUrl and adds it to the pokemonList
	function loadDataFromApi() {
		return fetch(apiUrl)
			.then((response) => response.json())
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
		return fetch(url)
			.then((response) => response.json())
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
			let cardContainer = $('<div></div>').addClass('col col-sm-6 col-md-4');
			let card = $('<div></div>').addClass('card text-center bg-light my-2 flex-grow-0 border border-warning');
			// card.attr({
			// 	maxWidth: '33%',
			// 	minWidth: '200px',
			// });

			let cardImg = $('<img>');
			cardImg.addClass('card-img-top card-image w-50 h-50 mx-auto my-3');
			cardImg.attr({
				src: pokemon.imageUrlAnimation,
				alt: 'gif of Pokemon',
			});

			let cardBody = $('<div></div>');
			cardBody.addClass('card-body');

			let modalButton = $('<button></button>');
			modalButton.text(pokemon.name);
			modalButton.addClass('btn btn-primary btn-lg text-capitalize text-warning bg-secondary');
			modalButton.attr('type', 'button');
			// modalButton.setAttribute('data-toggle', 'modal');
			// modalButton.setAttribute('data-target', '#ModalCenter');

			cardBody.append(modalButton);
			card.append(cardImg);
			card.append(cardBody);
			cardContainer.append(card);
			pokemonGrid.append(cardContainer);

			// modalButton.addEventListener('click', function () {
			// 	showModal(pokemon);
			// });
		});
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
