import { ReactNode } from 'react';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from '../ui/tooltip';

const Tooltip = ({
  children,
  content,
}: {
  children: ReactNode;
  content: string;
}) => {
  return (
    <UITooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </UITooltip>
  );
};

export default Tooltip;
