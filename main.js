$('#submit').click(function(){
	var color = parseFloat($('input:radio[name="color"]:checked').val(), 10);
	var preference = parseFloat($('input:radio[name="preference"]:checked').val(), 10);
	var phone = parseInt($('#phone').val(), 10);
	var carrier = $('#carrier').val();

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
});