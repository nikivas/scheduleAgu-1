//////////////////////////////////////////////////HistoryAPI////////////////////////////////////////////////
import autocomplete from '../../js/jquery.ui.js';
import scrollTo from '../../js/jquery.scroll.js';
export function levikorpus(state) {
	$("#spinnerKorpus").removeClass("invisible");
	$("#spinnerKorpus").addClass("visible");
	state.rootGetters["mywaves/getAllKorpuses"]
		.then((korpuses) => {
			for (var i = 0; i < korpuses.length; i++) {
				$("#korpus").append($("<option></option>")
					.attr("value", $.trim(korpuses[i].id)).text($.trim(korpuses[i].name)));
			}
			var choosen_korpus = localStorage.getItem('choosen_korpus') ?
				localStorage.getItem('choosen_korpus') :
				korpuses.length != 0 ? $.trim(korpuses[0].id) : 'no';

			$("#korpus").val(choosen_korpus);
			load_aud(state, choosen_korpus);
			
		}).catch(() => {
			$('#spinnerKorpus').addClass('invisible');
		});
};
export function korpusChanged(state) {
	localStorage.setItem('choosen_korpus', $("#korpus").val());
	load_aud(state,$("#korpus").val());
}

export function load_aud(state, korpus) {
	$("#aud").empty();
	$('#spinnerKorpus').removeClass('invisible');
	$('#spinnerKorpus').addClass('visible');
	state.rootGetters["mywaves/getAllAudiences"]
	.then((all_aud)=>{
		for (var i = 0; i < all_aud.length; i++) {
			if (all_aud[i].id_build == korpus) {
				$("#aud").append($("<option></option").attr("value", $.trim(all_aud[i].id)).text(all_aud[i].name));
			}
		}
		if ($("#aud option[value='" + localStorage.getItem('choosen_aud') + "']").length != 0) {
			$('#aud').val(localStorage.getItem('choosen_aud'));
		}
		$('#spinnerKorpus').addClass('invisible');
	});
}
export function audChanged() {
	localStorage.setItem('choosen_aud', $("#aud").val());
}