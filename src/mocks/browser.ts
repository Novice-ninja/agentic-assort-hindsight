import { setupWorker } from 'msw/browser';
import { testHandlers } from './handlers';
import { pdfDemoHandlers } from './handlers/pdf';
import { localOnlyHandlers } from './localOnlyHandlers';
import { localClusteringHandlers } from './handlers/localClustering';

// The deployed preview uses the flooring demo handlers before its shared mock layer.
// In this standalone reconstruction every service must be local, including routes
// the deployed build deliberately leaves to its live backend. Preserve the flooring
// responses first, then use the recovered deterministic stand-ins for other modules.
export const worker = setupWorker(...pdfDemoHandlers, ...localClusteringHandlers, ...testHandlers, ...localOnlyHandlers);
