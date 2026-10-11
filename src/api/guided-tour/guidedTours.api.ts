import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type {
  GuidedTour,
  GuidedTourDiscovery,
  GuidedTourIntro,
  GuidedTourStep,
  GuidedTourStepType,
} from '../../types/guidedTour.types';

const supportedStepTypes = new Set<GuidedTourStepType>([
  'teleport',
  'reach_scene_point',
  'inspect_scene_point',
  'inspect_artifact',
  'view_artifact_annotation',
]);

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isVector3(value: unknown): value is number[] {
  return Array.isArray(value) && value.length >= 3 && value.slice(0, 3).every((coordinate) => Number.isFinite(coordinate));
}

function parseDiscovery(value: unknown): GuidedTourDiscovery | undefined {
  if (!value || typeof value !== 'object') return undefined;

  const discovery = value as Record<string, unknown>;
  if (!isNonEmptyString(discovery.discoveryId) || !isNonEmptyString(discovery.title) || !isNonEmptyString(discovery.summary)) {
    return undefined;
  }

  return {
    discoveryId: discovery.discoveryId,
    title: discovery.title,
    summary: discovery.summary,
    images: Array.isArray(discovery.images)
      ? discovery.images.filter((image): image is string => isNonEmptyString(image))
      : undefined,
  };
}

function parseIntro(value: unknown, tourId: string): GuidedTourIntro | undefined {
  if (!value || typeof value !== 'object') return undefined;

  const intro = value as Record<string, unknown>;
  const valid =
    intro.type === 'orbit' &&
    isVector3(intro.orbitCenter) &&
    isVector3(intro.lookAt) &&
    Number.isFinite(intro.radius) &&
    Number(intro.radius) > 0 &&
    Number.isFinite(intro.height) &&
    Number.isFinite(intro.startAngle) &&
    Number.isFinite(intro.endAngle) &&
    Number.isFinite(intro.duration) &&
    Number(intro.duration) > 0 &&
    isNonEmptyString(intro.title);

  if (!valid) {
    console.error(`[GuidedTour] Ignored invalid cinematic intro in tour ${tourId}.`, intro);
    return undefined;
  }

  return {
    type: 'orbit',
    orbitCenter: intro.orbitCenter as number[],
    lookAt: intro.lookAt as number[],
    radius: Number(intro.radius),
    height: Number(intro.height),
    startAngle: Number(intro.startAngle),
    endAngle: Number(intro.endAngle),
    duration: Number(intro.duration),
    rotationSpeed:
      Number.isFinite(intro.rotationSpeed) && Number(intro.rotationSpeed) > 0 ? Number(intro.rotationSpeed) : undefined,
    title: intro.title as string,
    caption: isNonEmptyString(intro.caption) ? intro.caption : undefined,
    audioUrl: isNonEmptyString(intro.audioUrl) ? intro.audioUrl : null,
    skippable: typeof intro.skippable === 'boolean' ? intro.skippable : true,
  };
}

function parseStep(value: unknown, tourId: string): GuidedTourStep | null {
  if (!value || typeof value !== 'object') return null;

  const step = value as Record<string, unknown>;
  const type = step.type as GuidedTourStepType;
  const valid =
    isNonEmptyString(step.stepId) &&
    Number.isFinite(step.order) &&
    supportedStepTypes.has(type) &&
    isNonEmptyString(step.targetId) &&
    isNonEmptyString(step.instruction) &&
    isNonEmptyString(step.hint) &&
    (type !== 'view_artifact_annotation' || isNonEmptyString(step.artifactId));

  if (!valid) {
    console.error(`[GuidedTour] Ignored an invalid step in tour ${tourId}.`, step);
    return null;
  }

  return {
    stepId: step.stepId as string,
    order: Number(step.order),
    type,
    targetId: step.targetId as string,
    instruction: step.instruction as string,
    hint: step.hint as string,
    artifactId: isNonEmptyString(step.artifactId) ? step.artifactId : undefined,
    radius: Number.isFinite(step.radius) && Number(step.radius) > 0 ? Number(step.radius) : undefined,
    discovery: parseDiscovery(step.discovery),
  };
}

export const getGuidedToursByScene = async (sceneId: string): Promise<GuidedTour[]> => {
  const toursRef = collection(db, 'guided_tours');
  const snapshot = await getDocs(query(toursRef, where('sceneId', '==', sceneId)));

  return snapshot.docs.flatMap((tourDocument) => {
    const data = tourDocument.data();
    if (!isNonEmptyString(data.sceneId) || !isNonEmptyString(data.title) || !isNonEmptyString(data.description)) {
      console.error(`[GuidedTour] Ignored invalid tour document ${tourDocument.id}.`);
      return [];
    }

    const steps = Array.isArray(data.steps)
      ? data.steps
          .map((step) => parseStep(step, tourDocument.id))
          .filter((step): step is GuidedTourStep => step !== null)
          .sort((firstStep, secondStep) => firstStep.order - secondStep.order)
      : [];

    if (!steps.length) {
      console.error(`[GuidedTour] Ignored tour ${tourDocument.id} because it has no valid steps.`);
      return [];
    }

    return [
      {
        tourId: tourDocument.id,
        sceneId: data.sceneId,
        title: data.title,
        description: data.description,
        intro: parseIntro(data.intro, tourDocument.id),
        steps,
      },
    ];
  });
};
