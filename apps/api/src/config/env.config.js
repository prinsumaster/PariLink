"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var env_schema_1 = require("./env.schema");
function validate(config) {
    var validatedConfig = (0, class_transformer_1.plainToInstance)(env_schema_1.EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });
    var errors = (0, class_validator_1.validateSync)(validatedConfig, {
        skipMissingProperties: false,
    });
    if (errors.length > 0) {
        throw new Error("Config validation error: \n".concat(errors
            .map(function (e) { return Object.values(e.constraints || {}).join(', '); })
            .join('\n')));
    }
    return validatedConfig;
}
