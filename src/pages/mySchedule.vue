<template>
  <q-page expand position="top">
    <br>
    <div class="text-center" id="settings_block">
      <span class="label text-italic text-red">Выберите свою группу</span>
      <br>
      <br>
      <span>Факультет</span>
      <br>
      <select
        v-on:change="load_speacilaty($event.target.value)"
        class="select-style animated fadeIn"
        id="facul"
        name="Faculty"
      ></select>
      <br>
      <br>
      <span>Специальность</span>
      <br>
      <select
        v-on:change="spec_changed"
        class="select-style animated fadeIn"
        id="spec"
        name="specaility"
      ></select>
      <br>
      <br>
      <span>Курс :</span>
      <div id="kurs" class="animated zoomInLeft"></div>
      <br>
      <span>Группы</span>
      <br>
      <div id="groups"></div>
      <ul class="list_buttons">
        <li>
          <q-btn
            class="button"
            @click="acceptar"
            id="search_teacher"
            color="red-13"
            label="Принять"
          />
        </li>
        <li>
          <q-btn class="button" @click="returnToGroups" color="dark" label="Назад"/>
        </li>
      </ul>
    </div>
    <div class="text-center" id="meine_groups" v-if="this.isGroupsSelected">
      <div id="meine_liben_groups">Ваша группа :</div>
      <br>
      <q-btn
        @click="updateCurrentchedule"
        class="button"
        size="md"
        label="Обновить"
        color="red-14"
        icon="refresh"
      />
      <br>
      <br>
      <div class="text-center">
        <q-tabs
          v-model="typeOfWeek"
          @select="mainTabChanged"
          text-color="black"
          color="brown-1"
          swipeable="true"
        >
          <q-tab label="Числитель" slot="title" name="chislitel_tab"></q-tab>
          <q-tab label="Знаменатель" slot="title" name="znamentael_tab"></q-tab>
          <q-tab-pane keep-alive name="chislitel_tab">
            <q-tabs
              v-if="getAvailableDaysChislitel!=null || getAvailableDaysChislitel!=undefined"
              @select="loadScheduleOfDay"
              v-model="currentDay"
              swipeable
              color="white"
              text-color="black"
            >
              <q-tab
                v-for="day in getAvailableDaysChislitel"
                slot="title"
                :key="day"
                :label="day"
                :name="day"
              ></q-tab>
            </q-tabs>
            <div
              style="color:rgba(213, 0, 0);"
              v-if="getAvailableDaysChislitel.length==0"
            >Расписание отсутствует</div>
          </q-tab-pane>
          <q-tab-pane name="znamentael_tab">
            <q-tabs
              v-show="getAvDaysZnamenatel!=null || getAvDaysZnamenatel!=undefined"
              @select="loadScheduleOfDay"
              v-model="currentDayZnamentel"
              swipeable
              color="white"
              text-color="black"
            >
              <q-tab
                v-for="day in getAvDaysZnamenatel"
                slot="title"
                :key="day"
                :label="day"
                :name="day"
              ></q-tab>
            </q-tabs>
            <div
              style="color:rgba(213, 0, 0);"
              v-if="getAvDaysZnamenatel.length==0"
            >Расписание отсутствует</div>
          </q-tab-pane>
        </q-tabs>
        <table class="q-table q-table-horizontal-separator" id="main_table">
          <thead>
            <tr>
              <th class="text-center">№ Пары</th>
              <th class="text-center">Занятия</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
    <q-inner-loading id="spinnerDzyuba" :visible="true">
      <div class="fixed fixed-center text-center">
        <q-spinner-gears class="relative-position" size="50px" color="red"></q-spinner-gears>
        <p
          id="message_info"
          class="text-black"
          style="font-weight: bold;"
        >Подождите,идет загрузка данных</p>
      </div>
    </q-inner-loading>
  </q-page>
</template>

