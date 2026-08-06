import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

export const otelSDK = new NodeSDK({
  traceExporter:
    process.env.NODE_ENV === 'production'
      ? new OTLPTraceExporter({
          url:
            process.env.OTEL_EXPORTER_OTLP_ENDPOINT ||
            'http://localhost:4318/v1/traces',
        })
      : new ConsoleSpanExporter(),
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new PrismaInstrumentation(),
  ],
});

otelSDK.start();

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  otelSDK
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});
