import { useRef } from 'react';
import { createContainer } from 'unstated-next';

const TextAreaHighlightContainer = createContainer(() => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const highlightLineByRow = (lineIndex: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const lines = textarea.value.split('\n');

    if (lineIndex < lines.length && lineIndex >= 0) {
      const start = lines.slice(0, lineIndex).reduce((acc, line) => acc + line.length + 1, 0);
      const end = start + lines[lineIndex].length;

      textarea.scrollTop = lineIndex * parseFloat(window.getComputedStyle(textarea).lineHeight);
      textarea.setSelectionRange(start, end);
      textarea.focus();
    }
  };

  const focus = () => {
    textareaRef.current?.focus();
  };

  return {
    textareaRef,
    highlightLineByRow,
    focus
  };
});

export const TextAreaHighlightProvider = TextAreaHighlightContainer.Provider;
export const useTextAreaHighlight = TextAreaHighlightContainer.useContainer;
