import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {
    chave({commit}){
      return new Promise((resolve,reject)=>{
        commit('gerando par de chaves')
        axios({url:'http://localhost:1366/chave', method:'POST'})
            .then(resp =>{
              resolve(resp);
            })

      })
    },

  }
})
