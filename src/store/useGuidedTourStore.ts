import { create } from 'zustand';
import type {
  GuidedTour,
  GuidedTourEvent,
  GuidedTourStatus,
  GuidedTourStep,
  GuidedTourStepType,
} from '../types/guidedTour.types';

const STORAGE_KEY = 'guided-tour-progress:v2';

type GuidedTourFeedback = {
  kind: 'step-complete' | 'discovery-unlocked' | 'wrong-target';
  id: number;
};

type StoredProgress = {
  tourId: string | null;
  sceneId: string | null;
  status: GuidedTourStatus;
  currentStepIndex: number;
  completedStepIds: string[];
};

type GuidedTourState = StoredProgress & {
  tour: GuidedTour | null;
  isIntroOpen: boolean;
  isCompletionOpen: boolean;
  isJournalOpen: boolean;
  completionPending: boolean;
  cinematicProgress: number;
  cinematicSkipRequested: boolean;
  feedback: GuidedTourFeedback | null;
};

type GuidedTourActions = {
  attachTour: (tour: GuidedTour, openIntro: boolean) => void;
  detachTour: () => void;
  openIntro: () => void;
  beginTour: (restart?: boolean) => void;
  completeCinematic: () => void;
  requestCinematicSkip: () => void;
  setCinematicProgress: (progress: number) => void;
  exploreFreely: () => void;
  pauseTour: () => void;
  resumeTour: () => void;
  exitTour: () => void;
  reportEvent: (event: GuidedTourEvent) => void;
  showPendingCompletion: () => void;
  closeCompletion: () => void;
  openJournal: () => void;
  closeJournal: () => void;
  clearFeedback: () => void;
};

const emptyProgress: StoredProgress = {
  tourId: null,
  sceneId: null,
  status: 'idle',
  currentStepIndex: 0,
  completedStepIds: [],
};

function readStoredProgress(): StoredProgress {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) return emptyProgress;

    const stored = JSON.parse(value) as Partial<StoredProgress>;
    return {
      tourId: typeof stored.tourId === 'string' ? stored.tourId : null,
      sceneId: typeof stored.sceneId === 'string' ? stored.sceneId : null,
      status: ['idle', 'active', 'paused', 'completed'].includes(stored.status ?? '')
        ? (stored.status as GuidedTourStatus)
        : 'idle',
      currentStepIndex: Number.isInteger(stored.currentStepIndex) ? Math.max(0, stored.currentStepIndex ?? 0) : 0,
      completedStepIds: Array.isArray(stored.completedStepIds)
        ? stored.completedStepIds.filter((id): id is string => typeof id === 'string')
        : [],
    };
  } catch {
    return emptyProgress;
  }
}

const eventTypeByStepType: Record<GuidedTourStepType, GuidedTourEvent['type']> = {
  teleport: 'teleport_selected',
  reach_scene_point: 'scene_area_reached',
  inspect_scene_point: 'scene_point_opened',
  inspect_artifact: 'artifact_opened',
  view_artifact_annotation: 'artifact_annotation_opened',
};

function eventMatchesStep(event: GuidedTourEvent, step: GuidedTourStep) {
  if (event.type !== eventTypeByStepType[step.type] || event.targetId !== step.targetId) return false;
  if (step.type !== 'view_artifact_annotation') return true;

  return event.type === 'artifact_annotation_opened' && event.artifactId === step.artifactId;
}

