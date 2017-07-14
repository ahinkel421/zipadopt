var state = {
	animalChoice: '',
	breedChoice: ''
};

$(document).ready(function() {
	$('#first-form').submit(function(event) {
		$('#page-one').addClass('hidden');
		$('#page-two').removeClass('hidden');
		event.preventDefault();
		state.animalChoice = $('.js-animal-choice').val();
		state.breedChoice = $('.js-breed-choice').val();
		getDataFromApi(state);
	});

	//Tried, but isn't working ???

	$('#nav-form').submit(function(event) {
		event.preventDefault();
		let navAnimalChoice = $('#nav-animal-choice').val();
		let navBreedChoice = $('#nav-breed-choice').val();
		console.log(navAnimalChoice);
		getDataFromApi(navAnimalChoice);
	})

	$('#nav-header').click(function(event) {
		location.reload();
	});
	function getDataFromApi(state) {
		$.ajax({
			url: "https://api.petfinder.com/pet.find",
			type: 'Get',
			data: {
				format: 'json',
				key: 'fc1327e0ada9ec0e14f4de6009f2b8fa',
				location: '20855',
				animal: state.animalChoice,
				breed: state.breedChoice
			},
			dataType: 'jsonp',
			success: function(data) {

				const petArray = data.petfinder.pets.pet;

				for(var i=0; i < petArray.length; i++) {
					var currentPet = petArray[i];
					if (currentPet.media.photos) {

						const currentPetPic = currentPet.media.photos.photo[0].$t;
						const currentPetName = currentPet.name.$t;
						const currentPetBreed = currentPet.breeds.breed[0]? currentPet.breeds.breed[0].$t : state.breedChoice;
						// const currentPetBreedsArray = currentPet.breeds.breed;
						// console.log(currentPetBreedsArray);
						// var currentPetBreeds = "";

						// for (var i = 0; i < currentPetBreedsArray.length; i++) {
						// 	var currentBreed = currentPetBreedsArray[i];
						// 	currentPetBreeds = currentPetBreeds + currentBreed + " | ";
						// }

						// currentPetBreeds = currentPetBreeds.slice(0, -3);

						const currentPetAge = currentPet.age.$t;
						let currentPetGender = currentPet.sex.$t;
						let currentPetSize = currentPet.size.$t;

						var petElement = $('#model-pet').find('.pet').clone();
						petElement.attr('id', i);

						if (currentPetGender === 'M') {
							currentPetGender = 'Male';
						}
						else if (currentPetGender === "F") {
							currentPetGender = 'Female';
						}
						else if (currentPetGender === "U") {
							currentPetGender = "Unknown";
						}

						if (currentPetSize === 'S') {
							currentPetSize = 'Small';
						}
						else if (currentPetSize === 'M') {
							currentPetSize = 'Medium';
						}
						else if (currentPetSize === 'L') {
							currentPetSize = 'Large';
						}
						else {
							currentPetSize = 'Size not listed'
						}

						petElement.find('img').attr('src', currentPetPic);
						petElement.find('.pet-name').text(currentPetName);
						petElement.find('.pet-breed').text(currentPetBreed);
						petElement.find('.pet-age').text(currentPetAge + ' |');
						petElement.find('.pet-gender').text(currentPetGender + ' | ');
						petElement.find('.pet-size').text(currentPetSize);

						$('#pet-choices').append(petElement);
					}
				}
				$(".modal-launcher, #modal-background, .modal-close").click(function () {
					$("#modal-content, #modal-background").toggleClass("active");
					var petIndex = $(this).attr('id');

					if (petIndex !== 'modal-close') {
						let currentPet = petArray[petIndex];
						let clickedPetPic = currentPet.media.photos.photo[0].$t;
						let clickedPetName = currentPet.name.$t;
						let clickedPetAge = currentPet.age.$t;
						let clickedPetGender = currentPet.sex.$t;
						let clickedPetBreed = currentPet.breeds.breed[0]? currentPet.breeds.breed[0].$t : state.breedChoice;
						let clickedPetSize = currentPet.size.$t;
						let clickedPetDescription = currentPet.description.$t;
						console.log(clickedPetDescription);

						if (clickedPetGender === 'M') {
							clickedPetGender = 'Male';
						}
						else if (clickedPetGender === 'F') {
							clickedPetGender = "Female";
						}
						else { 
							clickedPetGender = "Unknown";
						}

						if (clickedPetSize === 'S') {
							clickedPetSize = 'Small';
						}
						else if (clickedPetSize === 'M') {
							clickedPetSize = 'Medium';
						}
						else if (clickedPetSize === 'L') {
							clickedPetSize = 'Large';
						}
						else {
							clickedPetSize = 'Size not listed'
						}

						$('#modal-content').find('.pet-name').text(clickedPetName);
						$('.modal-pet-pic').attr('src', clickedPetPic);
						$('#modal-pet-age').text(clickedPetAge);
						$('#modal-pet-gender').text(clickedPetGender);
						$('#modal-pet-breed').text(clickedPetBreed);
						$('#modal-pet-size').text(clickedPetSize);
						$('#modal-pet-description').text(clickedPetDescription);
					}
				});	
			},
			error: function(request, error) {
				console.log('error', request);
			}
		});
	}
});

//Things to fix

// ! Style modal
// Having animals show up on map
// Fix quality of images
// Search by gender
// Search by breed
// Handle no results found
// (tried) Get 'new search' functioning
// Handle clickable arrows to change pet in modal
// Prevent modal from scrolling
// Can't change width of x button in media query
// When maximizing page, modal doesn't center
// Get arrow to float around name

//FIXED 

// Change animals to dropdown 
// The model (page 3) when you click on animals 
// Fix responsive design 
// Change M/F and S/M/L to Male/Female and small/med./large 





