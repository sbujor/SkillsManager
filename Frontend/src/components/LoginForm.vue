<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h2 class="mb-4 mt-2">Skills Manager</h2>
        <form @submit.prevent="login">
          <div class="mb-3 row">
            <label for="username" class="col-sm-3 col-form-label">Username</label>
            <div class="col-sm-9">
              <input v-model="username" type="text" class="form-control" id="username" required />
            </div>
          </div>
          <div class="mb-3 row">
            <label for="password" class="col-sm-3 col-form-label">Password</label>
            <div class="col-sm-9">
              <input v-model="password" type="password" class="form-control" id="password" required />
            </div>
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
        </form>
        <div v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  height: 100vh;
  display: flex;
  align-items: center;
}

.row {
  width: 100%;
}

.col-md-6 {
  max-width: 30%;
}
</style>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async login() {
      try {
        let target = `${process.env.VUE_APP_SM_SERVICE_URL}/auth`;
        console.log(target);
        const response = await axios.post(
          target,
          null, // No need for a request body
          {
            auth: {
              username: this.username,
              password: this.password,
            },
          },
        );

        const { name, internalId, managerId, role } = response.data;
        let password = this.password;
        let user = this.username;
        console.log(`Login succes ${name} ${internalId} ${managerId} ${role} ${password}`);
        this.$emit("login-success", { name, internalId, managerId, role, password, user });
      } catch (error) {
        console.error("Error during login:", error);
        this.errorMessage = "An error occurred during login.";
      }
    },
  },
};
</script>
