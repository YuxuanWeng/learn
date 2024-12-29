import { render } from '@testing-library/react';
import { Shortcut1 } from './1.stories';

it('Checks by storybook', async () => {
  const { container } = render(<Shortcut1 />);
  await Shortcut1.play({ canvasElement: container });
});
