import { Extension } from '@nejs/extension'
import { Enumeration } from '@nejs/enumeration'

/**
 * A {@link Extension} instance wrapping the capable {@link Enumeration}
 * class allowing for reuse and shipping the code through this repository.
 *
 * @type {Extension}
 */
export const EnumerationExtension = new Extension(Enumeration)

/**
 * Provide a named export for {@link Enumeration}.
 */
export { Enumeration }

/**
 * Make the default export be the {@link Enumeration} class.
 */
export default Enumeration
