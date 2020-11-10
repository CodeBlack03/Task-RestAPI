// require("dotenv").config({ path: "../config/test/test.env" });
const request = require("supertest");
const app = require("../src/app");
const Users = require("../src/schema/usersSchema");
const { userOneId, userOne, setupDatabase } = require("./fixtures/db");
beforeEach(setupDatabase);

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Bruce Wayne",
      email: "bwaynebatman@gmail.com",
      password: "admin12345",
    })
    .expect(201);

  const user = await Users.findById(response.body.user._id);
  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    user: {
      name: "Bruce Wayne",
      email: "bwaynebatman@gmail.com",
    },
    token: user.tokens[0].token,
  });

  expect(user.password).not.toBe("admin12345");
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
  const user = await Users.findById(userOneId);

  expect(response.body).toMatchObject({
    token: user.tokens[1].token,
  });
});

test("Should not login nonexistent user", async () => {
  await request(app)
    .post("users/login")
    .send({
      name: userOne.email,
      password: "testpass",
    })
    .send(201);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete account for authenticated user", async () => {
  const respose = await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  const user = await Users.findById(userOneId);
  expect(user).toBeNull();
});

test("Should not delete account for unauthorized user", async () => {
  await request(app)
    .delete("/users/me")

    .send()
    .expect(401);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/batman.jpg")
    .expect(200);
  const user = await Users.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Bruce Wayne",
      email: "brucew@gmail.com",
    })
    .expect(200);

  const user = await Users.findById(userOneId);

  expect(user).toMatchObject({
    name: "Bruce Wayne",
    email: "brucew@gmail.com",
  });
});

test("Should not update invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "Gotham",
    })
    .expect(400);
});
