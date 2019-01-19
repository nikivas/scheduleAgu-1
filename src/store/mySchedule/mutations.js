import { Notify } from "quasar";
import axios from "axios";
const _instanse = axios.create({ timeout: 7000 });
export function acceptar(state) {
  var checked_grupovuha = $("input[name='grupovuha']:checked");
  if (checked_grupovuha.length <= 0) {
    Notify.create({
      type: "negative",
      message: "Выберите группу",
      position: "bottom"
    });
  } else {
    localStorage.removeItem("meine_liben_groups");
    var meine_liben_groups = [];
    checked_grupovuha.each((index, element) => {
      meine_liben_groups.push(element.value);
    });
    localStorage.setItem(
      "meine_liben_groups",
      JSON.stringify(meine_liben_groups)
    );
    updateAvailableDays(state, { groupName: meine_liben_groups[0], week: 1 });
    updateAvailableDays(state, { groupName: meine_liben_groups[0], week: 2 });
    //$("#settings_block").addClass("animated fadeOutLeft");
    // setTimeout(() => {
    $("#settings_block").addClass("hidden");
    $("#meine_groups").removeClass("hidden");
    // }, 1000);
    preloadMeineKurses(state);
  }
  return true;
}

export function preloadMeineKurses(state) {
  if (localStorage.getItem("meine_liben_groups")) {
    var meine_liben_groups = JSON.parse(
      localStorage.getItem("meine_liben_groups")
    );
    $("#meine_liben_groups").empty();
    meine_liben_groups.forEach(function(element, index) {
      var appended_result;
      var count_added = 0;
      appended_result =
        "Ваша группа : <input type='radio' class='hidden' checked='true' value='" +
        element +
        "' name='liebenGroups' class='liebenGroupsCheckbox form-radio animated bounceIn' />" +
        element;
      $("#meine_liben_groups").append(appended_result);
      count_added++;
      if (count_added % 3 == 0) {
        $("#meine_liben_groups").append("<br>");
      }
    });
  }
}

export const updateAvailableDays = (state, payload) => {
  var all_schedule = JSON.parse(localStorage.getItem("all_schedule"));
  console.log(all_schedule);
  const days =
    all_schedule[payload.groupName] != null ||
    all_schedule[payload.groupName] != undefined
      ? all_schedule[payload.groupName][payload.week]
      : {};
  let result = [];
  for (let key in days) {
    if (!isNaN(key)) {
      result.push(state.days[key - 1]);
    }
  }
  if (payload.week == 1) {
    state.availableDaysChislitel = result;
  } else if (payload.week == 2) {
    state.avaibleDaysZnamenatel = result;
  }
};
