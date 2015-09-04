var _ = require( 'lodash' );

var jsonschema = require( 'jsonschema' );
var ValidationError = jsonschema.ValidationError;
var validator = new jsonschema.Validator();

function RestJsonSchemaValidator() {
}

RestJsonSchemaValidator.prototype = {

    /**
     * Validates the resource against the json schema.
     * @param resourceName The name of the resource.
     * @param resource The resource to validate.
     * @param schema The json schema to validate against.
     * @returns An error in the case of invalid; null otherwise.
     */
    validate: function( resourceName, resource, schema ) {

        var validation = validator.validate(
            resource,
            schema,
            {
                propertyName: resourceName,
                allowUnknownAttributes: false,
                throwError: false
            }
        );

        if( validation.errors.length > 0 ) {

            var valError = validation.errors[ 0 ];
            return valError;
        }

        return null;
    },

    /**
     * Validates the resource against the json schema, but only the properties present in the patch.
     * @param resourceName The name of the resource.
     * @param patch The resource patch to validate.
     * @param schema The json schema to validate against.
     * @returns An error in the case of invalid; null otherwise.
     */
    validatePatch: function( resourceName, patch, schema ) {

        var keys = _.keys( patch );
        for( var i = 0; i < keys.length; i++ ) {

            var key = keys[ i ];
            var value = patch[ key ];
            var fullKey = resourceName + '.' + key;

            var propertySchema = schema.properties[ key ];
            if( !propertySchema ) {

                var message = "additionalProperty " + JSON.stringify( key ) + " exists in instance when not allowed";
                var instance = patch;
                var propertyPath = resourceName;
                var name = 'additionalProperties';
                var argument = key;

                var valError = new ValidationError( message, instance, schema, propertyPath, name, argument );
                return valError;
            }

            var validation = validator.validate(
                value,
                propertySchema,
                {
                    propertyName: fullKey,
                    allowUnknownAttributes: false,
                    throwError: false
                }
            );

            if( validation.errors.length > 0 ) {

                var valError = validation.errors[ 0 ];
                return valError;
            }
        }

        return null;
    }
};

module.exports = RestJsonSchemaValidator;
