import { ConnectorType } from '@prisma/generator-helper';

export type SupportedConnector = Exclude<ConnectorType, 'mongodb'>;
