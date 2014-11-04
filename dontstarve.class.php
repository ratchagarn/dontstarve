<?php
/**
 * ============================================================
 * Don't edit this section if you don't know what are you doing!
 * ============================================================
 */

/**
 * Dont strave class
 * ============================================================
 * @name DontStarve
 */

class DontStarve {

  protected $save_file_locaton;
  protected $backup_save_path;

  public function __construct($save_file_location) {
    $this->save_file_locaton = $save_file_location;
    $this->backup_save_path = 'saves';
  }


  /**
   * get file name from path
   * ============================================================
   * @name getFileName
   * @param {String} file path
   * @return {String} file name from path
   */
  
  private function getFileName($path) {
    $fragments = explode('/', $path);
    return array_pop($fragments);
  }
  


  /**
   * list backup file list
   * ============================================================
   * @name fileList
   * @param {boolean} convert array to json or not
   * @return {Array} current file list
   */
  
  public function fileList($to_json = TRUE) {

    $file_lists = array();

    foreach (glob($this->backup_save_path . '/*') as $file_path) {
      $file_name = DontStarve::getFileName($file_path);
      $file_lists[] = array(
        'id' => base64_encode($file_path),
        'name' => $file_name,
        'created' => filemtime($file_path) * 1000
      );
    }

    rsort($file_lists);

    if ($to_json) {
      return json_encode($file_lists);
    }
    else {
      return $file_lists;
    }
    
  }
  


  /**
   * create backup file
   * ============================================================
   * @name backup
   * @return {Array} current file list
   */
  
  public function backup() {

    // if not found saves folder then create it
    if (!is_dir($this->backup_save_path)) {
      mkdir($this->backup_save_path)l
    }

    $copy_path = $this->backup_save_path . '/' . 'backup_' . time();
    mkdir($copy_path);

    foreach (glob($this->save_file_locaton . '/*') as $file_path) {
      $file_name = DontStarve::getFileName($file_path);
      copy($file_path, $copy_path . '/' . $file_name);
    }

    return DontStarve::fileList();

  }


  /**
   * restock backup file to save location
   * ============================================================
   * @name restore
   * @param {String} backup file path that encode with base64
   */
  
  public function restore($id) {

    $path = base64_decode($id);

    if (is_dir($path)) {

      foreach (glob($this->save_file_locaton . '/*') as $file_path) {
        unlink($file_path);
      }

      foreach (glob($path . '/*') as $file_path) {
        $file_name = DontStarve::getFileName($file_path);
        copy($file_path, $this->save_file_locaton . '/' . $file_name);
      }

      return 1;
    }
    else {
      return 0;
    }

  }


  /**
   * delete backup file
   * ============================================================
   * @name delete
   * @param {String} backup file path that encode with base64
   * @return {Array} current file list
   */
  
  public function delete($id) {

    $path = base64_decode($id);

    if (is_dir($path)) {
      foreach (glob($path . '/*') as $file_path) {
        unlink($file_path);
      }
      rmdir($path);
      return DontStarve::fileList();
    }
    else {
      return 0;
    }

  }


}