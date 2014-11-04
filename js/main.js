(function() {

'use strict';

var root = this;

React.renderComponent(
  root.BackupBtn(),
  document.getElementById('backup-btn-container')
);


React.renderComponent(
  root.FileLists(),
  document.getElementById('file-lists')
);



}).call(this);