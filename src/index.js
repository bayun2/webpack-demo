import $ from 'zepto';
import Flipsnap from 'flipsnap';

import './global.less';
import './index.less';

// $('body').css('background-color', 'red');
//
// Flipsnap('.flipsnap');

class Index {
  constructor() {
    $('body').css('background-color', 'red');
    Flipsnap('.flipsnap');
  }
}

new Index();

module.exports = Index;
