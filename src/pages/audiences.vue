<template>
  <q-page>
    <br>
    <div class="text-center">
      
      <span>Корпус</span><br>
      <select class="select-style" v-on:change="korpusChanged" id="korpus" name="housing">
      </select><br/><br/>
     
      <span>Аудитория</span><br>
      <select class="select-style" v-on:change="audChanged" id="aud" name="audience"></select>
      <br /><br/>
     
      <q-btn color="red-14" id="audButton" @click="findScheduleByAud" label="Показать" />
      <br> <br>
      <div id="schedule"></div>
    </div>

      <q-inner-loading id="spinnerKorpus" :visible="true">
         <div class="fixed fixed-center text-center">
            <q-spinner-gears class="relative-position" size="50px" color="red"></q-spinner-gears>
            <p style="color:black;font-weight: bold;">Подождите,идет загрузка данных</p>
         </div>
      </q-inner-loading>
  </q-page>
</template>

<script>
 import {mapActions,mapMutations} from 'vuex'
export default
{
  mounted()
  {
     this.levikorpus();
     this.preloadAddedFunction();
  },
  methods:
  {
    ...mapActions({
      levikorpus : 'audience/levikorpus',
      korpusChanged : 'audience/korpusChanged',
      audChanged : 'audience/audChanged'
    }),
    ...mapMutations({
      findScheduleByAud : 'audience/findScheduleByAud',
      preloadAddedFunction : 'audience/preloadAddedFunction'
    })
  }
}
</script>