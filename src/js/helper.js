import { Dialog } from 'quasar'

$(document).on('click','#load_changes',function(){
	update();
});
function update () {
	if(navigator.connection.type!=Connection.NONE)
	{
		$("#fidgetSpinner").removeClass("hidden");
		load_faculty();
		load_spec();
		load_grups();
		load_teachers();
		load_korpus();
		load_audi();
	}
}
function load_faculty()
{
	$.ajax({
		url:'http://raspisanie.asu.edu.ru/student/faculty',
		type:'POST',
		crossDomain:true,
		success:function(data){
			var result = JSON.parse(data);
			if(result!=null)
			{
				localStorage.setItem('faculties',data);
			}
		},
		error:function (data) {

		}
	});
}
function load_spec () {
	$.ajax({
		 url: 'http://m.raspisanie.asu.edu.ru/student/specialty',
		 type:'POST',
		 success:function (data) {
		 	var result = JSON.parse(data);
		 	if(result!=null)
			{
				localStorage.setItem('all_specialities',data);
			}
		 },
		 complete:function () {
		 },
		 error:function () {

		}
	});
}
function load_grups () 
{
    jQuery.ajax({
      url: 'http://raspisanie.asu.edu.ru/student/grup',
      type: 'POST',
      success: function(data)
      {
      	var result = JSON.parse(data);
      	if(result!=null && result.length!=0)
      	{
        	localStorage.setItem('all_groupies',data);
    	}
      },
      error:function(){

      },

    });
}
function load_teachers()
{
	$.ajax({
		url:'http://raspisanie.asu.edu.ru/teacher/all',
		type:'GET',
		success:function(data)
		{
			var birds = JSON.parse(data);
			if(birds!=null)
			{
				localStorage.setItem('birds',data);
			}
		},
	});
}
function load_korpus()
{
	jQuery.ajax({
		url:'http://raspisanie.asu.edu.ru/audience/korpus',
		type:'POST',
		success:function(data)
		{
			var korpuses = jQuery.parseJSON(data);
			if(korpuses!=null)
			{
				localStorage.setItem('korpuses',data);
			}
		}
	});
}
function load_audi()
{
	jQuery.ajax({
  		url:'http://raspisanie.asu.edu.ru/audience/audience',
  		type:'POST',
  		success:function(data){
  			var result = jQuery.parseJSON(data);
  			if(result!=null){localStorage.setItem('all_aud', data);}
  		},
  		complete:function()
  		{
  			$("#fidgetSpinner").addClass("hidden");
  			Dialog.create({
  				title:'Успех!',
  				message:'Успешная загрузка данных'
  			});
  		},
  		error : function()
  		{
  			$("#fidgetSpinner").addClass("hidden");
  			Dialog.create({
  				title:'Ошибка!',
  				message:'Ошибка при загрузке данных'
  			});
  		}

  	});
}
