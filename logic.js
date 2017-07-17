var state = {
	animalChoice: '',
	breedChoice: '',
	sizeChoice: '',
	petArray:[],
	clickedPetIndex:-1
};

$(document).ready(function() {

	$('#first-form').submit(function(event) {
		event.preventDefault();
		$('#page-one').addClass('hidden');
		$('#page-two').removeClass('hidden');
		state.animalChoice = $('.js-animal-choice').val();
		state.breedChoice = $('.js-breed-choice').val();
		state.sizeChoice = $('#size-selector').val();
		getDataFromApi(state);
	});

	// not working -> ?
	$('#nav-form').submit(function(event) {
		event.preventDefault();
		// state.animalChoice = $('#nav-animal-choice').val();
		// state.breedChoice = $('#nav-breed-choice').val();
		// state.sizeChoice = $('#nav-size-choice').val();
		// getDataFromApi(state);
	});

	// This allows a new search.
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
				state.petArray = data.petfinder.pets.pet; // 25 pets
				if (state.petArray === undefined) {
					$('#no-results-found').removeClass('hidden');
					$('#sadcat-pic').removeClass('hidden');
				} else {
					displayPetData(state.petArray);
				}
			},
			error: function(request, error) {
				console.log('error', request);
			}
		});
	}
});

// This opens modal + sets the modal data
$('#pet-choices').on('click', '.modal-launcher', function(event) {
	$("#modal-content, #modal-background").addClass("active");
	var petIndex = $(this).attr('id');
	state.clickedPetIndex=petIndex;
	displayPetModal();
	
});

// This closes the modal
$("#modal-background, .modal-close").click(function () {
	$("#modal-content, #modal-background").removeClass("active");
});


$('#left-arrow').click(function(event) {
	if (state.clickedPetIndex > 0) {
		state.clickedPetIndex--;
	}
	else {
		state.clickedPetIndex = 24;
	}
	displayPetModal();
})
$('#right-arrow').click(function(event) {
	if (state.clickedPetIndex < 24) {
		state.clickedPetIndex++;
	}
	else {
		state.clickedPetIndex = 0;
	}
	displayPetModal();
})

function displayPetModal() {
	let currentPet = state.petArray[state.clickedPetIndex];
	let clickedPetPic = currentPet.media.photos.photo[2].$t;
	let clickedPetName = currentPet.name.$t;
	let clickedPetAge = currentPet.age.$t;
	let clickedPetGender = currentPet.sex.$t;
	let clickedPetBreed = currentPet.breeds.breed[0]? currentPet.breeds.breed[0].$t : state.breedChoice;
	let clickedPetSize = currentPet.size.$t;
	let clickedPetDescription = currentPet.description.$t;
	clickedPetGender = getPetGenderFullString(clickedPetGender);
	clickedPetSize = getPetSizeFullString(clickedPetSize);

	$('#modal-content').find('.pet-name').text(clickedPetName);
	$('.modal-pet-pic').attr('src', clickedPetPic);
	$('#modal-pet-age').text(clickedPetAge);
	$('#modal-pet-gender').text(clickedPetGender);
	$('#modal-pet-breed').text(clickedPetBreed);
	$('#modal-pet-size').text(clickedPetSize);
	$('#modal-pet-description').text(clickedPetDescription);
}

function displayPetData(petArray){
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

			currentPetGender = getPetGenderFullString(currentPetGender);
			currentPetSize = getPetSizeFullString(currentPetSize);

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


function getPetGenderFullString(currentPetGender){
	if (currentPetGender === 'M') {
		return 'Male';
	}
	else if (currentPetGender === "F") {
		return 'Female';
	}
	else if (currentPetGender === "U") {
		return "Gender not listed";
	}
}

function getPetSizeFullString(currentPetSize){
	if (currentPetSize === 'S') {
		return 'Small';
	}
	else if (currentPetSize === 'M') {
		return 'Medium';
	}
	else if (currentPetSize === 'L') {
		return 'Large';
	}
	else {
		return 'Size not listed'
	}
}


//Things to fix

// Having animals show up on map
// Get 'new search' functioning (line 18)
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
// Handle clickable arrows to change pet in modal 



