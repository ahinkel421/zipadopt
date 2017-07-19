var state = {
	animalChoice: '',
	breedChoice: '',
	sizeChoice: '',
	locationChoice: '',
	petArray:[],
	clickedPetIndex:-1,
	markers: []
};
var geocoder;
var map;



$(document).ready(function() {



	function initialize() {
		geocoder = new google.maps.Geocoder();
		var latlng = new google.maps.LatLng(40.648610, -101.942230);
		var mapOptions = {
			zoom: 4,
			center: latlng,
			zoomControl: true,
			zoomControlOptions: {
				position: google.maps.ControlPosition.TOP_LEFT
			},
		};
		map = new google.maps.Map(document.getElementById('map'), mapOptions);
	}

	function cleanMarkers(){
		state.markers=[];
	}

	function centerMapToLocation(state) {
		var addressSearch = state.locationChoice;

		getLatLngFromAddressAsync(addressSearch, function(location) {
				map.setCenter(location);
				map.setZoom(9);
			} )	
	}


	function handleLocationError(browserHasGeolocation, infoWindow, pos) {
		infoWindow.setPosition(pos);
		infoWindow.setContent(browserHasGeolocation ?
			'Error: The Geolocation service failed.' :
			'Error: Your browser doesn\'t support geolocation.');
	};


	function displayError() {
		$('#no-results-found').removeClass('hidden');
		$('#sadcat-pic').removeClass('hidden');
		$('#address-instructions-box').removeClass('hidden');
	}
	

	$('#first-form').submit(function(event) {
		event.preventDefault();
		$('#page-one').addClass('hidden');
		$('#page-two').removeClass('hidden');
		state.animalChoice = $('.js-animal-choice').val();
		state.breedChoice = $('.js-breed-choice').val();
		state.sizeChoice = $('#size-selector').val();
		state.locationChoice = $('.js-zip-choice').val();
		getDataFromApi(state);
		cleanMarkers();
		initialize();
		centerMapToLocation(state);
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
		var requestData = {
			format: 'json',
			key: 'fc1327e0ada9ec0e14f4de6009f2b8fa',
			animal: state.animalChoice,
			breed: state.breedChoice,
			size: state.sizeChoice,
			'location': 'united states'
		}
	
		if (state.locationChoice !== '') {
			requestData.location = state.locationChoice;
		}

		$.ajax({
			url: "https://api.petfinder.com/pet.find",
			type: 'Get',
			data: requestData,
			dataType: 'jsonp',
			success: function(data) {
		
				if (data.petfinder.pets === undefined) {
					displayError(); 
					return
				}
				state.petArray = data.petfinder.pets.pet; // 25 pets
				if (state.petArray === undefined) {
					displayError();
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

// This 
$('#pet-choices').on('mouseover', '.pet', function(event) {
	var petIndex = $(this).attr('id');
	var marker = state.markers[petIndex]
	if(marker){
		marker.setIcon('images/icn_orange.png');
	}
});

$('#pet-choices').on('mouseout', '.pet', function(event) {
	var petIndex = $(this).attr('id');
	var marker = state.markers[petIndex]
	if(marker){
		marker.setIcon('images/icn_blue.png');
	}
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
	
	function createMarker(latlon, currentPetName, index){

		var marker = new google.maps.Marker({
			position: latlon,
			map: map,
			title: currentPetName,
			icon: 'images/icn_blue.png'
		});
		// google.maps.event.addListener(marker, 'click', function() {
		// 	this.infowindow.setContent(marker.contentString);
		// 	this.infowindow.open(map, this);
		// })
		state.markers[index]=marker
	}

function displayPetData(petArray){
	petArray.forEach(function(currentPet, index){
		//var currentPet = petArray[i];
		if (currentPet.media.photos) {
			const currentPetPic = currentPet.media.photos.photo[2].$t;
			const currentPetName = currentPet.name.$t;
			const currentPetBreed = currentPet.breeds.breed[0]? currentPet.breeds.breed[0].$t : state.breedChoice;
			const currentPetAge = currentPet.age.$t;
			let currentPetGender = currentPet.sex.$t;
			let currentPetSize = currentPet.size.$t;
			let currentPetLocation = currentPet.contact.address1.$t || currentPet.contact.city.$t;

			var petLocationFinder = getLatLngFromAddressAsync.bind(null, currentPetLocation, function(location) {
				createMarker(location, currentPetName, index);
			})	

			//slow down querying google apif or locations. 
		    setTimeout(petLocationFinder, index*650);
		

			var petElement = $('#model-pet').find('.pet').clone();
			petElement.attr('id', index);

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
	})
}

function getLatLngFromAddressAsync(addressSearch, callback) {

	if (!addressSearch) { return; }
	geocoder.geocode( { 'address': addressSearch}, function(results, status) {

		if (status == 'OK') {
			callback(results[0].geometry.location)
		} 
	});
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

//===============
// Things to fix
//===============

// If user searches invalid address
	//pet is undefined
	//no results found not working anymore

// If they have an address:
	// Get geocode of address (GeoCoder)
	// Show that latLong using a marker.
	// Hover over pets, highlights marker on map

// Get 'new search' functioning 
// Prevent modal from scrolling (optional)

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
// Center the map on the user location
// Getting the address of the pet.

//If location === '' do not ask api for location
// If user searches invalid address
	//pet is undefined
	//no results found not working anymore

//READ THESE 

// https://taypsl.github.io/explore-the-wikihood/
// https://github.com/taypsl/explore-the-wikihood






