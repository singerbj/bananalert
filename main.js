$('#submit').click(function(){
	var color = parseFloat($('input:radio[name="color"]:checked').val(), 10);
	var preference = parseFloat($('input:radio[name="preference"]:checked').val(), 10);
	var phone = $('#phone').val();
	var carrier = $('#carrier').val();

	var validateColor = function(){
		if(color){
			return true;
		}else{
			return false;
		}
	}

	var validatePreference = function(){
		if(preference){
			return true;
		}else{
			return false;
		}
	}

	var validatePhone = function(){
		if (phone.length === 10){
			var newPhone = phone.replace(/\D/g,'');
			console.log(newPhone);
			if (newPhone.length === 10){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}

	var validateCarrier = function(){
		if(carrier){
			return true;
		}else{
			return false;
		}
	}

	var validateAll = function(){
		if(validateColor() && validatePreference() && validatePhone() && validateCarrier()){
			return true;
		}else{
			return false;
		}
	}

	


	if(validateAll()){

		console.log(color, preference, phone, carrier);

		var bananalife = 5 * 24;

		var lifeLeft = bananalife - (bananalife * color);
		var hoursTilAlert = lifeLeft + preference;

		console.log('hoursTilAlert', hoursTilAlert);

		Date.prototype.addHours= function(h){
		    this.setHours(this.getHours()+h);
		    return this;
		}

		var date = new Date();
		var notifyDate = date.addHours(hoursTilAlert);

		console.log('notifyDate', notifyDate);

		$.ajax({
	        type: "POST",
	        url: '/bananas',
	        dataType: 'json',
	        async: false,
	        data: JSON.stringify({ phone: phone, carrier: carrier, notifyDate: notifyDate }),
	        success: function (data) {
	        	console.log(data);
	        	alert("Your notification has been registered with our Bananalert system. You will recieve an alert when it is ready to be eaten!");
	        },
	        error: function(){
	        	alert("Error, please check all parts of the form are filled out and try again.");
	        }
	    })
	 }else{
	 	alert("Error, please check all parts of the form are filled out and try again.");
	 }
});