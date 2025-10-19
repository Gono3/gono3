import type { VseprDataItem } from '../types';

// This pre-defined array acts as a static and accurate question bank for the quiz.
// Data is aligned with the reference PDF provided.
export const VSEPR_QUESTIONS: VseprDataItem[] = [
  { totalElectronPairs: 2, lonePairs: 0, electronGeometry: 'Linear', molecularGeometry: 'Linear', bondAngles: '180°', polarity: 'nonpolar' },
  { totalElectronPairs: 3, lonePairs: 0, electronGeometry: 'Trigonal Planar', molecularGeometry: 'Trigonal Planar', bondAngles: '120°', polarity: 'nonpolar' },
  { totalElectronPairs: 3, lonePairs: 1, electronGeometry: 'Trigonal Planar', molecularGeometry: 'Bent', bondAngles: '<120°', polarity: 'polar' },
  { totalElectronPairs: 4, lonePairs: 0, electronGeometry: 'Tetrahedral', molecularGeometry: 'Tetrahedral', bondAngles: '109.5°', polarity: 'nonpolar' },
  { totalElectronPairs: 4, lonePairs: 1, electronGeometry: 'Tetrahedral', molecularGeometry: 'Trigonal Pyramidal', bondAngles: '<109.5°', polarity: 'polar' },
  { totalElectronPairs: 4, lonePairs: 2, electronGeometry: 'Tetrahedral', molecularGeometry: 'Bent', bondAngles: '<109.5°', polarity: 'polar' },
  { totalElectronPairs: 5, lonePairs: 0, electronGeometry: 'Trigonal Bipyramidal', molecularGeometry: 'Trigonal Bipyramidal', bondAngles: '90°, 120°', polarity: 'nonpolar' },
  { totalElectronPairs: 5, lonePairs: 1, electronGeometry: 'Trigonal Bipyramidal', molecularGeometry: 'Seesaw', bondAngles: '<90°, <120°', polarity: 'polar' },
  { totalElectronPairs: 5, lonePairs: 2, electronGeometry: 'Trigonal Bipyramidal', molecularGeometry: 'T-shaped', bondAngles: '<90°', polarity: 'polar' },
  { totalElectronPairs: 5, lonePairs: 3, electronGeometry: 'Trigonal Bipyramidal', molecularGeometry: 'Linear', bondAngles: '180°', polarity: 'nonpolar' },
  { totalElectronPairs: 6, lonePairs: 0, electronGeometry: 'Octahedral', molecularGeometry: 'Octahedral', bondAngles: '90°', polarity: 'nonpolar' },
  { totalElectronPairs: 6, lonePairs: 1, electronGeometry: 'Octahedral', molecularGeometry: 'Square Pyramidal', bondAngles: '<90°', polarity: 'polar' },
  { totalElectronPairs: 6, lonePairs: 2, electronGeometry: 'Octahedral', molecularGeometry: 'Square Planar', bondAngles: '90°', polarity: 'nonpolar' },
  { totalElectronPairs: 6, lonePairs: 3, electronGeometry: 'Octahedral', molecularGeometry: 'T-shaped', bondAngles: '90°', polarity: 'polar' },
  { totalElectronPairs: 6, lonePairs: 4, electronGeometry: 'Octahedral', molecularGeometry: 'Linear', bondAngles: '180°', polarity: 'nonpolar' },
];
