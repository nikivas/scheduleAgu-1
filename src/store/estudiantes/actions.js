//////////////////////////////////////////////////HistoryAPI////////////////////////////////////////////////
import autocomplete from "../../js/jquery.ui.js";
import scrollTo from "../../js/jquery.scroll.js";

export function current_group() {
  var grupa = localStorage.getItem("grup_name");
  $("#grup").val(grupa);
}
export function load_faculty(state) {
  /*загрузка факультетов*/
  $("#spinnerFaculty").addClass("visible");
  $("#message_info").text("Загрузка Факультетов");
  state.rootGetters["mywaves/getFaculties"]
    .then(response => {
      for (var i = 0; i < response.length; i++) {
        $("#facul").append(
          $("<option></option>")
            .attr("value", $.trim(response[i].id))
            .text(response[i].name)
        );
      }
      var choosen_faculty = localStorage.getItem("faculty_choosen")
        ? localStorage.getItem("faculty_choosen")
        : response.length != 0
        ? $.trim(response[0].id)
        : "no";
      $("#facul").val(choosen_faculty);
      load_specialty(state, $("#facul").val());
    })
    .catch(err => {});
}

export function load_specialty(state, id_spec) {
  //специальностей, по выбранному факультету
  //При первом запуске
  localStorage.setItem("choosen_speciality", id_spec);
  $("#message_info").text("Загрузка специальностей");
  state.rootGetters["mywaves/getSpecialities"].then(json => {
    $("#spec").empty();
    for (var i = 0; i < json.length; i++) {
      if (json[i].kod_spec == id_spec) {
        $("#spec").append(
          $("<option></option>")
            .attr("value", $.trim(json[i].id))
            .text(json[i].name)
        );
      }
    }
    var choosen_speciality_item = localStorage.getItem(
      "choosen_speciality_item"
    )
      ? localStorage.getItem("choosen_speciality_item")
      : $("#spec option")
          .eq(0)
          .val();
    if (
      $(
        "#spec option[value='" +
          localStorage.getItem("choosen_speciality_item") +
          "']"
      ).length != 0
    ) {
      $("#spec").val(localStorage.getItem("choosen_speciality_item"));
    }
    //$('#spec').val(choosen_speciality_item);
    localStorage.setItem("choosen_speciality_item", choosen_speciality_item);

    preloaded_kurses(state);
    load_grup(state, $('input[name="kurs"]:checked').val());
  });
}

export function preloaded_kurses(state) {
  $("#kurs").empty();
  var str = "";
  for (var i = 1; i < 7; i++) {
    str +=
      "<input class='kursCheckbox form-radio' type='radio' name='kurs' value='" +
      i +
      "'>" +
      i +
      "&nbsp;&nbsp;&nbsp;";
    if (i % 3 == 0 && $(document).width() <= 400) {
      str += "<br/>";
    }
  }
  $("#kurs").append(str);
  $(
    "input:radio[name='kurs'][value='" +
      localStorage.getItem("choosen_kurs") +
      "']"
  ).prop("checked", true);
  $(".kursCheckbox").on("click", function(event) {
    var new_value = $(this).attr("value");
    kursCheckboxClicked(state, new_value);
  });
}

export function faculChanged(state) {
  console.log("facul changed");
  localStorage.setItem("faculty_choosen", $("#facul").val());
  load_specialty(state, $("#facul").val());
}
export function specChanged(state) {
  localStorage.setItem("choosen_speciality_item", $("#spec").val());
  load_grup(state, $('input[name="kurs"]:checked').val());
  localStorage.removeItem("choosen_groups");
}
export function kursCheckboxClicked(state, new_value) {
  if (new_value != localStorage.getItem("choosen_kurs")) {
    localStorage.setItem("choosen_kurs", $('input[name="kurs"]:checked').val());
    localStorage.removeItem("choosen_groups");
    load_grup(state, $('input[name="kurs"]:checked').val());
  }
}
export function grupChecked(state, _object) {
  var choosen_groups =
    localStorage.getItem("choosen_groups") != null
      ? jQuery.parseJSON(localStorage.getItem("choosen_groups"))
      : [];
  if (_object.prop("checked")) {
    choosen_groups.push(_object.attr("value"));
    localStorage.setItem("choosen_groups", JSON.stringify(choosen_groups));
  } else {
    var index = choosen_groups.indexOf(_object.attr("value"));
    choosen_groups.splice(index, 1);
    localStorage.setItem("choosen_groups", JSON.stringify(choosen_groups));
  }
}
export function load_grup(state, kurs) {
  //загрузка группы, по умолчанию hidden, если грпп несколько, то видны для пользователя
  $("#spinnerFaculty").removeClass("invisible");
  $("#spinnerFaculty").addClass("visible");
  $("#message_info").text("Загрузка курсов");
  if (
    !localStorage.getItem("all_groupies") ||
    localStorage.getItem("all_groupies") == ""
  ) {
    var val_spec = $("#spec").val();
    state.rootGetters["mywaves/getGroups"]
      .then(json => {
        $("#spinnerFaculty").addclass("invisible");
      })
      .catch(() => {
        $("#spinnerFaculty").addclass("invisible");
      });
  } else {
    var grupie = jQuery.parseJSON(localStorage.getItem("all_groupies"));
    var spliter;
    var spec = $("#spec").val() ? $("#spec").val() : "";
    spliter = spec.split("?");
    $("#groups").empty();
    var count_added = 0;
    var choosen_groups =
      localStorage.getItem("choosen_groups") != null
        ? jQuery.parseJSON(localStorage.getItem("choosen_groups"))
        : [];
    var filtered_groups = grupie.filter(function(item) {
      return item.KURS == kurs && item.SHIFR_SPEC_NEW == spliter[0];
    });
    for (var i = 0; i < filtered_groups.length; i++) {
      var appended_result;
      if (choosen_groups.includes(filtered_groups[i].GRUP) == true) {
        appended_result =
          "<input type='checkbox' value='" +
          filtered_groups[i].GRUP +
          "' name='grupovuha' checked class='grupCheckbox form-radio animated bounceIn' />" +
          filtered_groups[i].GRUP;
      } else {
        appended_result =
          "<input type='checkbox' value='" +
          filtered_groups[i].GRUP +
          "' name='grupovuha' class='grupCheckbox form-radio animated bounceIn' />" +
          filtered_groups[i].GRUP;
      }
      $("#groups").append(appended_result);
      count_added++;
      if (count_added % 3 == 0) {
        $("#groups").append("<br>");
      }
    }
    $("#spinnerFaculty").addClass("invisible");
    if (filtered_groups.length == 0) {
      $("#studentButton1").addClass("hidden");
    } else {
      $("#studentButton1").removeClass("hidden");
      setTimeout(function() {
        $("#studentButton1").addClass("animated bounceIn");
      }, 100);
    }
    $(".grupCheckbox").on("click", function() {
      var _object = $(this);
      grupChecked(state, _object);
    });
  }
}
export const tabClickHandler = state => {

};
