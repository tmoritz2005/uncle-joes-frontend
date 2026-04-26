import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    member: null as null | {
      member_id: string
      name: string
      email: string
      home_store: number
    }
  }),
  getters: {
    isLoggedIn: (state) => state.member !== null
  },
  actions: {
    setMember(member: any) {
      this.member = member
    },
    logout() {
      this.member = null
    }
  }
})
