import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

/**
 * AG Grid v33 and later ship no features by default: an unregistered feature is ignored at
 * runtime and only reported as a numbered console error, so row striping, cell classes and
 * column auto-sizing fail silently rather than breaking the build.
 *
 * Registering once here — alongside the shared theme every grid already imports — keeps that
 * from having to be remembered per grid.
 */
ModuleRegistry.registerModules([AllCommunityModule]);
