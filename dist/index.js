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

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var DEFAULT_PICK_FIELDS = ['requestOptions', 'credentials'];

var validateSchema = BtimeSchemaValidatePackage.getSchema({
  name: 'request-options', method: 'seneca-merge-validate'
});

var DEFAULT_SCHEMA = validateSchema.result;

function SenecaMergeValidate(seneca) {
  var getParams = function getParams(args, fields) {
    return _.pick(seneca.util.clean(args), _.union(DEFAULT_PICK_FIELDS, _.isArray(fields) && fields || []));
  };

  var getSchema = function getSchema(schema) {
    var name = schema.name || '';
    var method = schema.method || '';

    var validateSchema = BtimeSchemaValidatePackage.getSchema({ name: name, method: method });

    var formattedSchema = _.isPlainObject(validateSchema) && validateSchema.result && validateSchema.result || {};

    return _.merge({}, DEFAULT_SCHEMA, _.isPlainObject(formattedSchema) && formattedSchema || {});
  };

  var getOptions = function getOptions(options) {
    return _.isPlainObject(options) && options || { abortEarly: false };
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
