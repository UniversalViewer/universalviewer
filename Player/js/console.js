(function(window){

  if (typeof console === 'undefined') {
    /**
     * @see http://getfirebug.com/wiki/index.php/Console_API
     */
    window.console = {
      toString: function (){
        return 'Console.js version 0.9';
      }
    };
  }

  console._output = console.log || window.opera && opera.postError || function dump (message) {
    console.history = console.history || [];
    return console.history.push(message);
  };

  /**
   * Limit of objects dimensions
   * console.dimensions_limit = 1
   * console.dir({a:{b:1}}) ==> {a: {?}}
   * console.dimensions_limit = 2
   * console.dir({a:{b:1}}) ==> {a: {b: 1}}
   */
  console.dimensions_limit = 3;

  /**
   * repeatString("Ha ", 2) ==> "Ha Ha "
   * @param {String} string
   * @param {Number} times
   */
  function repeatString (string, times) {
    if (times < 1) {
      return '';
    }
    var result = string;
    for (var i=times; --i;) {
      result += string;
    }
    return result;
  }

  console._indent = '  ';

  /**
   * @param {Object} object
   * @return {String}
   */
  function primitiveOf(object) {
    var value = object.valueOf();
    switch (typeof value) {
      case "object":
        return "";
      case "string":
        return '"' + value +'"';
      default:
        return String(value);
    }
  }

  /**
   * source_of({x:2, y:8}) === '{x: 2, y: 8}'
   * @param {*} arg
   * @param {Number} limit dimension of objects
   * @param {Array} stack of parent objects
   * @return {String} string representation of input
   */
  console._source_of = function source_of (arg, limit, stack) {

    var aType = typeof arg;
    switch (aType) {
      case 'string':
        return '"' + arg +'"';
      case 'function':
        break;
      case 'object':
        if (arg === null) {
          return 'null';
        }
        break;
      default:
        return String(arg);
    }

    var prefix;
    var kind = Object.prototype.toString.call(arg).slice(8, -1);
    if (kind == 'Object') {
      prefix = '';
    } else {
      prefix = kind + ' ';
      var primitive = primitiveOf(arg);
      if (primitive) {
        prefix += primitive + ' ';
      }
    }
    if (!limit) {
      return prefix + '{?}';
    }
    // Check circular references
    var stack_length = stack.length;
    for (var si=0; si<stack_length; si++) {
      if (stack[si] === arg) {
        return '#';
      }
    }
    stack[stack_length++] = arg;
    var indent = repeatString(console._indent, stack_length);
    if (Object.getOwnPropertyNames) {
      var keys = Object.getOwnPropertyNames(arg);
    } else {
      keys = [];
      for (var key in arg) {
        keys.push(key);
      }
    }
    var result = prefix + '{';
    if (!keys.length) {
      return result + "}";
    }
    keys = keys.sort();
    var arr_obj = [];
    for (var n=0, nn=keys.length; n<nn; n++) {
      key = keys[n];
      try {
        var value = source_of(arg[key], limit-1, stack);
        arr_obj.push("\n"+ indent + key +': '+ value);
      } catch (e) {}
    }
    return result + arr_obj.join(', ') +'\n'+ repeatString(console._indent, stack_length - 1) + '}';

  };


  if (!console.dir || browser_suck_at_logging) {
    /**
     * @return {String} human-readable representation of input
     */
    console.dir = function dir (/* ...arguments */) {
      var result = [];
      for (var i=0; i<arguments.length; i++) {
        result.push(console._source_of(arguments[i], console.dimensions_limit, []));
      }
      return console._output(result.join(console._args_separator));
    };
  }


  /**
   * @param {*} arg
   * @param {Boolean} [within=false]
   */
  console._inspect = function inspect(arg, within) {
    var result = '';

    // TODO: http://twitter.com/abozhilov/status/27768472491
    if (Object(arg) !== arg) {
      if (within && typeof arg == 'string') {
        return '"' + arg + '"';
      }
      return arg;
    }

    if (arg && arg.nodeType == 1) {
      // Is element?
      result = '<'+ arg.tagName;
      for (var i=0, ii=arg.attributes.length; i<ii; i++) {
        if (arg.attributes[i].specified) {
          result +=' '+ arg.attributes[i].name +'="'+ arg.attributes[i].value +'"';
        }
      }
      if (arg.childNodes && arg.childNodes.length === 0) {
        result += '/';
      }
      return result + '>';
    }

    var kind = Object.prototype.toString.call(arg).slice(8, -1);
    switch (kind) {
      case 'String':
        return 'String "' + arg +'"';

      case 'Number':
      case 'Boolean':
        return kind + ' ' + arg;

      case 'Array':
      case 'HTMLCollection':
      case 'NodeList':
        // Is array-like object?
        result = kind == 'Array' ? '[' : kind + ' [';
        var arr_list = [];
        for (var j=0, jj=arg.length; j<jj; j++) {
          arr_list[j] = inspect(arg[j], true);
        }
        return result + arr_list.join(', ') +']';

      case 'Function':
      case 'Date':
        return arg;

      case 'RegExp':
        return "/"+ arg.source +"/";

      default:
        if (typeof arg === 'object') {
          var prefix;
          if (kind == 'Object') {
            prefix = '';
          } else {
            prefix = kind + ' ';
          }
          if (within) {
            return prefix + '{?}';
          }
          if (Object.getOwnPropertyNames) {
            var keys = Object.getOwnPropertyNames(arg);
          } else {
            keys = [];
            for (var key in arg) {
              if (arg.hasOwnProperty(key)) {
                keys.push(key);
              }
            }
          }
          result = prefix + '{';
          if (!keys.length) {
            return result + "}";
          }
          keys = keys.sort();
          var properties = [];
          for (var n=0, nn=keys.length; n<nn; n++) {
            key = keys[n];
            try {
              var value = inspect(arg[key], true);
              properties.push(key +': '+ value);
            } catch (e) {}
          }
          return result + properties.join(', ') +'}';
        } else {
          return arg;
        }
    }
  };


  var browser_suck_at_logging = /*@cc_on 1 || @*/ window.opera;

  var log_methods = ['log', 'info', 'warn', 'error', 'debug', 'dirxml'];

  console._args_separator = '\n';
  console._interpolate = /%[sdifo]/gi;

  for (var i=0; i<log_methods.length; i++) {
    var _log = console[log_methods[i]];
    if (browser_suck_at_logging || !console[log_methods[i]]) {
      console[log_methods[i]] = function logger (first_arg) {
        var result = [];
        var args = Array.prototype.slice.call(arguments, 0);
        if (typeof first_arg === 'string' && console._interpolate.test(first_arg)) {
          args.shift();
          result.push(first_arg.replace(console._interpolate, function(){
            return console._inspect(args.shift());
          }));
        }
        for (var i=0; i<args.length; i++) {
          result.push(console._inspect(args[i]));
        }
        return (_log || console._output)(result.join(console._args_separator));
      };
    }
  }

  /**
   * Simplified version of http://eriwen.com/javascript/js-stack-trace/
   */
  console.trace = console.trace || function trace() {
    try {
      i.dont.exist++;
    } catch(e) {
      var stack = e.stack || e.stacktrace;
      if (stack) {
        try {
          stack = stack.split('\n').slice(2).join('\n');
        } catch (err) {}
        console._output(stack);
      }
    }
  };


  /**
   * console.assert(false, "I'm gonna fail")
   * @param {Boolean} is_ok
   * @param {String} message optional
   */
  console.assert = console.assert || function assert (is_ok, message) {
    if (!is_ok) console._output( 'ASSERT FAIL: '+ message );
  };


  /**
   * @param {String} name optional
   */
  console.group = console.group || function group (name) {
    console._output('\n-------- '+ name +' --------');
  };

  console.groupCollapsed = console.groupCollapsed || console.group;

  /**
   * Print 3 line breaks
   */
  console.groupEnd = console.groupEnd || function groupEnd () {
    console._output('\n\n\n');
  };


  /**
   * @param {String} title optional
   */
  console.count = console.count || function count (title) {
    title = title || '';
    count.counters = count.counters || {};
    if (count.counters[title]) {
      count.counters[title]++;
    } else {
      count.counters[title] = 1;
    }
    console._output(title +' '+ count.counters[title]);
  };


  /**
   * @param {String} title optional
   */
  console.profile = console.profile || function profile (title) {
    return 'Not implemented';
  };
  console.profileEnd = console.profileEnd || function profileEnd () {
    return 'Not implemented';
  };


  console._timers = {};

  /**
   * @param {String} name such as "my damn slow parser"
   */
  console.time = console.time || function time (name) {
    var start = (new Date).getTime();
    console._timers[name] = {'start': start};
  };

  /**
   * @param {String} name such as "my damn slow parser"
   */
  console.timeEnd = console.timeEnd || function timeEnd (name) {
    var end = (new Date).getTime();
    console.info(name +': '+ (end - console._timers[name].start) +'ms');
    console._timers[name].end = end;
  };

  if (typeof require === 'function' && typeof exports !== 'undefined') {
    exports.console = window.console;
    console._output = require('system').print;
  }

})(this);