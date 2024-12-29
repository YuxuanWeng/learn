import { AppEnv } from '@fepkg/common/types';
import LoginCollaborativeQuoteSvg from '@/assets/image/login-collaborative-quote.svg';
import LoginPriceTrackerSvg from '@/assets/image/login-price-tracker.svg';
import LoginServiceSvg from '@/assets/image/login-service.svg';
import LoginTradingAssistantSvg from '@/assets/image/login-trading-assistant.svg';
import { LoginCarouselItem } from './types';

export const envs: { label: string; value: AppEnv }[] = [
  { value: 'dev', label: 'OMS_Cloud_DEV' },
  { value: 'test', label: 'OMS_Cloud_TEST' }
];

export const PingUrlMap = {
  dev: `${import.meta.env.VITE_DEV_API_HOST.split('//')[1]}:443`,
  test: `${import.meta.env.VITE_TEST_API_HOST.split('//')[1]}:443`,
  prod: `${window.appConfig?.apiHost?.split('//')[1]}:443`
};

export const carousels: LoginCarouselItem[] = [
  {
    title: '更易用的行情看板',
    content: ['多维筛选灵活配置，独立窗口快速布局', '团队一键快速分享，重点行情一览无遗'],
    src: LoginServiceSvg
  },
  {
    title: '高效的iQuote',
    content: ['智能识别聊天记录，高效处理客户指令', '操作结果一键反馈，助力抓住每笔交易'],
    src: LoginTradingAssistantSvg
  },
  {
    title: '更敏捷的行情追踪',
    content: ['集成业务价值规则，实时监测行情变动', '灵活配置贴合场景，第一时间锁定成交'],
    src: LoginPriceTrackerSvg
  },
  {
    title: '更智能的协同报价',
    content: ['多源报价协同处理，实时修改随时感知', '批量识别一站处理，专为DI提效的工作模式'],
    src: LoginCollaborativeQuoteSvg
  }
];

export const PasswordPlaceholder = '**********';
