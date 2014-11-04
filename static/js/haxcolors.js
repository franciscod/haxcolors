function ebid(id) { return document.getElementById(id); }

$(function () {

  var inps = document.getElementsByTagName('input');
  var i;

  setstripe = function (num, visible, xs, xe, ang) {
      ebid('col'+num).style.display = (visible ? '' : 'none');
      ebid('l'+num).style.display = (visible ? '' : 'none');
      $('.preview .c' +num).each(function (lelele) {
          var max = parseInt($(this).css('height'));
          this.style.display = (visible ? '' : 'none');
          if (!visible) return;
          this.style.clip = 
              'rect(0px, ' + 
                  xe*max + 'px, ' + 
                  max + 'px, ' + 
                  xs*max + 'px)';
          this.style.transform = 'rotate('+ ang + 'deg)';
          this.style['-webkit-transform'] = this.style.transform;
          this.style.background = "#" + ebid('col' + num).value;
      });
  }
  redraw = function () {
      var ang = ebid('ang').value;
      var cols = 0;

      if (ebid('1col').checked) {
          cols = 1;
          setstripe(1, 1, 0.0, 1.0, ang);
          setstripe(2, 0);
          setstripe(3, 0);
      } else if (ebid('2col').checked) {
          cols = 2;
          setstripe(1, 1, 0.0, 0.51,  ang);
          setstripe(2, 1, 0.49, 1.0, ang);
          setstripe(3, 0);
      } else {
          cols = 3;
          setstripe(1, 1, 0.0, 0.31, ang);
          setstripe(2, 1, 0.29, 0.71, ang);
          setstripe(3, 1, 0.69, 1.0, ang);
      }

      $('.avatar').css('color', "#" + ebid('cola').value);
      $('.avatar').html(ebid('atex').value.substr(0,2));

      ebid('out').value = '/colors' + 
                          ' ' +(ebid('tred').checked ? 'red' : 'blue') + 
                          ' ' + ebid('ang').value + 
                          ' ' + ebid('cola').value +
                          (cols >= 1 ? ' ' + ebid('col1').value.toUpperCase() : '') + 
                          (cols >= 2 ? ' ' + ebid('col2').value.toUpperCase() : '') + 
                          (cols >= 3 ? ' ' + ebid('col3').value.toUpperCase() : '');
  }

  parsecmd = function () {
      var cmd = ebid('out').value.trim().split(' ');
      if (cmd.length > 7) return;
      if (cmd.length < 5) return;
      if (cmd[0] != '/colors') return;
      if ((cmd[1] != 'red') && (cmd[1] != 'blue')) return;
      ebid('t'+cmd[1]).click();
      ebid((cmd.length-4)+'col').click();
      if (!isNaN(parseInt(cmd[2]))) ebid('ang').value = parseInt(cmd[2]);
      if (cmd[3]) ebid('cola').color.fromString(cmd[3]);
      if (cmd[4]) ebid('col1').color.fromString(cmd[4]);
      if (cmd[5]) ebid('col2').color.fromString(cmd[5]);
      if (cmd[6]) ebid('col3').color.fromString(cmd[6]);
      redraw();
  }

  showPicker = function(i) { return (function (e) {
          ebid('col'+i).color.showPicker();
          e.stopPropagation();
  });}

  hidePicker = function(i) { return (function () {
      ebid('col'+i).color.hidePicker();
  });}

  for (i=0; i<inps.length;i++) 
      if (inps[i].id != 'out')
          inps[i].addEventListener('change', redraw);

  $('#out').bind('change', parsecmd);
  $('#atex').bind('keyup', redraw);
  $('#ang').bind('keyup', redraw);

  for (i=1; i<5; i++) {
      if (i==4) i='a';
      ebid('pc'+i).addEventListener('click', showPicker(i));
      ebid('field').addEventListener('click', hidePicker(i))
  }

  ebid('out').addEventListener('paste', function () { setTimeout(parsecmd, 50); });

  $('.hcnav a').click( function(e){
    e.preventDefault(); 
    $(this).tab('show');
  });

  var clip = new ZeroClipboard( $("button#copy-button") );
  redraw();
})
