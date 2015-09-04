var expect = require( 'expect' );
var validator = require( '..' );
var ValidationError = require( 'jsonschema' ).ValidationError;

var schema = {
    "type": "object",
    "properties": {
        "firstName": {
            "type": "string"
        },
        "lastName": {
            "type": "string"
        },
        "age": {
            "description": "Age in years",
            "type": "integer",
            "minimum": 0
        }
    },
    "required": [ "firstName", "lastName" ],
    "additionalProperties": false
};

describe( 'RestJsonSchemaValidator', function() {

    describe( 'validate', function() {

        it( 'should raise error when additional properties', function( done ) {

            var resource = {
                firstName: 'Bob',
                lastName: 'Sagget',
                sex: 'M'
            };

            var err = validator.validate( 'person', resource, schema );
            expect( err ).toBeA( ValidationError );
            expect( err.name ).toBe( 'additionalProperties' );
            expect( err.property ).toBe( 'person' );
            expect( err.argument ).toBe( 'sex' );
            expect( err.message ).toBe( 'additionalProperty "sex" exists in instance when not allowed' );
            done();
        } );
    } );

    describe( 'validatePatch', function() {

        it( 'should raise error when additional properties', function( done ) {

            var patch = {
                sex: 'M'
            };

            var err = validator.validatePatch( 'person', patch, schema );
            expect( err ).toBeA( ValidationError );
            expect( err.name ).toBe( 'additionalProperties' );
            expect( err.property ).toBe( 'person' );
            expect( err.argument ).toBe( 'sex' );
            expect( err.message ).toBe( 'additionalProperty "sex" exists in instance when not allowed' );
            done();
        } );
    } );
} );
