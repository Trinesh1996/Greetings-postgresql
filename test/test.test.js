'use strict'
let assert = require("assert");
let greeting = require("../public/greeting");
let pg = require("pg");
let Pool = pg.Pool


const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/Greetings';

const pool = new Pool({
    connectionString
});

// * testing ascychronous code is different. Think about error handling.
// * test error blocks

describe("Greeting Tests", async function(){
	beforeEach(async function(){
		await pool.query("DELETE FROM users;");
		await pool.query("ALTER SEQUENCE users_id_seq RESTART 1;");
	})

	it("should return a greet message when a language and name in specified", async function(){
		var GreetUsers = greeting(pool);
		let names = await pool.query("select user_name from users");
		assert.equal("Hello, Trinesh!", await GreetUsers.user_names_lang("English", "Trinesh"));
	})

	

	after(function () {
		pool.end();
    })
})