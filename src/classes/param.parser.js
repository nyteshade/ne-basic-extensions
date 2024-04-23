import { Extension } from '@nejs/extension'

export class ParamParser {
  /**
   * Constructs an instance of ParamParser. It takes in parameters, an optional
   * validator function, and an optional parser function. The parameters are
   * validated and if successful, parsed.
   *
   * @param {any[]} parameters - Arguments passed in by the process.
   * @param {((any[]) => boolean)?} [validator=() => {}] - An optional function
   * to specify a validator without subclassing ParamParser. It should return
   * a boolean indicating the validity of the parameters.
   * @param {((any[]) => object)?} [parser=() => {}] - An optional function to
   * specify a parser without subclassing ParamParser. It should return an
   * object after parsing the input parameters.
   *
   * @example
   * const parameters = ['param1', 'param2']
   * const validator = params => params.every(param => typeof param === 'string')
   * const parser = params => ({ params })
   * const paramParser = new ParamParser(parameters, validator, parser)
   * if (paramParser.success) {
   *   console.log('Parsing successful:', paramParser.results)
   * } else {
   *   console.error('Parsing failed.')
   * }
   */
  constructor(parameters, validator = () => {}, parser = () => {}) {
    this.args = parameters
    this.parser = parser
    this.validator = validator
    this.result = undefined
    this.success = this.validate(this.args)

    if (this.success) {
      this.results = this.parse(this.args)
    }
  }

  /**
   * @param {object} args arguments that were previously validated
   * by either the overloaded validate() method or the supplied
   * validator closure.
   * @returns {object} returns the output object, or an empty
   * object, after parsing the input arguments or parameters.
   */
  parse(args) {
    return this.parser?.(args);
  }

  /**
   * Walk the arguments and determine if the supplied input is
   * a valid parsing.
   *
   * @param {any[]} args arguments supplied by the process.
   * @returns {boolean} `true` if the validation is successful,
   * `false` otherwise.
   */
  validate(args) {
    return this.validator?.(args);
  }

  /**
   * Attempts to parse the given parameters using the provided parsers, throwing an
   * error if no valid parser is found. This method serves as a convenience wrapper
   * around `safeTryParsers`, enforcing strict parsing by automatically enabling
   * error throwing on failure.
   *
   * @param {any[]} parameters - The parameters to be parsed.
   * @param {Function[]} parsers - An array of `ParamParser` subclasses to attempt
   * parsing with.
   * @returns {Object} An object containing the parsing result, with a `success`
   * property indicating if parsing was successful, and a `data` property containing
   * the parsed data if successful.
   * @example
   * const parameters = ['param1', 'param2'];
   * const parsers = [Parser1, Parser2];
   * const result = ParamParser.tryParsers(parameters, parsers);
   * if (result.success) {
   *   console.log('Parsing successful:', result.data);
   * } else {
   *   console.error('Parsing failed.');
   * }
   */
  static tryParsers(parameters, parsers) {
    return this.safeTryParsers(parameters, parsers, true)
  }

