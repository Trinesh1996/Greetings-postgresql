'use strict'
let assert = require("assert");
let greeting = require("../public/greeting");
let pg = require("pg");
let Pool = pg.Pool


const connectionString = process.env.DATABASE_URL || 'postgresql://trinesh:Trinesh1997@@localhost:5432/Greetings';

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

	it("should return a greet message in English when the language and a name in specified", async function(){
		var GreetUsers = greeting(pool);
		assert.equal("Hello, Trinesh!", await GreetUsers.user_names_lang("English", "Trinesh"));
	});


	it("should return a greet message in isiXhosa when the language and a name in specified", async function(){
		var GreetUsers = greeting(pool);
		assert.equal("Molo, Jack!", await GreetUsers.user_names_lang("isiXhosa", "Jack"));
	});

	it("should return a greet message in Afrikaans when the language and a name in specified", async function(){
		var GreetUsers = greeting(pool);
		assert.equal("Goeie More, Anele!", await GreetUsers.user_names_lang("Afrikaans", "Anele"));
	});

	it("check how many times a user has been greeted", async function(){
		var GreetUsers = greeting(pool);

		await GreetUsers.user_names_lang("Afrikaans", "Anele");
		await GreetUsers.user_names_lang("English", "Trinesh");
		await GreetUsers.user_names_lang("isiXhosa", "Anele");
		// DONT FORGET ABOUT THE AWAIT !!!!!!! * NOTE TO SELF #LOVE
		assert.equal(await GreetUsers.counts(), 2)

		await pool.query("DELETE FROM users;");
		await GreetUsers.user_names_lang("Afrikaans", "Anele");
		await GreetUsers.user_names_lang("English", "Trinesh");
		await GreetUsers.user_names_lang("isiXhosa", "Bertrand");
		assert.equal(await GreetUsers.counts(), 3)


	})
	it("should return the right names", async function(){
		var GreetUsers = greeting(pool);
		await GreetUsers.user_names_lang("Afrikaans", "Anele");
		
		assert.deepEqual([{user_name: 'Anele'}], await GreetUsers.checkNames());

		await pool.query("DELETE FROM users;");
		await GreetUsers.user_names_lang("English", "Trinesh");
		await GreetUsers.user_names_lang("isiXhosa", "Ash");

		assert.deepEqual([{user_name: 'Trinesh'},{user_name: 'Ash'}], await GreetUsers.checkNames());
	});
	it("should reset the user base and user_id_sequence", async function(){
		var GreetUsers = greeting(pool);
		await GreetUsers.user_names_lang("Afrikaans", "Anele");
		await GreetUsers.user_names_lang("English", "Trinesh");
		await GreetUsers.user_names_lang("isiXhosa", "Ash");
		
		assert.deepEqual({result: [], resetId: []}, await GreetUsers.reset());

	});
	after(function () {
		pool.end();
    })
})