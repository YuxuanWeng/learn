import { useState } from 'react';
import { flatten } from 'lodash-es';
import { useIssuerInstConfigQuery } from '@/common/services/hooks/useIssuerInstQuery';
import { NCDFiltersParsingCallBack } from '@/components/BondFilter/NCDFiltersParsing/types';
import { getRecognizeResult } from '@/components/BondFilter/NCDFiltersParsing/utils';

export const useNCDFiltersParsing = (onChange?: NCDFiltersParsingCallBack) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const parsingDisabled = !text.replaceAll('\n', '').trim();

  const { data } = useIssuerInstConfigQuery();

  const values = new Set(flatten(data?.nodes?.map(v => v.children?.map(cli => cli.value))));

  const handleReset = () => {
    setLoading(false);
    setText('');
  };

  const handleParsing = async () => {
    if (loading || parsingDisabled) return;

    setLoading(true);

    getRecognizeResult(text)
      .then(({ generalFilterValue, bondIssueInfoFilterValue, inputFilter }) => {
        if (bondIssueInfoFilterValue?.issuer_id_list?.length) {
          /** 过滤掉识别出来非银行数据 */
          const instIds = bondIssueInfoFilterValue.issuer_id_list.filter(v => values.has(v));
          bondIssueInfoFilterValue.issuer_id_list = instIds;
        }

        onChange?.(generalFilterValue, bondIssueInfoFilterValue, inputFilter);
        handleReset();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return {
    text,
    setText,
    loading,
    parsingDisabled,
    handleReset,
    handleParsing
  };
};