export const useGuidedTourStore = create<GuidedTourState & GuidedTourActions>((set, get) => ({
  ...readStoredProgress(),
  tour: null,
  isIntroOpen: false,
  isCompletionOpen: false,
  isJournalOpen: false,
  completionPending: false,
  cinematicProgress: 0,
  cinematicSkipRequested: false,
  feedback: null,

  attachTour: (tour, openIntro) =>
    set((state) => {
      if (state.tour?.tourId === tour.tourId) return state;

      const isStoredTour = state.tourId === tour.tourId && state.sceneId === tour.sceneId;
      if (!isStoredTour) {
        return {
          ...emptyProgress,
          tour,
          tourId: tour.tourId,
          sceneId: tour.sceneId,
          isIntroOpen: openIntro,
          isCompletionOpen: false,
          isJournalOpen: false,
          completionPending: false,
          cinematicProgress: 0,
          cinematicSkipRequested: false,
          feedback: null,
        };
      }

      const hasUnfinishedProgress = state.status === 'active' || state.status === 'paused';
      return {
        tour,
        status: hasUnfinishedProgress ? 'paused' : state.status,
        currentStepIndex: Math.min(state.currentStepIndex, Math.max(0, tour.steps.length - 1)),
        isIntroOpen: openIntro && state.status !== 'completed',
        isCompletionOpen: false,
        isJournalOpen: false,
        completionPending: false,
        cinematicProgress: 0,
        cinematicSkipRequested: false,
        feedback: null,
      };
    }),

  detachTour: () =>
    set({
      tour: null,
      isIntroOpen: false,
      isCompletionOpen: false,
      isJournalOpen: false,
      completionPending: false,
      cinematicProgress: 0,
      cinematicSkipRequested: false,
      feedback: null,
    }),

  openIntro: () => set((state) => (state.tour ? { isIntroOpen: true } : state)),

  beginTour: (restart = false) =>
    set((state) => {
      const playCinematic = Boolean(state.tour?.intro);
      return {
        status: playCinematic ? 'cinematic' : 'active',
        currentStepIndex: restart ? 0 : state.currentStepIndex,
        completedStepIds: restart ? [] : state.completedStepIds,
        isIntroOpen: false,
        isCompletionOpen: false,
        isJournalOpen: false,
        completionPending: false,
        cinematicProgress: 0,
        cinematicSkipRequested: false,
        feedback: null,
      };
    }),

  completeCinematic: () =>
    set((state) =>
      state.status === 'cinematic' ? { status: 'active', cinematicProgress: 1, cinematicSkipRequested: false } : state,
    ),

  requestCinematicSkip: () => set((state) => (state.status === 'cinematic' ? { cinematicSkipRequested: true } : state)),

  setCinematicProgress: (progress) =>
    set((state) => (state.status === 'cinematic' ? { cinematicProgress: Math.min(1, Math.max(0, progress)) } : state)),

  exploreFreely: () =>
    set((state) => ({
      status: state.status === 'completed' ? 'completed' : 'idle',
      isIntroOpen: false,
      isJournalOpen: false,
      feedback: null,
    })),

  pauseTour: () => set({ status: 'paused', feedback: null }),
  resumeTour: () => set({ status: 'active', isIntroOpen: false, feedback: null }),

  exitTour: () =>
    set({
      status: 'idle',
      currentStepIndex: 0,
      completedStepIds: [],
      isIntroOpen: false,
      isJournalOpen: false,
      completionPending: false,
      cinematicProgress: 0,
      cinematicSkipRequested: false,
      feedback: null,
    }),

  reportEvent: (event) => {
    const state = get();
    const step = state.tour?.steps[state.currentStepIndex];
    if (state.status !== 'active' || !state.tour || !step) return;

    const feedbackId = Date.now();
    if (!eventMatchesStep(event, step)) {
      set({ feedback: { kind: 'wrong-target', id: feedbackId } });
      return;
    }

    const completedStepIds = state.completedStepIds.includes(step.stepId)
      ? state.completedStepIds
      : [...state.completedStepIds, step.stepId];
    const isLastStep = state.currentStepIndex >= state.tour.steps.length - 1;

    set({
      completedStepIds,
      currentStepIndex: isLastStep ? state.currentStepIndex : state.currentStepIndex + 1,
      status: isLastStep ? 'completed' : 'active',
      completionPending: isLastStep,
      feedback: { kind: step.discovery ? 'discovery-unlocked' : 'step-complete', id: feedbackId },
    });
  },

  showPendingCompletion: () =>
    set((state) =>
      state.status === 'completed' && state.completionPending ? { isCompletionOpen: true, completionPending: false } : state,
    ),

  closeCompletion: () => set({ isCompletionOpen: false }),
  openJournal: () => set({ isJournalOpen: true }),
  closeJournal: () => set({ isJournalOpen: false }),
  clearFeedback: () => set({ feedback: null }),
}));

useGuidedTourStore.subscribe((state) => {
  if (!state.tourId || !state.sceneId) return;

  const progress: StoredProgress = {
    tourId: state.tourId,
    sceneId: state.sceneId,
    status: state.status === 'cinematic' ? 'idle' : state.status,
    currentStepIndex: state.currentStepIndex,
    completedStepIds: state.completedStepIds,
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // The tour remains usable for the current visit when storage is unavailable.
  }
});
