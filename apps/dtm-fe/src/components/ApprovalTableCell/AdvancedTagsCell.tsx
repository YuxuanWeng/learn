import { Tooltip } from '@fepkg/components/Tooltip';

type AdvancedTagsCellProp = {
  advancedApprovalTags?: { label: string; content: string[] }[];
};

export const AdvancedTagsCell = ({ advancedApprovalTags }: AdvancedTagsCellProp) => {
  if (!advancedApprovalTags?.length) return null;
  return advancedApprovalTags.map(({ label, content }, index) => {
    const tip = (
      <div className="flex items-center">
        {content.at(0)}
        {content.at(1) ? (
          <>
            <span className="w-px mx-1 h-2.5 bg-gray-300" />
            {content.at(1)}
          </>
        ) : null}
      </div>
    );
    return (
      <Tooltip
        key={`${label}-${index}`}
        content={tip}
      >
        <span className="px-3 h-6 leading-6 bg-gray-600 rounded font-normal text-gray-000">{label}</span>
      </Tooltip>
    );
  });
};
