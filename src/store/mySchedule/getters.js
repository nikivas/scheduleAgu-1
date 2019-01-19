import axios from "axios";
const _instanse = axios.create({ timeout: 7000 });

export function getFaculties(state) {
  return new Promise((resolve, reject) => {
    if (
      !localStorage.getItem("faculties") ||
      localStorage.getItem("faculties") == ""
    ) {
      _instanse
        .get("http://raspisanie.asu.edu.ru/student/faculty")
        .then(json => {
          localStorage.setItem("faculties", JSON.stringify(json.data));
          resolve(json.data);
        })
        .catch(error => {
          reject(new Error(error.message));
        });
    } else {
      resolve(JSON.parse(localStorage.getItem("faculties")));
    }
  });
}

export function getSpecialities(state) {
  return new Promise(function(resolve, reject) {
    if (
      !localStorage.getItem("all_specialities") ||
      localStorage.getItem("all_specialities") == ""
    ) {
      _instanse
        .get("http://m.raspisanie.asu.edu.ru/student/specialty")
        .then(json => {
          localStorage.setItem("all_specialities", JSON.stringify(json.data));
          resolve(json.data);
        })
        .catch(error => {
          reject(new Error(error.message));
        });
    } else {
      resolve(JSON.parse(localStorage.getItem("all_specialities")));
    }
  });
}

export function getAllScheduleJson(state) {
  return new Promise((resolve, reject) => {
    if (navigator.onLine) {
      _instanse
        .get("http://raspisanie.asu.edu.ru/student/studentjson/cashed")
        .then(json => {
          if (
            JSON.stringify(json.data) != localStorage.getItem("all_schedule")
          ) {
            localStorage.setItem("all_schedule", JSON.stringify(json.data));
            resolve(JSON.stringify(json.data));
          }
          resolve(json.data);
        })
        .catch(error => {
          reject(new Error(error.message));
        });
    } else {
      resolve(JSON.parse(localStorage.getItem("all_schedule")));
    }
  });
}

export function getGroups(state) {
  return new Promise((resolve, reject) => {
    if (
      !localStorage.getItem("all_groupies") ||
      localStorage.getItem("all_groupies") == ""
    ) {
      _instanse
        .get("http://raspisanie.asu.edu.ru/student/grup")
        .then(json => {
          localStorage.setItem("all_groupies", JSON.stringify(json.data));
          resolve(json.data);
        })
        .catch(error => {
          reject(new Error(error.message));
        });
    } else {
      resolve(JSON.parse(localStorage.getItem("all_groupies")));
    }
  });
}

export const getAvailableDaysChislitel = state => {
  return state.availableDaysChislitel;
};

export const getAvDaysZnamenatel = state => {
  return state.avaibleDaysZnamenatel;
};

export const getAllKorpuses = state => {
  return new Promise((resolve, reject) => {
    if (!localStorage.getItem("korpuses")) {
      _instanse
        .get("http://raspisanie.asu.edu.ru/audience/korpus")
        .then(json => {
          localStorage.setItem("korpuses", JSON.stringify(json.data));
          resolve(json.data);
        })
        .catch(error => {
          reject(new Error(error.message));
        });
    } else {
      resolve(JSON.parse(localStorage.getItem("korpuses")));
    }
  });
};

export const getAllAudiences = state => {
  return new Promise((resolve, reject) => {
    if (!localStorage.getItem("all_aud")) {
      _instanse
        .get("http://raspisanie.asu.edu.ru/audience/audience")
        .then(json => {
          localStorage.setItem("all_aud", JSON.stringify(json.data));
          resolve(json.data);
        })
        .catch(error => {
          reject(new Error(error.message));
        });
    } else {
      resolve(JSON.parse(localStorage.getItem("all_aud")));
    }
  });
};

export const getAllTeachers = state => {
  return new Promise((resolve, reject) => {
    if (!localStorage.getItem("birds")) {
      _instanse
        .get("http://raspisanie.asu.edu.ru/teacher/all")
        .then(json => {
          localStorage.setItem("birds", JSON.stringify(json.data));
          resolve(json.data);
        })
        .catch(error => {
          reject(new Error(error.message));
        });
    } else {
      resolve(JSON.parse(localStorage.getItem("birds")));
    }
  });
};
