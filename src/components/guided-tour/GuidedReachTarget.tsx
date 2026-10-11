import { useContext, useEffect, useRef } from 'react';
import { useGuidedTourStore } from '../../store/useGuidedTourStore';
import { SceneInteractionContext } from '../interactions/sceneInteractionContext';

type GuidedReachTargetProps = {
  targetId: string;
};

export function GuidedReachTarget({ targetId }: GuidedReachTargetProps) {
  const interactionContext = useContext(SceneInteractionContext);
  const reportedRef = useRef(false);

  useEffect(() => {
    reportedRef.current = false;
  }, [targetId]);

  useEffect(() => {
    if (reportedRef.current || interactionContext?.focusedId !== targetId) return;

    const state = useGuidedTourStore.getState();
    const currentStep = state.tour?.steps[state.currentStepIndex];
    if (state.status !== 'active' || currentStep?.type !== 'reach_scene_point' || currentStep.targetId !== targetId) return;

    reportedRef.current = true;
    state.reportEvent({ type: 'scene_area_reached', targetId });
  }, [interactionContext?.focusedId, targetId]);

  return null;
}
