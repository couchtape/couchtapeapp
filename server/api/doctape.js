(function () {

    var request = require('request');


    // ## Core Constructor

  // The Doctape core module consists of a platform-independent
  // DoctapeCore-class which holds the configuration and owns also
  // the platform-independent front-end functions.

  /** @constructor */
  var DoctapeCore = function () {

    // The API configuration is currently hard-coded.

    this.options = {
      protocol: 'https',
      host:  'my.doctape.com',
      port:  null,
      base:  '/v1',
      scope: [],
      client_id:     null,
      client_secret: null
    };

    this._token = {
      type:      null,
      timeout:   null,
      timestamp: null,
      access:    null,
      refresh:   null
    };

    // This library factors the platform-dependent back-end including
    // functions like http-request or getting an access token
    // into "environments". The following object has to be filled by
    // the environment.

    this.env = {
      emit: null,
      subscribe: null,
      unsubscribe: null,
      req: null
    };

  };

  // We currently use this to register with the top-level.
  // It may be worthwhile to find a way to also abstract this
  // into the environments.

  if (typeof exports !== 'undefined' && module && module['exports']) {
    module['exports'] = DoctapeCore;
  } else {
    window['DoctapeCore'] = DoctapeCore;
  }


  // ## Getter / Setter Functions

  DoctapeCore.prototype.setScope = function (scope_array) {
    this.options.scope = scope_array;
  };

  DoctapeCore.prototype.scope = function () {
    return this.options.scope;
  };

  DoctapeCore.prototype.setCredentials = function (id, secret) {
    this.options.client_id = id;
    this.options.client_secret = secret;
  };

  DoctapeCore.prototype.clientId = function () {
    return this.options.client_id;
  };

  DoctapeCore.prototype.clientSecret = function () {
    return this.options.client_secret;
  };

  DoctapeCore.prototype.setToken = function (obj) {
    this._token.type      = obj.token_type;
    this._token.timeout   = obj.expires_in;
    this._token.timestamp = obj.timestamp || (new Date()).getTime();
    this._token.access    = obj.access_token;
    this._token.refresh   = obj.refresh_token;
  };

  DoctapeCore.prototype.token = function () {
    return {
      token_type:    this._token.type,
      expires_in:    this._token.timeout,
      timestamp:     this._token.timestamp,
      access_token:  this._token.access,
      refresh_token: this._token.refresh
    };
  };

  DoctapeCore.prototype.setBaseUrl = function (url) {
    var regex = /([a-z]+):\/\/([^:]+):?([0-9]+)?/;
    var parts = url.match(regex);
    this.options.protocol = parts[1] || null;
    this.options.host     = parts[2] || null;
    this.options.port     = parts[3] || null;
  };

  DoctapeCore.prototype.baseUrl = function () {
    return this.options.protocol + '://' +
           this.options.host + (this.options.port ? ':' + this.options.port : '');
  };

  DoctapeCore.prototype.authUrl = function (redirect) {
    return '/' + 'oauth2' +
           '?' + 'response_type=' + 'code' +
           '&' + 'client_id='     + encodeURIComponent(this.options.client_id) +
           '&' + 'scope='         + encodeURIComponent(this.options.scope.join(' ')) +
           '&' + 'redirect_uri='  + encodeURIComponent(redirect) || 'urn:ietf:wg:oauth:2.0:oob';
  };


  // ## Core Functions

  // Not for direct use.

  /**
   * Perform a standard POST-request with raw form post data.
   *
   * @param {string} path
   * @param {Object} data
   * @param {function (Object, Object=)} cb
   */
  var _post_raw = function (path, data, cb) {
    var lines = [];
    var field;
    for (field in data) {
      lines.push(field + '=' + encodeURIComponent(data[field]));
    }
    this.env.req({
      method:   'POST',
      host:     this.options.host,
      port:     this.options.port,
      path:     path,
      headers:  {'Content-Type': 'application/x-www-form-urlencoded'},
      postData: lines.join('&')
    }, cb);
  };


  // ## OAuth functions

  // These functions will authorize the client on a doctape
  // API server.

  /**
   * Perform an authorized GET-request using an access-token.
   *
   * @param {string} endpoint
   * @param {function (Object, Object=)} cb
   */
  var _get_authorized = DoctapeCore.prototype.getAuthorized = function (endpoint, cb, pipe) {
    var self = this;
    this.with_valid_access_token(function (token) {
        var request = {
            method:  'GET',
            host:    self.options.host,
            port:    self.options.port,
            path:    self.options.base + endpoint,
            headers: {'Authorization': 'Bearer ' + token}
        };
        var data = self.env.req(request, cb);
        if (pipe) {
            data.pipe(pipe);
        }
    });
  };

   /**
   * Perform an authorized GET-request using an access-token.
   *
   * @param {string} endpoint
   * @param {function (Object, Object=)} cb
   */
  var _get_authorized_pipe = DoctapeCore.prototype.getAuthorizedPipe = function (endpoint, cb, pipe) {
    var self = this;
    this.with_valid_access_token(function (token) {
      request({
        method:  'GET',
        host:    self.options.host,
        port:    self.options.port,
        path:    self.options.base + endpoint,
          uri: 'https://'+self.options.host + self.options.base + endpoint,
        headers: {'Authorization': 'Bearer ' + token}
      }).pipe(pipe);
    });
  };

  /**
   * Perform an authorized POST-request using an access-token.
   *
   * @param {string} endpoint
   * @param {Object} data
   * @param {function (Object, Object=)} cb
   */
  var _post_authorized = DoctapeCore.prototype.postAuthorized = function (endpoint, data, cb) {
    var self = this;
    this.with_valid_access_token(function (token) {
      self.env.req({
        method:   'POST',
        host:     self.options.host,
        port:     self.options.port,
        path:     self.options.base + endpoint,
        headers:  {'Authorization': 'Bearer ' + token,
                   'Content-Type': 'application/json; charset=UTF-8'},
        postData: JSON.stringify(data)
      }, cb);
    });
  };

   /**
   * Perform an authorized DELETE-request using an access-token.
   *
   * @param {string} endpoint
   * @param {function (Object, Object=)} cb
   */
  var _delete_authorized = DoctapeCore.prototype.deleteAuthorized = function (endpoint, cb) {
    var self = this;
    this.with_valid_access_token(function (token) {
      self.env.req({
        method:  'DELETE',
        host:    self.options.host,
        port:    self.options.port,
        path:    self.options.base + endpoint,
        headers: {'Authorization': 'Bearer ' + token}
      }, cb);
    });
  };

  /**
   * Ensure a valid access token, then continue.
   *
   * @param {function (?string)} fn
   */
  DoctapeCore.prototype.with_valid_access_token = function (fn) {
    if (this._token.timestamp + this._token.timeout * 1000 > (new Date()).getTime()) {
      return fn(this._token.access);
    } else {
      var self = this;
      var on_refresh = function () {
        self.with_valid_access_token(fn);
        self.env.unsubscribe('auth.refresh', on_refresh);
      };
      this.env.subscribe('auth.refresh', on_refresh);
      this.oauth_refresh();
    }
  };

  /**
   * Private helper function for registering a new token.
   * @param {string} error_msg
   */
  var mk_token_registry = function (error_msg) {
    var self = this;
    return function (err, resp) {
      self._lock_refresh = undefined;
      if (!err) {
        var auth = JSON.parse(resp);
        if (!auth.error) {
          self.setToken(auth);
          return self.env.emit('auth.refresh', self.token());
        }
        return self.env.emit('auth.fail', error_msg + ': ' + JSON.stringify(auth.error));
      }
      return self.env.emit('auth.fail', error + ': ' + JSON.stringify(err));
    };
  };

  /**
   * Exchange an authorization code for an access token and a
   * refresh token.
   *
   * @param {string} code
   */
  DoctapeCore.prototype.oauth_exchange = function (code) {
    if (this._lock_refresh === undefined) {
      this._lock_refresh = true;
      _post_raw.call(this, '/oauth2/token',
        { code:          code,
          client_id:     this.options.client_id,
          client_secret: this.options.client_secret,
          redirect_uri:  'urn:ietf:wg:oauth:2.0:oob',
          grant_type:    'authorization_code' },
        mk_token_registry.call(this, 'error exchanging token'));
    }
  };

  /**
   * Get a new access token by using the already-received refresh
   * token.
   */
  DoctapeCore.prototype.oauth_refresh = function () {
    if (this._lock_refresh === undefined) {
      this._lock_refresh = true;
      _post_raw.call(this, '/oauth2/token',
        { refresh_token: this._token.refresh,
          client_id:     this.options.client_id,
          client_secret: this.options.client_secret,
          grant_type:    'refresh_token' },
        mk_token_registry.call(this, 'error refreshing token'));
    }
  };


  // ## Misc functions

  /**
   * Subscribe to a specific event.
   */
  DoctapeCore.prototype.subscribe = function (ev, fn) {
    this.env.subscribe(ev, fn);
  };

  /*
   * Unsubscribe from a specific event.
   */
  DoctapeCore.prototype.unsubscribe = function (ev, fn) {
    this.env.unsubscribe(ev, fn);
  };


  // ## API functions

  // What follows are functions as a frontend to our API.
  // When working with this client, please only use these functions
  // and don't depend on the lower-level architecture.

  /**
   * Fetch Account Data, returns `cb(err, jsonData)`.
   *
   * @param {function (Object, Object=)} cb
   */
  DoctapeCore.prototype.account = function (cb) {
    _get_authorized.call(this, '/account',
                    function (err, data) {
      if (err) { return cb(err); }
      data = JSON.parse(data);
      if (data.error) {
        return cb(data.error);
      }
      return cb(null, data.result);
    });
  };

  /**
   * Fetch Documentlist, returns `cb(err, jsonData)`.
   *
   * @param {function (Object, Object=)} cb
   */
  DoctapeCore.prototype.list = function (cb) {
    _get_authorized.call(this, '/doc?include_meta',
                    function (err, data) {
      if (err) { return cb(err); }
      data = JSON.parse(data);
      if (data.error) {
        return cb(data.error);
      }
      return cb(null, data.result);
    });
  };

  /**
   * Fetch Document data, returns `cb(err, docData)
   *
   * @param {Object} docId
   * @param {function (Object, Object=)} cb
   */
  DoctapeCore.prototype.get = function (docId, cb) {
    _get_authorized.call(this, '/doc/' + docId,
                    function (err, data) {
      if (err) { return cb(err); }
      data = JSON.parse(data);
      if (data.error) {
        return cb(data.error);
      }
      return cb(null, data.result);
    });
  };

  /**
   * Fetch Tape data, returns `cb(err, docData)
   *
   * @param {function (Object, Object=)} cb
   */
  DoctapeCore.prototype.tape = function (cb) {
    _get_authorized.call(this, '/tape',
                    function (err, data) {
      if (err) { return cb(err); }
      data = JSON.parse(data);
      if (data.error) {
        return cb(data.error);
      }
      return cb(null, data.result);
    });
  };

  /**
   *
   * Download `filename` of given `docId`, stream content to `stream`;
   *
   * @param {string} docId
   * @param {string} filename
   * @param {Object} stream
   * @param {function (Object, Object=)} cb
   */
  DoctapeCore.prototype.downloadStream = function (docId, filename, stream, cb) {
    if (!this.env['isNode']) {
      console.log("Only available in Node.js");
    } else {
      _get_authorized_pipe.call(this, '/doc/' + docId + '/' + filename,
                      function (err, data){
        if (err) { return cb(err); }
        return cb(null, data);
      },stream);
    }
  };

  /**
   *
   * Download `filename` of given `docId`, put content in (cb);
   *
   * @param {string} docId
   * @param {string} filename
   * @param {function (Object, Object=)} cb
   */
  DoctapeCore.prototype.download = function (docId, filename, cb) {
    _get_authorized.call(this, '/doc/' + docId + '/' + filename,
                    function (err, data){
      if (err) { return cb(err); }
      return cb(null, data);
    });
  };

  /**
   *
   * Update `docId` with `params`
   *
   * @param {Object} docId
   * @param {Object} params
   * @param {function (Object, Object=)} cb
   */
  DoctapeCore.prototype.update = function (docId, params, cb) {
    _post_authorized.call(this, '/doc/' + docId,
                     params,
                     function (err, data){
      if (err) { return cb(err); }
      data = JSON.parse(data);
      if (data.error) {
        return cb(data.error);
      }
      return cb(null, data.result);
    });
  };
  
  /**
   * Destroy given docId
   *
   * @param {Object} docId
   * @param {function (Object, Object=)} cb
   */
  DoctapeCore.prototype.destroy = function (docId, cb) {
    _delete_authorized.call(this, '/doc/' + docId,
                       function (err, data){
      if (err) { return cb(err); }
      data = JSON.parse(data);
      if (data.error) {
        return cb(data.error);
      }
      return cb(null, data.result);
    });
  };
  
  /**
   *
   *
   *
   * @param {Object} docId
   * @param {Object} state
   * @param {function (Object, Object=)} cb
   */
  DoctapeCore.prototype.setPublic = function (docId, state, cb) {
    _post_authorized.call(this, '/doc/' + docId + '/public',
                     {'public': state},
                     function (err, data){
      if (err) { return cb(err); }
      data = JSON.parse(data);
      if (data.error) {
        return cb(data.error);
      }
      return cb(null, data.result);
    });
  };


}).call(this);var util   = require('util');
var events = require('events');
var http   = require('http');
var https  = require('https');

var DoctapeCore = require('./doctape.js');

var Doctape = module.exports = function () {

  var self = new DoctapeCore();
  self.prototype = DoctapeCore;

  self.env.isNode = true;

  self.env.emitter = new events.EventEmitter();

  self.env.emit = function (event, data) {
    self.env.emitter.emit(event, data);
  };

  self.env.subscribe = function (event, fn) {
    self.env.emitter.addListener(event, fn);
  };

  self.env.unsubscribe = function (event, fn) {
    self.env.emitter.removeListener(event, fn);
  };

  self.env.req = function (options, cb) {

    var mod = (self.options.protocol == 'http') ? http : https;

    var req = mod.request(options, function (resp) {

      var responseData = '';

      resp.setEncoding('utf8');

      resp.on('data', function (chunk) {
        responseData += chunk;
      });

      resp.on('end', function () {
        cb(null, responseData);
      });

    });

    req.on('error', function (err) {
      cb(err);
    });

    if (options.postData) {
      req.write(options.postData);
    }

    req.end();

  };

  return self;

};