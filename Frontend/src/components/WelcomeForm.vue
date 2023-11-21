<template>
  <div class="welcome-container">
    <div class="welcome-header">
      <h2>Welcome, {{ name }} ({{ role }})!</h2>
      <button @click="logout" class="btn btn-danger">Logout</button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>Name</th>
          <th>Organization</th>
          <th>Skill</th>
          <th>Evaluation</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in data" :key="row.id">
          <td>{{ row.name }}</td>
          <td>{{ row.organization }}</td>
          <td>{{ row.skill }}</td>
          <td>
            <input
              v-model="row.evaluation"
              type="number"
              min="0"
              max="5"
              @change="updateEvaluation(row._id, row.evaluation)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.welcome-container {
  text-align: right;
  margin-right: 20px; /* Adjust margin as needed */
}

.welcome-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table {
  width: 100%;
  margin-top: 20px;
}

.table th,
.table td {
  text-align: center;
}
</style>

<script>
import axios from "axios";

export default {
  props: ["name", "internalId", "managerId", "role", "password", "user"],
  data() {
    return {
      data: [],
    };
  },
  created() {
    // Load evaluations when the component is created
    this.loadEvaluations();
  },
  methods: {
    async loadEvaluations() {
      console.log("Call LoadEvaluations");
      try {
        // Base64 encode the credentials
        const credentials = btoa(`${this.user}:${this.password}`);

        let target = `${process.env.VUE_APP_SM_SERVICE_URL}/evaluation`;
        console.log(target);

        // Call the getEvaluations API with the Authorization header
        const response = await axios.get(target, {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        });
        response.headers = {};

        // Assuming the API returns an array of evaluations, update the data property
        this.data = response.data;
      } catch (error) {
        console.error("Error loading evaluations:", error);
        // Handle the error as needed
      }
    },
    async logout() {
      try {
        // Call the logout API here
        await axios.post(process.env.VUE_APP_AUTH_SERVICE_URL + "/logout");
        // Assuming successful logout, emit an event or perform other actions as needed
      } catch (error) {
        console.error("Error during logout:", error);
        // Handle logout error as needed
      }
    },
    async updateEvaluation(id, value) {
      try {
        // Call the update API here

        await axios.put(
          process.env.VUE_APP_SM_SERVICE_URL + "/evaluation",
          {
            id,
            value,
          },
          {
            auth: {
              username: this.user,
              password: this.password,
            },
          },
        );
      } catch (error) {
        console.error("Error during evaluation update:", error);
        // Handle update error as needed
      }
    },
  },
};
</script>
