'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SenecaMergeValidate;

var _joi = require('joi');

var Joi = _interopRequireWildcard(_joi);

var _lodash = require('lodash');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var DEFAULT_PICK_FIELDS = ['options'];
var DEFAULT_SCHEMA = {
  options: Joi.object().keys({
    fields: Joi.array().min(1).optional().description('the fields option to merge with select clause'),

    filters: Joi.object().min(1).optional().description('the filters option to merge with where clause'),

    paginate: Joi.object().keys({
      page: Joi.number().integer().optional().description('the page option to merge with query params'),

      limit: Joi.number().integer().optional().description('the limit option to merge with query params')
    })
  }).optional().description('the options to merge with query params')
};

function SenecaMergeValidate(seneca) {
  var getParams = function getParams(args, fields) {
    return (0, _lodash.pick)(seneca.util.clean(args), (0, _lodash.union)(DEFAULT_PICK_FIELDS, (0, _lodash.isArray)(fields) && fields || []));
  };

  var getSchema = function getSchema(schema) {
    return (0, _lodash.merge)({}, DEFAULT_SCHEMA, (0, _lodash.isPlainObject)(schema) && schema || {});
  };

  var getOptions = function getOptions(options) {
    return (0, _lodash.isPlainObject)(options) && options || { abortEarly: false };
  };

  var getPluginName = function getPluginName(args) {
    return args && args.meta$ && args.meta$.plugin && args.meta$.plugin.name;
  };

  var getErrorMessageByPluginName = function getErrorMessageByPluginName(pluginName) {
    var message = pluginName && '| ' + pluginName || '';
    return 'LOG::[VALIDATION ERROR ' + message + ']';
  };

  var validate = function validate(data) {
    var schema = getSchema(data.schema);
    var params = getParams(data.args, data.pick);
    var pluginName = getPluginName(data.args || {});
    var isValid = Joi.validate(params, schema, getOptions(data.options));

    if (isValid.error) {
      seneca.log.error(getErrorMessageByPluginName(pluginName), isValid.error);
      return Promise.reject({ status: false, message: isValid.error });
    }
    return Promise.resolve(params);
  };

  return { validate: validate, Joi: Joi };
}
