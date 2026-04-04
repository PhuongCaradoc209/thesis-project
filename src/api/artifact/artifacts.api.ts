import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { Artifact } from '../../types/scene.types';

export const getArtifactById = async (artifactId: string): Promise<Artifact | null> => {
  const docRef = doc(db, 'artifacts', artifactId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;

  return { artifactId: snapshot.id, ...snapshot.data() } as Artifact;
};
