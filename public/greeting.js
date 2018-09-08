module.exports = function(pool){

  // use of regular expressions for 
  // re a sequence of characters that define a search pattern
  // used by string searching algorithms
  async function user_names_lang(language, name) {
    
    let char = /^[A-Za-z]+$/;

    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    
    if (language !== undefined && name !== "" && name.match(char)) {
      
      let user_names = await pool.query('SELECT * from users where user_name = $1', [name]);

      if(user_names.rows.length === 0){
        await pool.query('INSERT into users(user_name, count_no) values($1, $2)', [name, 1]);
      }
      else {
        await pool.query("UPDATE users set count_no = count_no+1 WHERE user_name = $1", [name])
      }

      if (language == "English") {
        return "Hello, "+ name + "!";
      }
      else if (language == "Afrikaans") {
        return "Goeie More, "+ name + "!";
      }
      else if (language == "isiXhosa") {
        return "Molo, "+ name + "!";
      }
    }
  }


  async function getCounts(user){
    let greets = await pool.query('select count_no from users where user_name = $1', [user]);
      return greets.rows[0].count_no;      
  }
  async function checkNames(){
    let results = await pool.query('SELECT user_name FROM users');
      return results.rows;
  }
  async function counts(){
   let results = await pool.query('SELECT * FROM users');
      return results.rows.length;
  }
  async function reset(){
    let results =  await pool.query('DELETE FROM users;');
    let resetID = await pool.query('ALTER SEQUENCE users_id_seq RESTART 1;')
    
  return {
      result: results.rows,
      resetId: resetID.rows
   }
 }
   return {
    user_names_lang,counts,getCounts,checkNames,reset
  }
}
