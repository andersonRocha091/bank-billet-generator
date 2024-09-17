import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { TraceExporter } from '@google-cloud/opentelemetry-cloud-trace-exporter';


interface OpenTelemetryConfig {
    url: string;
}


const createOpenTelemetryConfig = (): OpenTelemetryConfig => {
    return {
        url: process.env.OTLP_EXPORTER_OTLP_TRACES_ENDPOINT ?? ''
    }
}

const createNodeSDK = (config?: OpenTelemetryConfig): NodeSDK => {
    return new NodeSDK({
        traceExporter: new TraceExporter({
           projectId: 'bank-billet-generator', 
        }),
        instrumentations: [getNodeAutoInstrumentations()]
    })
}

const startOpenTelemetrySDK = async (sdk: NodeSDK): Promise<void> => {

    try {
        await sdk.start();
    } catch (error) {
        console.error('Error starting OpenTelemetry SDK:', error);
    }
}

const openTelemetryConfig = createOpenTelemetryConfig();
const nodeSDK = createNodeSDK(openTelemetryConfig);
startOpenTelemetrySDK(nodeSDK);