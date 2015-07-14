var _ = require( 'lodash' );
var JsonValidator = require( 'jsonschema' ).Validator;
var jsonValidator = new JsonValidator();

function SailsJsonSchemaRequestValidator() {
}

SailsJsonSchemaRequestValidator.prototype = {

    /**
     * Validates the resource against the json schema. On validation error, sends a bad request message.
     * @param resourceName The name of the resource.
     * @param resource The resource to validate.
     * @param schema The json schema to validate against.
     * @param res The sails response to call badRequest on in case of validation error.
     * @returns {boolean} True iff the resource is valid, false otherwise.
     */
    validate: function( resourceName, resource, schema, res ) {

        var validation = jsonValidator.validate(
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
            res.badRequest( valError.stack );
            return false;
        }

        return true;
    },

    /**
     * Validates the resource against the json schema. On validation error, calls badRequest on the response.
     * @param resourceName The name of the resource.
     * @param patch The resource patch to validate.
     * @param schema The json schema to validate against.
     * @param res The sails response to call badRequest on in case of validation error.
     * @returns {boolean} True iff the resource patch is valid, false otherwise.
     */
    validatePatch: function( resourceName, patch, schema, res ) {

        var keys = _.keys( patch );
        for( var i = 0; i < keys.length; i++ ) {

            var key = keys[ i ];
            var value = patch[ key ];
            var fullKey = resourceName + '.' + key;

            var propertySchema = schema.properties[ key ];
            if( !propertySchema ) {

                res.badRequest( 'unknown property \'' + fullKey + '\'' );
                return false;
            }

            var validation = jsonValidator.validate(
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
                res.badRequest( valError.stack );
                return false;
            }
        }

        return true;
    }
};


module.exports = new SailsJsonSchemaRequestValidator();