"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSchemaSync = exports.buildSchema = void 0;
const path_1 = __importDefault(require("path"));
const schema_generator_1 = require("../schema/schema-generator");
const loadResolversFromGlob_1 = require("../helpers/loadResolversFromGlob");
const emitSchemaDefinitionFile_1 = require("./emitSchemaDefinitionFile");
async function buildSchema(options) {
    const resolvers = loadResolvers(options);
    const schema = await schema_generator_1.SchemaGenerator.generateFromMetadata(Object.assign(Object.assign({}, options), { resolvers }));
    if (options.emitSchemaFile) {
        const { schemaFileName, printSchemaOptions } = getEmitSchemaDefinitionFileOptions(options);
        await (0, emitSchemaDefinitionFile_1.emitSchemaDefinitionFile)(schemaFileName, schema, printSchemaOptions);
    }
    return schema;
}
exports.buildSchema = buildSchema;
function buildSchemaSync(options) {
    const resolvers = loadResolvers(options);
    const schema = schema_generator_1.SchemaGenerator.generateFromMetadataSync(Object.assign(Object.assign({}, options), { resolvers }));
    if (options.emitSchemaFile) {
        const { schemaFileName, printSchemaOptions } = getEmitSchemaDefinitionFileOptions(options);
        (0, emitSchemaDefinitionFile_1.emitSchemaDefinitionFileSync)(schemaFileName, schema, printSchemaOptions);
    }
    return schema;
}
exports.buildSchemaSync = buildSchemaSync;
function loadResolvers(options) {
    if (options.resolvers.length === 0) {
        throw new Error('Empty `resolvers` array property found in `buildSchema` options!');
    }
    if (options.resolvers.some((resolver) => typeof resolver === 'string')) {
        options.resolvers.forEach((resolver) => {
            if (typeof resolver === 'string') {
                (0, loadResolversFromGlob_1.loadResolversFromGlob)(resolver);
            }
        });
        return undefined;
    }
    return options.resolvers;
}
function getEmitSchemaDefinitionFileOptions(buildSchemaOptions) {
    const defaultSchemaFilePath = path_1.default.resolve(process.cwd(), 'schema.gql');
    return {
        schemaFileName: typeof buildSchemaOptions.emitSchemaFile === 'string'
            ? buildSchemaOptions.emitSchemaFile
            : typeof buildSchemaOptions.emitSchemaFile === 'object'
                ? buildSchemaOptions.emitSchemaFile.path || defaultSchemaFilePath
                : defaultSchemaFilePath,
        printSchemaOptions: typeof buildSchemaOptions.emitSchemaFile === 'object'
            ? Object.assign(Object.assign({}, emitSchemaDefinitionFile_1.defaultPrintSchemaOptions), buildSchemaOptions.emitSchemaFile) : emitSchemaDefinitionFile_1.defaultPrintSchemaOptions,
    };
}
//# sourceMappingURL=buildSchema.js.map