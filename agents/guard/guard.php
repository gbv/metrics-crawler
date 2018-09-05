<?php

$file = file_get_contents(__DIR__.'/../config.json');
$config = json_decode($file, true);

$db_config = $config['db'];

$con = new mysqli($db_config['host'], $db_config['user'], $db_config['password'], $db_config['database']);
if ($con->connect_errno) {
	exit("DB-Error.");
}

$con->set_charset($db_config['charset']);

$receiver = $config['guard_mail_receiver'];

function run($con){
	
	try{
		
		$last_updates = [];

		$result = $con->query("SELECT max(last_update_twitter) as twitter, max(last_update_reddit) as reddit, max(last_update_facebook) as facebook, max(last_update_mendeley) as mendeley, max(last_update_youtube) as youtube from works");
		
		if($result && $row = $result->fetch_array()){
			
			array_push($last_updates, new DateTime($row['facebook']));
			array_push($last_updates, new DateTime($row['mendeley']));
			array_push($last_updates, new DateTime($row['reddit']));
			array_push($last_updates, new DateTime($row['twitter']));
			array_push($last_updates, new DateTime($row['youtube']));
			
		}else{
			handleFailed("SQL Error");
			return;
		}
		
		mysqli_free_result($result);
		
		$result_wiki = $con->query("SELECT max(_en) as en FROM wikipedia;"); 

		if($result_wiki && $row = $result_wiki->fetch_array()){
			
			mysqli_free_result($result_wiki);
		
			array_push($last_updates, new DateTime($row['en']));
			
			checkFailed($last_updates);
			
		}else{
		
			handleFailed("wiki SQL error");
			
		}

	}catch(Exception $e){
		handleFailed("error");	
	}
		
}

function checkFailed($LUs){

	global $receiver;	
	$limit = new DateTime();
	$limit->sub(new DateInterval("PT10M"));
	
	try{
		
		foreach($LUs as $val){
			
			if($val < $limit){
		
				handleFailed("no updates");
				return;
				
			}
					
		}
		
		
		global $con;
		
		$result = $con->query("SELECT * FROM checks_dumps");
		
		$cd_string = "";
		
		if($result){
			
			while($row = $result->fetch_array()){
				
				$cd_string = $cd_string."\n".$row['max(created)'];
				
			}
			
		}

		mail($receiver, "*metrics bot is running", "Bot is running.\n\nLatest dumps:\n".$cd_string);
			
	}catch(Exception $e){
		
		handleFailed("error");
		
	}
	
}


function handleFailed($msg){
	
	global $receiver;
	
	mail($receiver, "*metrics bot failed", "Error message: ".$msg);
	
}

run($con);



?>