import * as shared from '../shared/shared.js';
export function findScheduleByAud()
{
	try
	{
		$("#schedule").empty();
		$("#audButton").prop('disabled',true);
		$('#spinnerKorpus').removeClass('invisible');
		$('#spinnerKorpus').addClass('visible');
		var aud_value = $("#aud").val();
		if(navigator.onLine)
		{
			jQuery.ajax({
				url:'http://raspisanie.asu.edu.ru/audience/schedule/'+aud_value,
				type:'POST',
				timeout : 7000,
				success:function(data){
					var result = jQuery.parseJSON(data);
					localStorage.setItem(aud_value,result);
					$("#schedule").append(result);
					$("#audButton").prop('disabled',false);
				},
				complete:function(){
					$('#spinnerKorpus').addClass('invisible');
					jQuery.scrollTo("#schedule",1000);
					$("#audButton").prop('disabled',false);
					shared.checkDenNed();
				},
				error:function()
				{
					var result = localStorage.getItem(aud_value);
					result!=null? $("#schedule").append(result) 
					: $("#schedule").append('Отсутствует соединение с интернетом.'+
					'Расписание Отсутствует в кэше');
					$('#spinnerKorpus').addClass('invisible');
					jQuery.scrollTo("#schedule",1000);
					$("#audButton").prop('disabled',false);
				}
			});
		}
		else
		{
			var result = localStorage.getItem(aud_value);
			result!=null? $("#schedule").append(result) 
			: $("#schedule").append('Отсутствует соединение с интернетом.'+
			 'Расписание Отсутствует в кэше');
			$('#spinnerKorpus').addClass('invisible');
			jQuery.scrollTo("#schedule",1000);
			$("#audButton").prop('disabled',false);
			shared.checkDenNed();
		}
	}
	catch(ex)
	{
		$("#schedule").append(ex);
		$('#spinnerKorpus').addClass('invisible');
		jQuery.scrollTo("#schedule",1000);
		$("#audButton").prop('disabled',false);
	}
}
export function preloadAddedFunction()
{
	if(localStorage.getItem('choosen_aud'))
	{
		$("#schedule").empty();
		var choosen_aud = localStorage.getItem('choosen_aud');
		$("#schedule").append(localStorage.getItem(choosen_aud));
	}
}