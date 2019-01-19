<template>
	<q-page expand position="top">
		<p style="padding:20px;line-height:1.4;">
			Для загрузки актуального расписания нажмите "Обновить"!
		</p>
		<div class="text-center"> 
		<q-btn color="red-14" id="update_button" v-on:click="load_change" label="Обновить" /> </div>
		<q-inner-loading id="fidgetSpinner"  class="hidden" :visible="true">
			<div class="fixed fixed-center text-center">
			<q-spinner-gears class="relative-position" size="50px" color="red-14"></q-spinner-gears>
			<p style="color:black;font-weight: bold;">Подождите,идет загрузка данных</p>
			</div>
		</q-inner-loading>
	</q-page>
</template>

<script>
	import {mapActions} from 'vuex'
    export default{
      mounted()
      {
        
      },
      methods:
      {
      	...mapActions({
      		load_change : 'helper/load_change'
      	})
      }
    }
</script>