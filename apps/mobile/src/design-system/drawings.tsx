import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from './tokens';

type Tone = 'blue' | 'red' | 'ink' | 'muted' | 'paper';
type PathMark = {
  kind: 'path';
  d: string;
  stroke?: Tone | 'none';
  fill?: Tone | 'none';
  width?: number;
  opacity?: number;
  dash?: readonly number[];
};
type CircleMark = {
  kind: 'circle';
  cx: number;
  cy: number;
  r: number;
  stroke?: Tone | 'none';
  fill?: Tone | 'none';
  width?: number;
  opacity?: number;
};
type DrawingDefinition = {
  label: string;
  viewBox: readonly [number, number, number, number];
  marks: readonly (PathMark | CircleMark)[];
};

const drawings = {
  accessStar: {
    label: 'Access star',
    viewBox: [0, 0, 90, 88],
    marks: [
      {
        kind: 'path',
        d: 'M45 6 L58 40 L86 41 L62 58 L72 84 L45 66 L19 85 L28 57 L5 39 L34 40 Z',
        width: 2.4,
      },
      { kind: 'path', d: 'M34 40 L62 58', width: 1.4, opacity: 0.7 },
    ],
  },
  marginLightning: {
    label: 'Margin lightning',
    viewBox: [0, 0, 60, 130],
    marks: [
      { kind: 'path', d: 'M34 6 L10 68 L30 66 L16 124 L52 54 L30 58 L44 8 Z', width: 2.4 },
      { kind: 'path', d: 'M31 14 L14 62', width: 1.3, opacity: 0.6 },
    ],
  },
  doubleUnderline: {
    label: 'Double underline',
    viewBox: [0, 0, 240, 18],
    marks: [
      { kind: 'path', d: 'M4 7 C60 2 132 12 236 5', width: 2.6 },
      { kind: 'path', d: 'M10 12 C70 8 140 16 230 9', width: 1.8, opacity: 0.85 },
    ],
  },
  punctuation: {
    label: 'Punctuation marks',
    viewBox: [0, 0, 66, 92],
    marks: [
      { kind: 'path', d: 'M9 8 C12 26 11 44 9 58 M8 70 C11 71 12 74 9 76', width: 3 },
      {
        kind: 'path',
        d: 'M31 18 C30 3 60 2 57 20 C55 33 41 34 40 50 C40 55 41 59 42 62 M41 74 C44 75 45 78 42 80',
        width: 3,
      },
    ],
  },
  skullAndCrossbones: {
    label: 'Skull and crossbones',
    viewBox: [0, 0, 70, 74],
    marks: [
      {
        kind: 'path',
        d: 'M35 6 C18 6 10 18 11 28 C12 36 18 38 19 44 L51 44 C52 38 58 36 59 28 C60 18 52 6 35 6 Z',
        width: 2.2,
      },
      {
        kind: 'path',
        d: 'M24 25 C24 20 31 20 31 25 C31 30 24 30 24 25 Z M39 25 C39 20 46 20 46 25 C46 30 39 30 39 25 Z',
        fill: 'blue',
        stroke: 'none',
      },
      { kind: 'path', d: 'M14 56 L56 70 M56 56 L14 70', width: 2.2 },
    ],
  },
  angryFace: {
    label: 'Angry face',
    viewBox: [0, 0, 78, 78],
    marks: [
      {
        kind: 'path',
        d: 'M39 5 C62 5 74 22 73 40 C72 60 57 73 38 73 C19 73 5 59 5 39 C5 20 18 5 39 5 Z',
        width: 2.2,
      },
      { kind: 'path', d: 'M18 26 L33 33 M60 26 L45 33', width: 2.2 },
      { kind: 'path', d: 'M24 38 C26 42 30 42 31 38 M47 38 C49 42 53 42 54 38', width: 2 },
      { kind: 'path', d: 'M25 57 C33 52 45 52 53 57', width: 2.2 },
    ],
  },
  legalScales: {
    label: 'Legal scales',
    viewBox: [0, 0, 44, 44],
    marks: [
      {
        kind: 'path',
        d: 'M22 10 L22 34 M13 34 L31 34 M10 16 L34 16 M10 16 L6 26 M10 16 L14 26 M6 26 C6 30 14 30 14 26 M34 16 L30 26 M34 16 L38 26 M30 26 C30 30 38 30 38 26',
        stroke: 'ink',
        width: 1.3,
      },
      { kind: 'circle', cx: 22, cy: 11, r: 2, stroke: 'none', fill: 'ink' },
    ],
  },
  penAndBurst: {
    label: 'Pen and burst',
    viewBox: [0, 0, 120, 130],
    marks: [
      { kind: 'path', d: 'M104 8 L112 20 L52 96 L40 88 Z M104 8 L46 92', width: 2.2 },
      {
        kind: 'path',
        d: 'M50 78 L22 108 M32 92 L60 106 M30 104 L18 118 L30 124 L40 112 Z',
        width: 2.2,
      },
      { kind: 'path', d: 'M14 88 L4 82 M18 78 L10 68 M28 72 L24 60', width: 1.6, opacity: 0.8 },
    ],
  },
  registrationHorn: {
    label: 'Registration horn',
    viewBox: [0, 0, 190, 124],
    marks: [
      {
        kind: 'path',
        d: 'M96 52 L146 24 L158 40 L120 60 L158 82 L146 98 L96 70 Z M46 56 L96 52 L96 70 L46 66 Z M46 52 L22 48 L18 70 L46 70 Z',
        width: 3.4,
      },
      {
        kind: 'path',
        d: 'M24 48 L22 40 M32 49 L30 41 M24 70 L22 78 M32 70 L30 78 M152 22 L168 8 L158 8 L174 -8 M152 100 L168 112 L158 114 L176 128 M78 44 L64 26 L76 26 L62 8',
        width: 2.6,
      },
      {
        kind: 'path',
        d: 'M42 58 L118 58 M42 62 L118 64 M42 65 L116 68 M138 92 C146 100 152 104 158 106 M100 82 C96 92 94 98 94 104',
        width: 1.6,
        opacity: 0.7,
      },
    ],
  },
  startledRegistrant: {
    label: 'Startled registrant',
    viewBox: [0, 0, 150, 160],
    marks: [
      {
        kind: 'path',
        d: 'M46 60 C44 42 58 30 75 30 C92 30 106 42 104 60 C102 76 90 86 75 86 C60 86 48 76 46 60 Z',
        width: 3,
      },
      {
        kind: 'path',
        d: 'M56 54 C56 45 70 45 70 54 C70 63 56 63 56 54 Z M80 54 C80 45 94 45 94 54 C94 63 80 63 80 54 Z M69 74 C69 68 81 68 81 74 C81 81 69 81 69 74 Z',
        width: 2.7,
      },
      { kind: 'circle', cx: 63, cy: 55, r: 3.2, stroke: 'none', fill: 'blue' },
      { kind: 'circle', cx: 87, cy: 55, r: 3.2, stroke: 'none', fill: 'blue' },
      {
        kind: 'path',
        d: 'M75 86 L75 118 M75 94 L52 108 M75 94 L98 108 M75 118 L58 150 M75 118 L92 150 M75 26 L75 2 M56 32 L44 10 M94 32 L106 10 M44 46 L18 36 M106 46 L132 36 M42 64 L16 70 M108 64 L134 70',
        width: 3,
      },
    ],
  },
  registrationArrow: {
    label: 'Registration arrow',
    viewBox: [0, 0, 170, 110],
    marks: [
      { kind: 'path', d: 'M8 10 C66 4 128 22 132 88', width: 3.2 },
      { kind: 'path', d: 'M116 70 C122 80 128 88 133 96 C139 86 146 78 154 70', width: 3.2 },
    ],
  },
  cryingFace: {
    label: 'Crying face',
    viewBox: [0, 0, 58, 60],
    marks: [
      {
        kind: 'path',
        d: 'M18 8 C7 13 4 28 11 40 C18 51 40 53 49 44 C57 35 54 15 42 9 C35 6 24 6 20 9',
        width: 2.2,
      },
      {
        kind: 'path',
        d: 'M17 24 C20 20 24 21 26 25 M35 23 C38 19 43 21 44 26 M21 36 C26 32 37 33 40 39 C36 44 25 44 21 37',
        width: 1.8,
      },
      { kind: 'path', d: 'M20 29 L16 35 M17 38 L14 43 M42 30 L46 36', width: 1.5 },
    ],
  },
  redUnderline: {
    label: 'Red underline',
    viewBox: [0, 0, 230, 12],
    marks: [{ kind: 'path', d: 'M2 5 C58 1 148 10 228 4', stroke: 'red', width: 2.2 }],
  },
  retirementArrow: {
    label: 'Retirement arrow',
    viewBox: [0, 0, 40, 34],
    marks: [
      { kind: 'path', d: 'M34 30 C26 24 16 16 8 6', width: 2 },
      { kind: 'path', d: 'M6 17 C5 12 5 8 6 4 C10 7 14 10 18 12', width: 2 },
    ],
  },
  acknowledgmentCheck: {
    label: 'Acknowledgment check',
    viewBox: [0, 0, 24, 24],
    marks: [{ kind: 'path', d: 'M4 13 C8 16 10 20 12 22 C15 14 20 6 27 1', width: 2.6 }],
  },
  acknowledgmentArrow: {
    label: 'Acknowledgment arrow',
    viewBox: [0, 0, 40, 40],
    marks: [
      { kind: 'path', d: 'M20 37 C17 26 15 14 16 4', width: 2.2 },
      { kind: 'path', d: 'M8 15 C12 10 15 6 16 3 C19 7 23 11 27 14', width: 2.2 },
    ],
  },
  redConditionCircle: {
    label: 'Red condition circle',
    viewBox: [0, 0, 160, 44],
    marks: [
      {
        kind: 'path',
        d: 'M26 6 C74 0 152 4 156 21 C158 35 84 41 42 39 C12 37 2 30 5 19 C8 9 36 2 92 3',
        stroke: 'red',
        width: 2,
      },
    ],
  },
  blueConditionCircle: {
    label: 'Blue condition circle',
    viewBox: [0, 0, 160, 44],
    marks: [
      {
        kind: 'path',
        d: 'M24 5 C72 0 150 5 155 21 C157 34 82 41 40 38 C11 36 1 29 4 18 C7 8 34 1 90 2',
        width: 2,
      },
    ],
  },
  commitmentArrow: {
    label: 'Commitment arrow',
    viewBox: [0, 0, 46, 20],
    marks: [
      { kind: 'path', d: 'M2 11 C16 8 28 12 42 10', width: 2 },
      { kind: 'path', d: 'M32 4 C37 7 41 9 44 10 C40 12 36 15 32 18', width: 2 },
    ],
  },
  filedContract: {
    label: 'Filed contract',
    viewBox: [0, 0, 54, 62],
    marks: [
      { kind: 'path', d: 'M9 5 C20 3 33 7 44 4 L47 52 C34 56 20 51 7 54 Z', width: 2 },
      {
        kind: 'path',
        d: 'M15 17 C23 15 32 19 40 16 M16 27 C24 25 32 29 41 26 M17 37 C24 35 30 38 36 37 M22 47 C30 44 38 48 44 45',
        width: 1.4,
        opacity: 0.8,
      },
    ],
  },
  chicken: {
    label: 'Chicken',
    viewBox: [0, 0, 76, 66],
    marks: [
      {
        kind: 'path',
        d: 'M18 44 C11 34 18 23 31 22 C43 21 52 28 51 39 C50 48 39 53 28 51 C22 50 19 47 18 44 Z M44 26 C43 19 47 13 53 13 C60 13 64 18 62 25 C61 30 55 32 51 30',
        width: 2,
      },
      {
        kind: 'path',
        d: 'M47 10 C48 6 51 8 53 4 C54 8 57 6 58 10 M62 20 L72 22 L62 26 M18 34 C10 29 7 22 9 16 C14 21 17 24 21 27 M28 51 L26 62 M21 62 L32 62 M40 50 L43 62 M38 62 L49 62',
        width: 1.8,
      },
      { kind: 'path', d: 'M55 19 C56 19 57 20 56 21', width: 2.4 },
    ],
  },
  noBackingOutArrow: {
    label: 'No-backing-out arrow',
    viewBox: [0, 0, 78, 34],
    marks: [
      { kind: 'path', d: 'M3 18 C24 15 46 20 70 17', width: 2.2 },
      { kind: 'path', d: 'M56 7 C63 12 68 15 72 17 C67 20 61 24 55 29', width: 2.2 },
    ],
  },
  flame: {
    label: 'Flame',
    viewBox: [0, 0, 60, 84],
    marks: [
      {
        kind: 'path',
        d: 'M30 4 C20 20 12 28 11 44 C10 62 21 78 32 79 C45 80 53 66 51 50 C50 38 41 32 39 20 C36 30 33 32 30 30 C33 22 33 12 30 4 Z',
        width: 2.2,
      },
      {
        kind: 'path',
        d: 'M30 44 C25 52 23 60 27 70 M41 48 C45 56 44 64 39 71',
        width: 1.6,
        opacity: 0.8,
      },
    ],
  },
  singleUnderline: {
    label: 'Single underline',
    viewBox: [0, 0, 130, 12],
    marks: [{ kind: 'path', d: 'M2 5 C34 1 92 9 128 3', width: 1.8 }],
  },
  judgmentBolt: {
    label: 'Judgment bolt',
    viewBox: [0, 0, 40, 48],
    marks: [
      { kind: 'path', d: 'M20 3 L32 21 L26 21 L37 44 L20 30 L3 44 L14 21 L8 21 Z', width: 2.6 },
      { kind: 'path', d: 'M20 3 L8 21 M20 3 L32 21', width: 2.6 },
    ],
  },
  verdictCheck: {
    label: 'Verdict check',
    viewBox: [0, 0, 60, 58],
    marks: [
      { kind: 'path', d: 'M8 10 L52 10 L52 52 L8 52 Z', stroke: 'muted', width: 1.4 },
      { kind: 'path', d: 'M13 30 C20 36 24 44 27 49 C33 32 44 14 57 2', width: 3.4 },
    ],
  },
  sendItScene: {
    label: 'Send-it scene',
    viewBox: [0, 0, 104, 78],
    marks: [
      {
        kind: 'path',
        d: 'M4 36 C15 33 28 38 40 35 L44 74 C30 77 15 72 6 75 Z M72 24 L84 34 L46 62 L34 52 Z M46 62 L34 52 L30 68 Z',
        stroke: 'ink',
        width: 2.2,
      },
      {
        kind: 'path',
        d: 'M11 47 C19 45 28 49 36 46 M12 56 C20 54 28 58 37 55 M14 66 C21 64 27 67 32 66 M66 30 L78 40',
        stroke: 'ink',
        width: 1.6,
        opacity: 0.8,
      },
      {
        kind: 'path',
        d: 'M76 20 C62 12 70 4 84 1 C78 11 86 14 94 10 C102 22 95 40 80 41 C67 41 65 27 76 20 Z M80 15 C74 21 74 30 80 35 M89 19 C93 26 92 33 87 37',
        stroke: 'ink',
        width: 2.2,
      },
    ],
  },
  rejectionFigure: {
    label: 'Rejection figure',
    viewBox: [0, 0, 78, 84],
    marks: [
      {
        kind: 'path',
        d: 'M24 12 C12 17 8 30 14 40 C20 51 42 54 53 47 C64 40 63 22 52 15 C45 10 33 9 26 13 M28 52 C26 60 27 68 31 74 C39 78 48 76 51 70 C53 63 52 55 49 50',
        stroke: 'red',
        width: 2.2,
      },
      {
        kind: 'path',
        d: 'M35 6 C33 2 36 1 37 4 M43 7 C43 2 47 2 46 6 M22 26 C26 22 30 23 32 27 M42 25 C46 21 51 23 52 28 M28 36 C33 32 44 33 47 39 C44 45 32 45 28 37 M26 31 L22 37 M23 40 L20 45 M50 32 L55 38 M54 41 L57 46 M28 52 C20 60 15 65 14 71 M51 57 C58 59 63 63 65 69 M33 75 L31 82 M45 74 L47 82',
        stroke: 'red',
        width: 1.8,
      },
    ],
  },
  createAndSendArrow: {
    label: 'Create-and-send arrow',
    viewBox: [0, 0, 40, 26],
    marks: [
      { kind: 'path', d: 'M37 20 C25 19 13 13 4 4', width: 2.1 },
      { kind: 'path', d: 'M3 14 C3 10 3 6 3 3 C8 5 12 7 16 8', width: 2.1 },
    ],
  },
  recordTally: {
    label: 'Record tally',
    viewBox: [0, 0, 44, 20],
    marks: [
      {
        kind: 'path',
        d: 'M4 4 C3 9 4 13 3 17 M11 3 C10 8 11 13 10 17 M18 4 C17 9 18 13 17 17 M25 3 C24 8 25 13 24 17 M35 4 C34 9 35 13 34 17 M42 3 C41 8 42 13 41 17',
        width: 1.7,
      },
      { kind: 'path', d: 'M1 15 C9 10 20 6 28 3', width: 1.7 },
    ],
  },
  endOfRecord: {
    label: 'End-of-record flourish',
    viewBox: [0, 0, 200, 40],
    marks: [
      {
        kind: 'path',
        d: 'M6 24 C26 8 42 34 62 18 C80 4 94 32 114 20 C132 9 148 32 168 20 C178 14 188 16 194 22',
        width: 2,
      },
      { kind: 'path', d: 'M100 32 C100 35 100 37 100 38', width: 1.6, opacity: 0.7 },
    ],
  },
  emptyRecord: {
    label: 'Empty-record file',
    viewBox: [0, 0, 150, 110],
    marks: [
      {
        kind: 'path',
        d: 'M28 16 L122 16 L122 96 L28 96 Z M40 34 L110 34 M40 48 L110 48 M40 62 L92 62',
        stroke: 'muted',
        width: 1.4,
        dash: [5, 6],
      },
      {
        kind: 'path',
        d: 'M34 22 C62 44 92 68 118 90 M118 22 C92 44 62 68 34 90',
        width: 2.1,
        opacity: 0.85,
      },
      { kind: 'path', d: 'M64 104 C78 100 96 102 108 106', width: 1.6, opacity: 0.6 },
    ],
  },
  startSomethingArrow: {
    label: 'Start-something arrow',
    viewBox: [0, 0, 50, 34],
    marks: [
      { kind: 'path', d: 'M3 6 C18 8 34 16 44 28', width: 2.1 },
      { kind: 'path', d: 'M31 26 C38 28 42 29 46 30 C43 25 41 20 40 15', width: 2.1 },
    ],
  },
  recordError: {
    label: 'Record-error file',
    viewBox: [0, 0, 150, 110],
    marks: [
      {
        kind: 'path',
        d: 'M30 14 L120 14 L120 94 L30 94 Z M36 30 C60 22 92 38 116 28 M36 44 C60 36 92 52 116 42 M36 58 C60 50 92 66 116 56 M36 72 C60 64 92 80 116 70 M28 100 C46 92 66 104 84 96 C98 90 112 98 124 92',
        stroke: 'muted',
        width: 1.4,
      },
      { kind: 'path', d: 'M126 8 C132 20 136 32 138 44 M138 54 C138 56 138 58 138 59', width: 2 },
    ],
  },
  newChallengeArrow: {
    label: 'New-challenge arrow',
    viewBox: [0, 0, 40, 34],
    marks: [
      { kind: 'path', d: 'M36 28 C24 26 12 18 5 7', width: 2.1 },
      { kind: 'path', d: 'M4 18 C4 13 4 9 4 5 C9 7 14 9 19 10', width: 2.1 },
    ],
  },
  challengeDuel: {
    label: 'Challenge duel',
    viewBox: [0, 0, 92, 46],
    marks: [
      { kind: 'circle', cx: 17, cy: 11, r: 5.2, stroke: 'ink', fill: 'none', width: 2 },
      { kind: 'circle', cx: 75, cy: 12, r: 5.2, stroke: 'ink', fill: 'none', width: 2 },
      {
        kind: 'path',
        d: 'M17 16.5 C16 21 17 25 16.5 29 M16.5 29 C13 33 11 36 9.5 40 M16.5 29 C19 33 21 36 23 39 M17 20 C24 18.5 30 18 35 19.5 M17 21 C12 23 9 26 8 29 M75 17.5 C76 22 75 26 75.5 30 M75.5 30 C79 34 81 37 82.5 41 M75.5 30 C73 34 71 37 69 40 M75 21 C68 19.5 62 19 57 20.5 M75 22 C80 24 83 27 84 30 M46 20 L39 15 M46 20 L53 15 M46 20 L38 24 M46 20 L54 24 M46 20 L46 11',
        stroke: 'ink',
        width: 2,
      },
    ],
  },
} as const satisfies Record<string, DrawingDefinition>;

