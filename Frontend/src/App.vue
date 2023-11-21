<template>
  <div id="app">
    <LoginForm @login-success="showWelcomeForm" v-if="!loggedIn" />
    <WelcomeForm
      v-if="loggedIn"
      :name="loggedInUser.name"
      :internalId="loggedInUser.internalId"
      :managerId="loggedInUser.managerId"
      :role="loggedInUser.role"
      :password="loggedInUser.password"
      :user="loggedInUser.user"
    />
  </div>
</template>

<script>
import LoginForm from "./components/LoginForm.vue";
import WelcomeForm from "./components/WelcomeForm.vue";

export default {
  data() {
    return {
      loggedIn: false,
      loggedInUser: {
        name: "",
        internalId: "",
        managerId: "",
        role: "",
        password: "",
        user: "",
      },
    };
  },
  methods: {
    showWelcomeForm(userData) {
      this.loggedIn = true;
      this.loggedInUser = {
        name: userData.name,
        internalId: userData.internalId,
        managerId: userData.managerId,
        role: userData.role,
        password: userData.password,
        user: userData.user,
      };
    },
  },
  components: {
    LoginForm,
    WelcomeForm,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
