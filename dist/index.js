'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SenecaMergeValidate;

var _joi = require('joi');

var Joi = _interopRequireWildcard(_joi);

var _btimeSchemaValidatePackage = require('btime-schema-validate-package');

var BtimeSchemaValidatePackage = _interopRequireWildcard(_btimeSchemaValidatePackage);

var _lodash = require('lodash');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var DEFAULT_PICK_FIELDS = ['user', 'requestOptions'];

var validateSchema = BtimeSchemaValidatePackage.getSchema({
  name: 'request-options', method: 'seneca-merge-validate'
});

var DEFAULT_SCHEMA = validateSchema.result;

function SenecaMergeValidate(seneca) {
  var getParams = function getParams(args, fields) {
    return (0, _lodash.pick)(seneca.util.clean(args), (0, _lodash.union)(DEFAULT_PICK_FIELDS, (0, _lodash.isArray)(fields) && fields || []));
  };

  var getSchema = function getSchema(schema) {
    var name = schema.name || '';
    var method = schema.method || '';

    var validateSchema = BtimeSchemaValidatePackage.getSchema({ name: name, method: method });

    var formattedSchema = (0, _lodash.isPlainObject)(validateSchema) && validateSchema.result && validateSchema.result || {};

    return (0, _lodash.merge)({}, DEFAULT_SCHEMA, (0, _lodash.isPlainObject)(formattedSchema) && formattedSchema || {});
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
