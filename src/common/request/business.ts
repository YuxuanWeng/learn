import { message } from '@fepkg/components/Message';
import { RequestResponse, StatusCode } from '@fepkg/request/types';
import { QuoteRelatedInfoFailedType } from '@fepkg/services/types/enum';
import { AxiosResponse } from 'axios';

const generateBatchOperationFailMessage = (errorCode: number, failList: number[]) => {
  let failMessage = '';
  if (errorCode === StatusCode.Success) {
    failMessage += '部分报价因';
  } else {
    failMessage += '报价因';
  }
  if (failList.includes(QuoteRelatedInfoFailedType.FailedTypeTraderOrInst)) {
    failMessage += '交易员或机构';
  } else if (failList.includes(QuoteRelatedInfoFailedType.FailedTypeBroker)) {
    failMessage += '经纪人';
  }
  return `${failMessage}失效而操作失败`;
};

export const hasFailedTypeList = (response: AxiosResponse<RequestResponse>) => {
  // 对应一类失败的情况，批量操作(新增、编辑、refer、unrefer)时可能存在全失败和部分失败，此时需要给出特定的toast提示。
  if ('failed_type_list' in response.data) {
    const failList = response.data.failed_type_list as number[];
    if (failList.length) {
      const failMessage = generateBatchOperationFailMessage(response.data.base_response?.code ?? -1, failList);
      message?.error(failMessage);
      return true;
    }
  }
  return false;
};
