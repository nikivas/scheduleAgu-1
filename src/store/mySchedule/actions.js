import { Notify } from "quasar";
import { Dialog } from "quasar";
export async function load_faculties(state) {
  $("#message_info").text("Загрузка факультетов. Подождите!");
  state.getters.getFaculties
    .then(data => {
      for (var i = 0; i < data.length; i++) {
        $("#facul").append(
          $("<option></option>")
            .attr("value", $.trim(data[i].id))
            .text(data[i].name)
        );
      }
      load_speacilaty(state, $("#facul").val());
    })
    .catch(ex => {
      $("#spinnerDzyuba").addClass("invisible");
    });
}

function showError() {
  Dialog.create({
    title: "Ошибка!",
    message: "Обратитесь к автору приложения"
  });
}
export async function load_speacilaty(state, id_faculty) {
  $("#message_info").text("Загрузка специальностей. Подождите!");
  state.getters.getSpecialities
    .then(specialities => {
      var filtered_spec = specialities.filter(item => {
        if (item.kod_spec == id_faculty) return true;
      });
      $("#spec").empty();
      filtered_spec.forEach(function(element, index) {
        $("#spec").append(
          $("<option></option>")
            .attr("value", $.trim(element.id))
            .text(element.name)
        );
      });
      var id_spec =
        $("#spec").val() != null
          ? $("#spec")
              .val()
              .split("?")
          : "0";
      var kurs = $('input[name="kurs"]:checked').val();
      load_grup(state, id_spec[0], kurs);
    })
    .catch(() => {
      $("#spinnerDzyuba").addClass("invisible");
    });
}
export function spec_changed(state) {
  var id_spec =
    $("#spec").val() != null
      ? $("#spec")
          .val()
          .split("?")
      : "0";
  var kurs = $('input[name="kurs"]:checked').val();
  load_grup(state, id_spec[0], kurs);
}
export function load_all_schedule(state) {
  $("#message_info").text("Загрузка расписания. Подождите!");
  state.getters.getAllScheduleJson
    .then(resp => {
      $("#message_info").text("Загрузка аудиторий. Подождите!");
      state.getters.getAllKorpuses.then(response => {
        state.getters.getAllAudiences.then(res => {
          $("#message_info").text("Загрузка преподавателей. Подождите!");
          state.getters.getAllTeachers.then(res => {
            $("#spinnerDzyuba").addClass("invisible");
          });
        });
      });
    })
    .catch(err => {
      $("#spinnerDzyuba").addClass("invisible");
    });
}

export async function load_grup(state, id_spec, kurs) {
  $("#message_info").text("Загрузка групп. Подождите!");
  state.getters.getGroups
    .then(groups => {
      var filtered_groups = groups.filter(item => {
        if (item.KURS == kurs && item.SHIFR_SPEC_NEW == id_spec) return true;
      });

      $("#groups").empty();
      var count_added = 0;
      filtered_groups.forEach(function(element, index) {
        var appended_result;
        appended_result =
          "<input type='radio' value='" +
          element.GRUP +
          "' name='grupovuha' class='grupCheckbox form-radio animated bounceIn' />" +
          element.GRUP;
        $("#groups").append(appended_result);
        count_added++;
        if (count_added % 3 == 0) {
          $("#groups").append("<br>");
        }
      });
      load_all_schedule(state);
    })
    .catch(err => {
      console.log(err);
      $("#spinnerDzyuba").addClass("hidden");
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
  $(".kursCheckbox").on("click", function(event) {
    kursChecked(state);
  });
}
export function kursChecked(state) {
  spec_changed(state);
}
export function checkVisibilty() {
  if (
    localStorage.getItem("meine_liben_groups") ||
    localStorage.getItem("meine_liben_groups") == 0
  ) {
    $("#settings_block").addClass("hidden");
  } else {
    $("#settings_block").removeClass("hidden");
    $("#meine_groups").addClass("hidden");
  }
}
export function goToSettings() {
  $("#settings_block").removeClass("hidden");
  $("#meine_groups").addClass("hidden");
  $("#settings_block").removeClass("animated fadeOutLeft");
}
export function returnToGroups() {
  $("#settings_block").addClass("hidden");
  $("#meine_groups").removeClass("hidden");
}
export const chislitelDaySchedule = (store, payload) => {
  let schedule = JSON.parse(localStorage.getItem("all_schedule"));
  let day =
    schedule[payload.groupName] != null
      ? schedule[payload.groupName][payload.week]
      : {};
  if (day != null) {
    const indexDay = store.state.days.indexOf(payload.dayName) + 1;
    if (
      schedule[payload.groupName] != undefined &&
      schedule[payload.groupName] != null
    ) {
      let scheduleOfDay = schedule[payload.groupName][payload.week][indexDay];
      $("#main_table" + " tbody").empty();
      for (let pair in scheduleOfDay) {
        const secondColumn = generateSecondColumn(store, scheduleOfDay[pair]);
        const newRow =
          "<tr><td>" + pair + "</td>" + "<td>" + secondColumn + "</td></tr>";
        $("#main_table" + " tbody").append(newRow);
      }
    }
  }
};

export const generateSecondColumn = (store, _array) => {
  var result = "";
  for (let i = 0; i < _array.length; i++) {
    var bird = findTeacherById(_array[i].prep_id);
    result +=
      _array[i].type +
      " " +
      _array[i].discipline +
      "<br />" +
      bird +
      "<br />" +
      "<span class='prep'>" +
      findAudById(_array[i].classroom_id) +
      "</span><br/>";
  }
  return result;
};
const findTeacherById = id => {
  var all_teacher = JSON.parse(localStorage.getItem("birds"));
  var teacher = all_teacher.filter(teacher => {
    return teacher.id == id;
  });
  return teacher[0] ? teacher[0].fio : "";
};
const findAudById = classroom_id => {
  var result = "";
  var auds = JSON.parse(localStorage.getItem("all_aud"));
  var aud = auds.find(element => {
    return element.id == classroom_id;
  });
  if (aud != null) {
    var korpuses = JSON.parse(localStorage.getItem("korpuses"));
    var korpus = korpuses.find(element => {
      return element.id == aud.id_build;
    });
    result = korpus.abr + "." + aud.name;
  }
  return result;
};
export const weekHandler = state => {
  $(".chislit-tab").on("click", function(event) {
    alert("azaza");
    $(".td_style2_zn").addClass("dnphone");
    $(".znamenat-tab").removeClass("active");
    $(".td_style2_ch").removeClass("dnphone");
    $(".chislit-tab").addClass("active");
    $(".den-content").addClass("chislit-day");
    $(".den-content").removeClass("znamenat-day");
  });
  $(".znamenat-tab").click(function() {
    $(".td_style2_ch").addClass("dnphone");
    $(".chislit-tab").removeClass("active");
    $(".td_style2_zn").removeClass("dnphone");
    $(".znamenat-tab").addClass("active");
    $(".den-content").removeClass("chislit-day");
    $(".den-content").addClass("znamenat-day");
  });
};
