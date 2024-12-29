import { useNextWeeklyWeekday } from '@fepkg/business/hooks/useNextWeeklyWeekday';
import { ModalUtils } from '@fepkg/components/Modal';
import { NCDPOperationType } from '@fepkg/services/types/bds-enum';
import { useEnterDown } from '@/common/hooks/useEnterDown';
import { mulCreateNCDP } from '@/common/services/api/bond-quote/ncdp-mul-create';
import { mulUpdateNCDP } from '@/common/services/api/bond-quote/ncdp-update';
import { useNCDPBatchForm } from '../providers/FormProvider';
import { NCDPBatchFormListItem } from '../types';
import { transform2NCDPInfoLite, transform2NCDPInfoLiteUpdate } from '../utils';
import { checkList, toastRequestError } from '../utils/check';

export const useSubmit = (afterSubmit?: () => void) => {
  const { isEdit, isBatch, defaultIssuerDateType, formList, setFormLoading } = useNCDPBatchForm();
  const [weeklyWeekdayMap] = useNextWeeklyWeekday();

  const create = (list?: NCDPBatchFormListItem[]) => {
    const transforms = list?.map(item => transform2NCDPInfoLite(item, defaultIssuerDateType, weeklyWeekdayMap));
    return mulCreateNCDP(transforms);
  };

  const update = (list?: NCDPBatchFormListItem[]) => {
    const transforms = list?.map(item =>
      transform2NCDPInfoLiteUpdate(item, defaultIssuerDateType, weeklyWeekdayMap, item?.original)
    );
    return mulUpdateNCDP(transforms, NCDPOperationType.NcdPModify);
  };

  const submit = async (list?: NCDPBatchFormListItem[]) => {
    ModalUtils.destroyAll();

    try {
      let action: typeof update | typeof create;

      if (isEdit) action = update;
      else action = create;

      const { err_list = [] } = await action(list);

      if (err_list.length) {
        toastRequestError(err_list, isBatch);
        return;
      }

      afterSubmit?.();
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmit = async () => {
    const { valid, filtered, limitList } = checkList(formList, isBatch);

    if (!valid || !filtered.length) return;

    if (limitList?.length) {
      ModalUtils.warning({
        title: '确定提交？',
        content: `${isBatch ? `第${limitList.map(i => i.line)}行，` : ''}价格超出限制，确定报价吗？`,
        onOk: () => submit(filtered)
      });
    } else {
      submit(filtered);
    }
  };

  useEnterDown(handleSubmit);

  return { handleSubmit };
};