export type AppDrawingName = keyof typeof drawings;
export const appDrawingNames = Object.keys(drawings) as AppDrawingName[];
export const appDrawingLabel = (name: AppDrawingName) => drawings[name].label;

function toneColor(tone: Tone | 'none') {
  if (tone === 'none') return 'none';
  if (tone === 'red') return colors.redInk;
  if (tone === 'ink') return colors.ink;
  if (tone === 'muted') return colors.mutedInk;
  if (tone === 'paper') return colors.raisedPaper;
  return colors.blueInk;
}

export function AppDrawing({
  name,
  width = 112,
  testID,
}: {
  name: AppDrawingName;
  width?: number;
  testID?: string;
}) {
  const drawing = drawings[name];
  const [, , viewWidth, viewHeight] = drawing.viewBox;
  return (
    <View
      testID={testID}
      accessibilityLabel={drawing.label}
      style={{ width, aspectRatio: viewWidth / viewHeight }}
    >
      <Svg width="100%" height="100%" viewBox={drawing.viewBox.join(' ')}>
        {(drawing.marks as readonly (PathMark | CircleMark)[]).map((mark, index) => {
          const common = {
            stroke: toneColor(mark.stroke ?? 'blue'),
            fill: toneColor(mark.fill ?? 'none'),
            strokeWidth: mark.width ?? 2,
            opacity: mark.opacity ?? 1,
            strokeLinecap: 'round' as const,
            strokeLinejoin: 'round' as const,
          };
          if (mark.kind === 'circle') {
            return (
              <Circle key={`${name}-${index}`} {...common} cx={mark.cx} cy={mark.cy} r={mark.r} />
            );
          }
          return (
            <Path
              key={`${name}-${index}`}
              {...common}
              {...(mark.dash ? { strokeDasharray: mark.dash.join(' ') } : {})}
              d={mark.d}
            />
          );
        })}
      </Svg>
    </View>
  );
}
