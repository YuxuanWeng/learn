import { render } from '@testing-library/react';
import { Stepper1 } from './1.stories';

it('Checks by storybook', async () => {
  const { container } = render(<Stepper1 />);
  await Stepper1.play({ canvasElement: container });
});
