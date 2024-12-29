import { crashReporter } from 'electron';
import { omsApp } from '../models/oms-application';

export function initCrashReporter() {
  crashReporter.start({
    productName: `OMS-${omsApp.appConfig.shortHash}`,
    uploadToServer: false,
    submitURL:
      'https://o4503973927190528.ingest.sentry.io/api/4505922989522944/minidump/?sentry_key=fef184d00081f36f33af2997fb07f7dd'
  });
}
