<?php
// chnage this for don't strave save location on your computer (* don't end with /)
$save_file_location = '/Users/mac/Library/Application Support/Steam/userdata/45613448/219740/remote';


include 'dontstarve.class.php';


/**
 * ============================================================
 * Application
 * ============================================================
 */

if (!isset($_REQUEST['action'])) {
  header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
  exit();
}


$saves_store_path = 'saves';


$action = $_REQUEST['action'];


$DontStrave = new DontStarve($save_file_location);


header('Content-Type: application/json');

// file list 
if ($action === 'file_list') {

  echo $DontStrave->fileList();

}

// backup
else if ($action === 'backup') {

  sleep(1);
  echo $DontStrave->backup();

}

// restore
else if ($action === 'restore') {

  sleep(1);
  if ( isset( $_POST['id'] ) && $DontStrave->restore( $_POST['id'] ) ) {
    echo 1;
  }
  else {
    echo 0;
  } 

}

// delete
else if ($action === 'delete') {

  sleep(1);
  if (isset($_POST['id'])) {
    echo $DontStrave->delete( $_POST['id'] );
  }
  else {
    echo 0;
  }

}