/**
 * ------------------------------------------------------------
 * Component
 * ------------------------------------------------------------
 */


(function() {

'use strict';

var root = this,
    $fileList;



/**
 * ------------------------------------------------------------
 * Helper
 * ------------------------------------------------------------
 */

function toggleStatusFileList() {
  $fileList = $('#file-lists') || $fileList;
  $fileList.toggleClass('busy');
}



/**
 * Backup button
 * ------------------------------------------------------------
 * @name root.BackupBtn
 */


root.BackupBtn = React.createClass({

  componentDidMount: function() {
    var $node = $(this.getDOMNode()),
        $btn = $node.find('button'),
        $img = $node.find('img');

    $btn.on('click', function() {

      $.ajax({
        type: 'POST',
        url: 'api.php',
        data: {
          action: 'backup'
        },
        beforeSend: function() {
          $img.removeClass('hide');
          toggleStatusFileList();
        }
      })
      .done(function(resp) {

        $('#file-lists').children().trigger('update-list', [resp]);
        toggleStatusFileList();

      })
      .error(function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR, textStatus, errorThrown);
        alert('Error!, Please try again later.');
      })
      .always(function() {
        $img.addClass('hide');
      });

    });
  },

  render: function() {

    return (
      <div>
        <button id="backup" className="btn btn-primary">Backup save file !</button>
        <img src="images/ajax-loader.gif" alt="" className="hide" style={{ marginLeft: '10px' }} />
      </div>
    );

  }

});


/**
 * File list
 * ------------------------------------------------------------
 * @name name
 */


root.FileLists = React.createClass({

  getInitialState: function() {
    return {
      files: []
    };
  },

  componentDidMount: function() {

    var that = this;
    this.$node = $(this.getDOMNode()) || this.$node;

    // load file list
    $.ajax({
      url: 'api.php',
      data: {
        action: 'file_list'
      }
    })
    .done(function(resp) {
      this.setState({ files: resp });
    }.bind(this));


    // create custom event for update list
    this.$node.on('update-list', function(e, data) {
      this.setState({ files: data });
    }.bind(this));


    // bind event delete
    this.$node.on('click', '.btn-delete', function() {
      var $el = $(this),
          file_name = $el.closest('tr').find('.name').text();

      if (!confirm('Do you want to `delete` backup file ? [' + file_name +  ']')) {
        return;
      }

      var id = $el.parent().attr('data-id');

      $.ajax({
        type: 'POST',
        url: 'api.php',
        data: {
          action: 'delete',
          id: id
        },
        beforeSend: function() {
          toggleStatusFileList();
        }
      })
      .done(function(resp) {
        if (resp) {
          that.setState({ files: resp });
        }
      })
      .always(function() {
        toggleStatusFileList();
      });

    });


    // bind event restore
    this.$node.on('click', '.btn-restore', function() {
      var $el = $(this),
          file_name = $el.closest('tr').find('.name').text();

      if (!confirm('Do you want to `restore` backup file ? [' + file_name +  ']')) {
        return;
      }

      var id = $el.parent().attr('data-id');

      $.ajax({
        type: 'POST',
        url: 'api.php',
        data: {
          action: 'restore',
          id: id
        },
        beforeSend: function() {
          toggleStatusFileList();
        }
      })
      .done(function(resp) {
        if (resp) {
          alert('Restore save file success !');
        }
        else {
          alert('Restore save file fail !!'); 
        }
      })
      .always(function() {
        toggleStatusFileList();
      });

    });


  },


  componentDidUpdate: function() {
    var that = this;

    this.$node.find('.toggle-tooltip').each(function(i, el) {
      var $el = $(el);

      // enable tooltip
      $el.tooltip().removeClass('toggle-tooltip');

    });

  },


  render: function() {

    var tpl = {};

    $.map(this.state.files, function(item, i) {
      tpl['row-' + i] = (
        <tr>
          <td className="name">{item.name}</td>
          <td className="created">{moment(item.created).fromNow()}</td>
          <td className="action" data-id={item.id}>
            <span className="icon-btn btn-delete toggle-tooltip" data-title="Delete this backup">
              <i className="glyphicon glyphicon-trash" />
            </span>
            <span className="icon-btn btn-restore toggle-tooltip" data-title="Restore this backup">
              <i className="glyphicon glyphicon-floppy-open" />
            </span>
          </td>
        </tr>
      );
    });
    
    return (
      <table className="table table-striped">
        <thead>
          <th className="name">File name</th>
          <th className="created">Created</th>
          <th className="action">Action</th>
        </thead>
        <tbody>
          {tpl}
        </tbody>
      </table>
    );

  }

});


}).call(this);