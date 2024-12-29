import { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FlowLoggerProvider } from '@/common/providers/FlowLoggerProvider';
import { UploadProvider } from '@/pages/Quote/Collaborative/providers/UploadProvider';
import { Panel } from './Panel';
import { ChatScriptProvider } from './providers/ChatScriptProvider';
import { HeadProvider } from './providers/HeadProvider';
import { IMConnectionProvider } from './providers/IMConnectionProvider';
import { LocalTimerProvider } from './providers/LocalTimerProvider';
import { RoomCardsProvider } from './providers/RoomCardsProvider';
import { TraderConfigProvider } from './providers/TraderConfigContainer';
import { TraderFuzzySearchProvider } from './providers/TraderFuzzySearchProvider';

const LOGGER_TRACE_FIELD = 'chat-quickly-trace-id';
const LOGGER_FLOW_NAME = 'chat-quickly';

const IQuote = () => {
  const traceId = useRef(uuidv4());
  const loggerInitState = { traceId: traceId.current, traceField: LOGGER_TRACE_FIELD, flowName: LOGGER_FLOW_NAME };

  return (
    <UploadProvider>
      <LocalTimerProvider>
        <FlowLoggerProvider initialState={loggerInitState}>
          <IMConnectionProvider>
            <RoomCardsProvider>
              <ChatScriptProvider>
                <HeadProvider>
                  <TraderFuzzySearchProvider>
                    <TraderConfigProvider>
                      <Panel />
                    </TraderConfigProvider>
                  </TraderFuzzySearchProvider>
                </HeadProvider>
              </ChatScriptProvider>
            </RoomCardsProvider>
          </IMConnectionProvider>
        </FlowLoggerProvider>
      </LocalTimerProvider>
    </UploadProvider>
  );
};

export default IQuote;