  /**
   * Tries parsing `parameters` with each parser in `parsers`. If
   * `throwOnFail` is true, throws an error when validation fails or
   * no valid parser is found.
   *
   * This method attempts to parse the given parameters using the
   * provided list of parsers. It validates the input to ensure both
   * `parameters` and `parsers` are arrays and that `parsers`
   * contains at least one valid `ParamParser` subclass. If
   * `throwOnFail` is set to true, it will throw specific errors for
   * invalid inputs or when no parser succeeds. Otherwise, it returns
   * an object indicating the success status and the result of
   * parsing, if successful.
   *
   * @param {any[]} parameters - The parameters to be parsed.
   * @param {Function[]} parsers - An array of `ParamParser`
   * subclasses to attempt parsing with.
   * @param {boolean} [throwOnFail=false] - Whether to throw an
   * error on failure.
   * @returns {{success: boolean, data: any}} An object with a
   * `success` flag and `data` containing the parsing result, if
   * successful.
   * @throws {ParametersMustBeArrayError} If `parameters` or
   * `parsers` are not arrays when `throwOnFail` is true.
   * @throws {ParsersArrayMustContainParsersError} If `parsers`
   * does not contain at least one valid `ParamParser` subclass
   * when `throwOnFail` is true.
   * @throws {NoValidParsersFound} If no valid parser is found
   * and `throwOnFail` is true.
   * @example
   * const parameters = ['param1', 'param2'];
   * const parsers = [Parser1, Parser2];
   * const result = ParamParser.safeTryParsers(
   *   parameters, parsers, true
   * );
   *
   * if (result.success) {
   *   console.log('Parsing successful:', result.data);
   * } else {
   *   console.error('Parsing failed.');
   * }
   */
  static safeTryParsers(parameters, parsers, throwOnFail = false) {
    if (!Array.isArray(parameters) || !Array.isArray(parsers)) {
      if (throwOnFail) {
        throw new this.ParametersMustBeArrayError(
          `${this.name}.tryParsers must receive two arrays as args`
        );
      }
    }

    if (!parsers.some(parser => parser?.prototype instanceof ParamParser &&
                                typeof parser === 'function')) {
      if (throwOnFail) {
        throw new this.ParsersArrayMustContainParsersError(
          `${this.name}.tryParsers parsers argument must contain at least one ` +
          `ParamParser derived class`
        );
      }
    }

    let success = false;
    let result = undefined;

    for (let Parser of parsers) {
      const parser = new Parser(parameters);
      if (parser.success) {
        success = true;
        result = parser.result;
        break;
      }
    }

    if (!success && throwOnFail) {
      throw new this.NoValidParsersFound('No valid parsers found');
    }

    return { success, data: result };
  }

  /**
   * A custom error class that signifies no valid parsers were found
   * during the parsing process. This error is thrown when all
   * parsers fail to parse the given parameters and the `throwOnFail`
   * flag is set to true in the `safeTryParsers` method.
   *
   * @returns {Function} A class extending Error, representing a
   * specific error when no valid parsers are found.ound.
   *
   * @example
   * try {
   *   const result = ParamParser.safeTryParsers(
   *     parameters, parsers, true
   *   );
   * } catch (error) {
   *   if (error instanceof ParamParser.NoValidParsersFound) {
   *     console.error(
   *       'No valid parsers could process the parameters.'
   *     );
   *   }
   * }
   */
  static get NoValidParsersFound() {
    return class NoValidParsersFound extends Error { }
  }

  /**
   * Represents an error thrown when the parameters provided to a method
   * are not in an array format as expected. This class extends the
   * native JavaScript `Error` class, allowing for instances of this
   * error to be thrown and caught using standard error handling
   * mechanisms in JavaScript.
   *
   * This error is specifically used in scenarios where a method
   * expects its arguments to be provided as an array, and the
   * validation of those arguments fails because they were not
   * provided in an array format. It serves as a clear indicator
   * of the nature of the error to developers, enabling them to
   * quickly identify and rectify the issue in their code.
   *
   * @example
   * try {
   *   ParamParser.safeTryParsers(nonArrayParameters, parsers, true);
   * } catch (error) {
   *   if (error instanceof ParamParser.ParametersMustBeArrayError) {
   *     console.error('Parameters must be provided as an array.');
   *   }
   * }
   */
  static get ParametersMustBeArrayError() {
    return class ParametersMustBeArrayError extends Error { }
  }

  /**
   * A custom error class indicating that the parsers array does not
   * contain valid parser functions. This error is thrown when the
   * validation of parsers within `ParamParser.safeTryParsers` fails
   * to find any instance that is a subclass of `ParamParser`. It
   * extends the native JavaScript `Error` class, allowing it to be
   * thrown and caught using standard error handling mechanisms.
   *
   * This error serves as a clear indicator to developers that the
   * provided array of parsers does not meet the expected criteria,
   * specifically that it must contain at least one valid parser
   * that extends `ParamParser`. This ensures that the parsing
   * process can be executed with at least one valid parser function.
   *
   * @example
   * try {
   *   ParamParser.safeTryParsers(parameters, [], true);
   * } catch (error) {
   *   const { ParsersArrayMustContainParsersError } = ParamParser
   *   if (error instanceof ParsersArrayMustContainParsersError) {
   *     console.error(
   *       'The parsers array must contain at least one valid parser.'
   *     );
   *   }
   * }
   */
  static get ParsersArrayMustContainParsersError() {
    return class ParsersArrayMustContainParsersError extends Error { }
  }
}

export const ParamParserExtensions = new Extension(ParamParser);