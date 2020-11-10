let pokemonRepository = (function () {
	let pokemonList = [];
	let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=20';

	function addToPokemonList(pokemonFromApi) {
		pokemonList.push(pokemonFromApi);
	}
	function getPokemonListContents() {
		return pokemonList;
	}
	// Loads initial object of name and detailsUrl and adds it to the pokemonList
	function loadDataFromApi() {
		$.ajax(apiUrl).done((response) => {
			response.results.forEach((item) => {
				let pokemon = {
					name: item.name,
					detailsUrl: item.url,
				};
				addToPokemonList(pokemon);
			});
		});
	}

	// Loads the auxiliary details as key/value pairs for each Pokemon and stores it in the pokemonList
	function loadDetails(listItem) {
		let url = listItem.detailsUrl;
		$.ajax(url).done((data) => {
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
    
    

	return {
		addToPokemonList: addToPokemonList,
		getPokemonListContents: getPokemonListContents,
		loadDataFromApi: loadDataFromApi,
		loadDetails: loadDetails,
	};
})();

pokemonRepository.loadDataFromApi();


