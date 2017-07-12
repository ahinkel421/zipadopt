$(document).ready(function() {
	$('#first-form').submit(function(event) {
		$('#page-one').addClass('hidden');
		$('#page-two').removeClass('hidden');
		event.preventDefault();
		let animalChoice = $('.js-animal-choice').val();
		let breedChoice = $('.js-breed-choice').val();
		console.log(animalChoice);
		getDataFromApi(animalChoice);
		console.log(breedChoice);

	});

	$('#nav-header').click(function(event) {
		location.reload();
	});
	function getDataFromApi(animalChoice) {
		$.ajax({
			url: "https://api.petfinder.com/pet.find",
			type: 'Get',
			data: {
				format: 'json',
				key: 'fc1327e0ada9ec0e14f4de6009f2b8fa',
				location: '20855',
				animal: animalChoice
			},
			dataType: 'jsonp',
			success: function(data) {

				const petArray = data.petfinder.pets.pet;

				for(var i=0; i < petArray.length; i++) {
					var currentPet = petArray[i];
					if (currentPet.media.photos) {

						const currentPetPic = currentPet.media.photos.photo[0].$t;
						const currentPetName = currentPet.name.$t;
						const currentPetBreed = currentPet.breeds.breed[0]? currentPet.breeds.breed[0].$t : "Breed not listed";
						const currentPetAge = currentPet.age.$t;
						const currentPetGender = currentPet.sex.$t;
						const currentPetSize = currentPet.size.$t;

						var petElement = $('#model-pet').find('.pet').clone();
						petElement.attr('id', i);

						petElement.find('img').attr('src', currentPetPic);
						petElement.find('.pet-name').text(currentPetName);
						petElement.find('.pet-breed').text(currentPetBreed);
						petElement.find('.pet-age').text(currentPetAge + ' |');
						petElement.find('.pet-gender').text(currentPetGender + ' | ');
						petElement.find('.pet-size').text(currentPetSize);

						$('#pet-choices').append(petElement);
					}
				}
				$(".modal-launcher, #modal-background, #modal-close").click(function () {
					$("#modal-content, #modal-background").toggleClass("active");
					var petIndex = $(this).attr('id');
					

					if (petIndex !== 'modal-close') {
						var currentPet = petArray[petIndex];
						console.log(currentPet);
						const currentPetName = currentPet.name.$t;
						console.log(currentPetName);
						$('#modal-content').find('.pet-name').text(currentPetName);
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

//1. Change animals to dropdown !!
//2. The model (page 3) when you click on animals !!
//3. Style modal
//3. Making animals and names clickable
//4. Having animals show up on map
//5. Fix quality of images
//6. Fix responsive design
//7. Change M/F and S/M/L to Male/Female and small/med./large
//8. Search by gender
//9. Search by breed
//10. Handle no results found
//11. Get new search functioning



