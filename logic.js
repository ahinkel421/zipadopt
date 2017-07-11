$(document).ready(function() {
	$('#first-form').submit(function(event) {
		$('#page-one').addClass('hidden');
		$('#page-two').removeClass('hidden');
		event.preventDefault();
		getDataFromApi();
	});
	$('#nav-header').click(function(event) {
		$('#page-two').addClass('hidden');
		$('#page-one').removeClass('hidden');
	})
	function getDataFromApi() {
		$.ajax({
			url: "https://api.petfinder.com/pet.find",
			type: 'Get',
			data: {
				format: 'json',
				key: 'fc1327e0ada9ec0e14f4de6009f2b8fa',
				location: '20855',
				breed: 'golden retriever'
			},
			dataType: 'jsonp',
			success: function(data) {

				const petArray = data.petfinder.pets.pet;

				console.log(petArray.length)
				for(var i=0; i < petArray.length; i++) {
					var currentPet = petArray[i];

					const currentPetPic = currentPet.media.photos.photo[0].$t
					const currentPetName = currentPet.name.$t;
					const currentPetBreed = currentPet.breeds.breed[0]? currentPet.breeds.breed[0].$t : "unknown"
					const currentPetAge = currentPet.age.$t;
					const currentPetGender = currentPet.sex.$t;
					const currentPetSize = currentPet.size.$t;

					var petElement = $('#model-pet').find('.pet').clone();


					petElement.find('img').attr('src', currentPetPic);
					petElement.find('.pet-name').text(currentPetName);
					petElement.find('.pet-breed').text(currentPetBreed);
					petElement.find('.pet-age').text(currentPetAge + ' |');
					petElement.find('.pet-gender').text(currentPetGender + ' | ');
					petElement.find('.pet-size').text(currentPetSize);

					$('#pet-choices').append(petElement);

				}





				
				$('#pet1').find('img').attr('src', firstPetPic);
				$('#pet1').find('.pet-name').text(firstPetName);
				$("#pet1").find('.pet-breed').text(firstPetBreed);
				$('#pet1').find('.pet-age').text(firstPetAge + ' |');
				$('#pet1').find('.pet-gender').text(firstPetGender + ' | ');
				$('#pet1').find('.pet-size').text(firstPetSize);

				// const secondPet = petArray[1]
				// const secondPetPic = secondPet.media.photos.photo[0].$t
				// const secondPetName = secondPet.name.$t;
				// const secondPetBreed = secondPet.breeds.breed[0].$t
				// const secondPetAge = secondPet.age.$t;
				// const secondPetGender = secondPet.sex.$t;
				// const secondPetSize = secondPet.size.$t;


				// $('#pet2').find('img').attr('src', secondPetPic);
				// $('#pet2').find('.pet-name').text(secondPetName);
				// $('#pet2').find('.pet-breed').text(secondPetBreed);
				// $('#pet2').find('.pet-age').text(secondPetAge + ' |');
				// $('#pet2').find('.pet-gender').text(secondPetGender + ' | ');
				// $('#pet2').find('.pet-size').text(secondPetSize);
				// console.log(secondPetGender);

			},
			error: function(request, error) {
				console.log('error', request);
			}
		})
	}
});