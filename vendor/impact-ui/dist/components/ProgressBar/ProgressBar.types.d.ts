import { RootComponentProps } from '../../types';
import { LinearProgressProps } from '@mui/material/LinearProgress';

export type ProgressBarStatus = 'remaining' | 'completed' | 'failed';
export interface ProgressBarProps extends RootComponentProps {
    value?: number;
    showTime?: boolean;
    time?: number;
    customLabel?: string;
    status?: ProgressBarStatus;
    /** Pass-through to MUI LinearProgress */
    LinearProgressProps?: Partial<LinearProgressProps>;
}
//# sourceMappingURL=ProgressBar.types.d.ts.map