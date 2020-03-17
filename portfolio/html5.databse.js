// Create database 
var mywebdb = openDatabase('websql_db', '1.0', 'db example', 2 * 1024 * 1024);
   
createTable();  // It will create tables.
showSavedusers(); // It will show saved records.

// Create table
function createTable() 
{ 
  mywebdb.transaction(function(tx) 
{
  tx.executeSql("CREATE TABLE IF NOT EXISTS users (user_id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, phoneNo TEXT, password TEXT)", []);
      });
}

// Insert users.
function saveusers()
{
var username_val = $.trim($("#username").val());
var email_val = $.trim($("#email").val());
var phoneNo_val = $.trim($("#phoneNo").val());
var password_val = $.trim($("#password").val());
       
  if(username_val == '')
{
alert("Please enter your username."); 
$("#username").focus(); return false; 
}

if(email_val == '')
{
alert("Please enter your email."); 
$("#email").focus(); return false; 
}
      
if(phoneNo_val == '')
{
alert("Please enter your phone number."); 
$("#phoneNo").focus(); return false; 
}

if(password_val == '')
{
alert("Please enter your password."); 
$("#password").focus(); return false; 
}
    
if(username_val !=''&&  email_val !=''&& phoneNo_val !=''&& password_val !='')
{
mywebdb.transaction(function (tx) 
{
  tx.executeSql("INSERT INTO users (username, email, phoneNo, password) VALUES ( ?, ?, ?, ?);", 
    [username_val, email_val, phoneNo_val, password_val,],showSavedusers(), onError);
   });
}

}

// Select user details.
function showSavedusers()
{
//document.forms['add_form'].reset();
var show_data_append = '';
     
mywebdb.transaction(function (tx) 
{
  tx.executeSql('SELECT user_id, username, email, phoneNo, password FROM user_details', [], function (tx, results) 
{
var total_rec = results.rows.length;
//alert("Total record  =  " +total_rec);
  var header_ui = '<thead><tr style="border: 1px solid black;">'     
                  +'<th style="padding:8px;border: 1px solid black;width:30%;" >username</th>'
                  +'<th style="padding:8px;border: 1px solid black;width:30%;" >email</th>'
                  +'<th style="padding:8px;border: 1px solid black;width:30%;" >phoneNo</th>'
                  +'<th style="padding:8px;border: 1px solid black;width:30%;"  >password</th>'
                 +'<th style="padding:8px;border: 1px solid black;width:40%;" >Action&nbsp;&nbsp;<button type="button" class="btn btn-danger" onclick="dropTables();" style="cursor:pointer;"><span class="glyphicon glyphicon-remove"></span>&nbsp;&nbsp;Drop Table</button></th>'
                 +'</tr></thead>';

   if(total_rec >= 1)             
    {
   for (i = 0; i < total_rec; i++)
    {
    var record_data =  results.rows.item(i);
    show_data_append += '<tr style="border: 1px solid black;" >' 
                        + '<td style="padding:8px;border: 1px solid black;" >' + record_data.username + '</td>' 
                          + '<td style="padding:8px;border: 1px solid black;" >' + record_data.email + '</td>'
                          + '<td style="padding:8px;border: 1px solid black;" >' + record_data.phoneNo + '</td>' 
                          + '<td style="padding:8px;border: 1px solid black;" >' + record_data.password + '</td>' 
                          + '<td style="padding:8px;border: 1px solid black;" >'

                          + '<button type="button" class="btn btn-danger" onclick="deleteUserRecord('+ record_data.user_id + ');"  id="save_record_div" style="cursor:pointer;"><span class="glyphicon glyphicon-remove"></span>&nbsp;&nbsp;Delete</button>'
                          + '&nbsp;&nbsp;<button type="button" class="btn btn-info" onclick="editUserRecord('+ record_data.user_id + ');"  id="save_record_div" style="cursor:pointer;"><span class="glyphicon glyphicon-pencil"></span>&nbsp;&nbsp;Edit</button>'
                          + '</tr>';
                     }
                 }
                 else
                 {
                      show_data_append += '<tr style="border: 1px solid black;" ><td style="padding:8px;border: 1px solid black; text-align:center;" colspan="4"> No record found !</td></tr>';
                 }

                 var footer_ui = '</table>';
                 var complete_ui = header_ui+show_data_append+footer_ui;
                 $("#save_record_div").show();
                 $("#update_record_div").hide();
                 $("#show_edit_part").html(complete_ui);
           }, null);

    });

  }

  // Edit user details.
  function editUserRecord(user_id)
  {
      mywebdb.transaction(function (tx) 
      {
            tx.executeSql('SELECT user_id, username, email, phoneNo, password FROM users WHERE user_id = "'+ user_id+ '"', [], function (tx, results) 
            {
                  var record_data =  results.rows.item(0);
                  $("#save_record_div").hide();
                  $("#update_record_div").show();
                  $("#edit_user_id").val(record_data.user_id);
                  $("#pn").val(record_data.username);
                  $("#pt").val(record_data.email);
                  $("#up").val(record_data.phoneNo);
                  $("#pq").val(record_data.password);
                           
            }, null);
      });
  }

  // Update user details.
  function updateusers() 
  {

      var username_val = $.trim($("#username").val());
      var email_val = $.trim($("#email").val());
      var phone_number_val = $.trim($("#phoneNo").val());
      var password_val = $.trim($("#password").val());
      var update_user_id = $.trim($("#edit_user_id").val());

      if(username_val == '')
      {
        alert("Please enter your username."); 
        $("#username").focus(); return false; 
      }
      if(email_val == '')
      {
        alert("Please enter your email."); 
        $("#email").focus(); return false; 
      }
      if(phoneNo_val == '')
      {
        alert("Please enter your phone number."); 
        $("#phoneNo").focus(); return false; 
      }
      if(password_val == '')
      {
        alert("Please enter the password."); 
        $("#password").focus(); return false; 
      }

      if(username_val !='' && email_val !='' && phoneNo_val !='' && password_val!='' )
      {
          mywebdb.transaction(function(tx) 
          {
              tx.executeSql("UPDATE users SET username = ?, email = ?, phoneNo = ?, password = ? WHERE user_id = ?", 
              [username_val, email_val, phoneNo_val, password_val, update_user_id],showSavedUserDetails(), onError);
          }); 
      }
  }

  // Delete user details.
  function deleteUserRecord(delete_user_id) 
  { 
      var do_it = confirm("Do you really want to delete this record ? ");
      if (do_it) 
      {
          mywebdb.transaction(function(tx) 
          {
               tx.executeSql('DELETE FROM users WHERE user_id = "'+delete_user_id+'" ');
          });

          showSavedUserDetails();
      }
  }

  // It will show query error if something is wrong with query.
  function onError(tx, error) 
  {
    alert(error.message);
    //$('#SyncProgress').html(error.message).css("color","red");
  }

  // drop tables.
  function dropTables() 
  {
     mywebdb.transaction(function(tx) 
     {
        tx.executeSql("DROP TABLE users", []); 
     });

  }
 