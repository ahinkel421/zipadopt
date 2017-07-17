var state = {
	animalChoice: '',
	breedChoice: '',
	sizeChoice: ''
};

$(document).ready(function() {
	$('#first-form').submit(function(event) {
		$('#page-one').addClass('hidden');
		$('#page-two').removeClass('hidden');
		event.preventDefault();
		state.animalChoice = $('.js-animal-choice').val();
		state.breedChoice = $('.js-breed-choice').val();
		state.sizeChoice = $('#size-selector').val();
		getDataFromApi(state);
	});

	$('#nav-form').submit(function(event) {
		// event.preventDefault();
		state.animalChoice = $('#nav-animal-choice').val();
		state.breedChoice = $('#nav-breed-choice').val();
		state.sizeChoice = $('#nav-size-choice').val();
		console.log(state.sizeChoice);
		getDataFromApi(state);
	});

	$('#nav-header, #search-again').click(function(event) {
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
				breed: state.breedChoice,
				size: state.sizeChoice
			},
			dataType: 'jsonp',
			success: function(data) {

				const petArray = data.petfinder.pets.pet;

				if (petArray === undefined) {
					$('#no-results-found').removeClass('hidden');
					$('#sadcat-pic').removeClass('hidden');
				}

				else {

					for(var i=0; i < petArray.length; i++) {
						var currentPet = petArray[i];

						if (currentPet.media.photos) {

							const currentPetPic = currentPet.media.photos.photo[2].$t;
							const currentPetName = currentPet.name.$t;
							const currentPetBreed = currentPet.breeds.breed[0]? currentPet.breeds.breed[0].$t : state.breedChoice;
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
								currentPetGender = "Gender not listed";
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
				}
				$(".modal-launcher, #modal-background, .modal-close").click(function () {
					$("#modal-content, #modal-background").toggleClass("active");
					var petIndex = $(this).attr('id');

					if (petIndex !== 'modal-close') {
						let currentPet = petArray[petIndex];
						let clickedPetPic = currentPet.media.photos.photo[2].$t;
						let clickedPetName = currentPet.name.$t;
						let clickedPetAge = currentPet.age.$t;
						let clickedPetGender = currentPet.sex.$t;
						let clickedPetBreed = currentPet.breeds.breed[0]? currentPet.breeds.breed[0].$t : state.breedChoice;
						let clickedPetSize = currentPet.size.$t;
						let clickedPetDescription = currentPet.description.$t;

						if (clickedPetGender === 'M') {
							clickedPetGender = 'Male';
						}
						else if (clickedPetGender === 'F') {
							clickedPetGender = "Female";
						}
						else { 
							clickedPetGender = "Gender not listed";
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

						//Attempt to make arrow clickable. Not functioning properly

						$('#left-arrow').click(function(event) {
							currentPet = petArray[petIndex--];
							clickedPetName = currentPet.name.$t;
							clickedPetPic = currentPet.media.photos.photo[2].$t;
							clickedPetAge = currentPet.age.$t;
							clickedPetGender = currentPet.sex.$t;
							clickedPetBreed = currentPet.breeds.breed[0]? currentPet.breeds.breed[0].$t : state.breedChoice;
							clickedPetSize = currentPet.size.$t;
							clickedPetDescription = currentPet.description.$t;

							$('#modal-pet-name').text(clickedPetName);
							$('.modal-pet-pic').attr('src', clickedPetPic);
							$('#modal-pet-age').text(clickedPetAge);
							$('#modal-pet-gender').text(clickedPetGender);
							$('#modal-pet-breed').text(clickedPetBreed);
							$('#modal-pet-size').text(clickedPetSize);
							$('#modal-pet-description').text(clickedPetDescription);
						})
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

// Having animals show up on map
// Get 'new search' functioning (line 18)
// Handle clickable arrows to change pet in modal (line 150)
// Prevent modal from scrolling

//FIXED 

// Change animals to dropdown 
// The model (page 3) when you click on animals 
// Fix responsive design 
// Change M/F and S/M/L to Male/Female and small/med./large 
// Style modal
// Search by gender
// Search by breed
// Fix quality of images
// Make x button in modal responsive
// Handle no results found




