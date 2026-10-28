import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@app/store/hooks';
import { Button } from '@shared/components/vendor/impact-ui';
import { ROUTES } from '@config/routes';
import { resetWizard } from '../store/clusteringSlice';
import {
  CreatePlanMethodPopover,
  type CreatePlanMethod,
} from './CreatePlanMethodPopover';

export interface CreateClusterPlanButtonProps {
  canWrite: boolean;
}

/**
 * "Create Cluster Plan": opens the method popover.
 * "Set It Up" → Proceed enters the manual wizard (fresh draft, same route as before).
 * "Describe Your Plan" → Proceed opens the agentic create screen.
 */
export function CreateClusterPlanButton({ canWrite }: CreateClusterPlanButtonProps) {
  const { t } = useTranslation('clustering');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  // Proceed can be clicked again before the route change unmounts us; navigate only once.
  const proceedingRef = useRef(false);

  const close = useCallback(() => setAnchorEl(null), []);

  const proceed = useCallback(
    (method: CreatePlanMethod) => {
      if (proceedingRef.current) return;
      proceedingRef.current = true;
      setAnchorEl(null);
      if (method === 'setup') {
        dispatch(resetWizard());
        navigate(ROUTES.createClusterPlan);
        return;
      }
      navigate(ROUTES.describeClusterPlan);
    },
    [dispatch, navigate],
  );

  if (!canWrite) return null;

  return (
    <>
      <Button
        variant="primary"
        size="large"
        aria-haspopup="dialog"
        aria-expanded={anchorEl !== null}
        onClick={(event) => {
          proceedingRef.current = false;
          setAnchorEl(event.currentTarget);
        }}
      >
        {t('dashboard.create')}
      </Button>
      <CreatePlanMethodPopover
        open={anchorEl !== null}
        anchorEl={anchorEl}
        onClose={close}
        onProceed={proceed}
      />
    </>
  );
}
