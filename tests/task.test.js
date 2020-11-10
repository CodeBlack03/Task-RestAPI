const request = require("supertest");
const Tasks = require("../src/schema/taskSchema");
const app = require("../src/app");
const {
  userOneId,
  userOne,
  setupDatabase,
  userTwo,
  taskTwo,
} = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should create task for user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "Defeat DarkSeid",
    })
    .expect(201);

  const task = await Tasks.findById(response.body._id);
  //console.log(task);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test("Should get all tasks of authenticated user", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body.length).toBe(2);
});

test("Should not let unauthorized user delete task", async () => {
  await request(app)
    .delete(`/users/${taskTwo._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);
  const task = await Tasks.findById(taskTwo._id);
  expect(task).not.toBeNull();
});