<script>
import axios from "axios";
import { mapActions, mapMutations } from "vuex";
import { Notify } from "quasar";
export default {
  data() {
    return {
      currentDay: "",
      currentDayZnamentel: "",
      typeOfWeek: "chislitel_tab"
    };
  },
  async mounted() {
    await this.checkVisibilty();
    await this.load_faculties();
    await this.preloaded_kurses();
    await this.preloadMeineKurses();
    await this.loadAvailableDays();
    await this.preloadDefaultDay();
    await this.preloadDayZnamenatel();
  },
  created() {},
  methods: {
    updateCurrentchedule() {
      try {
        this.load_faculties();
        this.preloadDefaultDay();
        this.preloadDayZnamenatel();
        Notify.create({
          type: "positive",
          message: "Расписание обновлено!"
        });
      } catch (ex) {
        Notify.create({
          type: "negative",
          message: "Возникла ошибка!"
        });
      }
    },
    acceptar() {
      this.$store.commit("mySchedule/acceptar");
      // setTimeout(() => {
      this.preloadDefaultDay();
      this.preloadDayZnamenatel();
      // }, 1000);
      this.loadScheduleOfDay(this.getAvailableDaysChislitel[0]);
    },
    preloadDefaultDay() {
      const currDay =
        this.getAvailableDaysChislitel[0] != null
          ? this.getAvailableDaysChislitel[0]
          : "ПН";
      this.currentDay = currDay;
    },
    preloadDayZnamenatel() {
      const currDay =
        this.getAvDaysZnamenatel[0] != null
          ? this.getAvDaysZnamenatel[0]
          : "ПН";
      this.currentDayZnamentel = currDay;
    },
    mainTabChanged(week) {
      this.typeOfWeek = week;
      if (this.typeOfWeek == "chislitel_tab") {
        this.loadScheduleOfDay(this.currentDay);
      } else if (this.typeOfWeek == "znamentael_tab") {
        this.loadScheduleOfDay(this.currentDayZnamentel);
      }
    },
    ...mapActions({
      load_all_schedule: "mySchedule/load_all_schedule",
      load_faculties: "mySchedule/load_faculties",
      load_speacilaty: "mySchedule/load_speacilaty",
      preloaded_kurses: "mySchedule/preloaded_kurses",
      spec_changed: "mySchedule/spec_changed",
      checkVisibilty: "mySchedule/checkVisibilty",
      goToSettings: "mySchedule/goToSettings",
      returnToGroups: "mySchedule/returnToGroups",
      weekHandler: "mySchedule/weekHandler"
    }),
    ...mapMutations({
      preloadMeineKurses: "mySchedule/preloadMeineKurses"
    }),
    loadAvailableDays() {
      if (this.isGroupsSelected()) {
        const groups = JSON.parse(localStorage.getItem("meine_liben_groups"));
        const groupName = groups != null ? groups[0] : "";
        this.$store.commit("mySchedule/updateAvailableDays", {
          groupName: groupName,
          week: 1
        });
        this.$store.commit("mySchedule/updateAvailableDays", {
          groupName: groupName,
          week: 2
        });
        this.currentDay = this.getAvailableDaysChislitel[0];
        this.currentDayZnamentel = this.getAvDaysZnamenatel[0];
      }
    },
    loadScheduleOfDay(day) {
      const myGroup = JSON.parse(localStorage.getItem("meine_liben_groups"));
      const groupName = myGroup != null ? myGroup[0] : "";
      const week = this.typeOfWeek == "chislitel_tab" ? 1 : 2;
      if (groupName != "") {
        this.$store.dispatch("mySchedule/chislitelDaySchedule", {
          groupName: groupName,
          dayName: day,
          week
        });
      }
    },
    isGroupsSelected() {
      const myGroups = JSON.parse(localStorage.getItem("meine_liben_groups"));
      return myGroups != null || myGroups != undefined ? true : false;
    }
  },
  computed: {
    getAvailableDaysChislitel() {
      return this.$store.getters["mySchedule/getAvailableDaysChislitel"];
    },
    getAvDaysZnamenatel() {
      return this.$store.getters["mySchedule/getAvDaysZnamenatel"];
    }
  }
};
</script>

<style scopedSlots>
.list_buttons {
  list-style: none;
  margin-right: 2rem;
}

.list_buttons li {
  display: inline-block;
  padding-left: 0.75em;
  padding-bottom: 1rem;
}
</style>