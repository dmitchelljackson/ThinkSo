import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from './tokens';

const AnimatedPath = Animated.createAnimatedComponent(Path);

type Segment = readonly [number, number, number, number];
type Wobble = readonly [number, number, number, number, number, number, number];

const SEGMENTS = [
  [12, 24, 12, 42],
  [30, 24, 30, 42],
  [48, 24, 48, 42],
  [12, 60, 12, 78],
  [30, 60, 30, 78],
  [48, 60, 48, 78],
  [12, 24, 30, 6],
  [30, 6, 48, 24],
  [12, 42, 30, 60],
  [30, 42, 48, 60],
  [12, 78, 30, 96],
  [30, 96, 48, 78],
  [48, 42, 39, 51],
  [12, 60, 21, 51],
] as const satisfies readonly Segment[];

const WOBBLE = [
  [0.9, -1.1, -0.7, 0.8, 2.4, 1.1, 0.95],
  [-1.2, 0.6, 1, -0.9, -1.9, 0.94, 1],
  [0.7, 1, -1.1, -0.6, 1.6, 1.04, 0.9],
  [-0.8, -0.7, 0.9, 1.1, -2.2, 0.97, 0.98],
  [1.1, 0.8, -0.6, -1, 2, 1.08, 0.92],
  [-0.6, 1.2, 1.2, 0.7, -1.5, 0.92, 1],
  [1, -0.9, -1.2, 0.6, 2.6, 1.06, 0.94],
  [-1.1, 0.7, 0.8, -1.2, -2.3, 0.96, 0.97],
  [0.6, 1.1, -0.9, 0.9, 1.8, 1.02, 0.91],
  [-0.9, -1, 1.1, -0.7, -2.5, 1.09, 0.99],
  [1.2, 0.9, -0.8, 1, 2.1, 0.93, 0.93],
  [-0.7, -1.2, 0.7, -0.8, -1.7, 1.05, 1],
  [0.8, 0.6, -1, 1.2, 1.4, 0.98, 0.88],
  [-1, 1, 0.6, -1.1, -1.3, 1.03, 0.9],
] as const satisfies readonly Wobble[];

function penStroke(segment: Segment, wobble: Wobble) {
  const [x1, y1, x2, y2] = segment;
  const [dx1, dy1, dx2, dy2, bow] = wobble;
  let ax = x1 + dx1;
  let ay = y1 + dy1;
  let bx = x2 + dx2;
  let by = y2 + dy2;
  const vx = bx - ax;
  const vy = by - ay;
  const length = Math.hypot(vx, vy) || 1;
  const overshootX = (vx / length) * 1.6;
  const overshootY = (vy / length) * 1.6;
  ax -= overshootX * 0.5;
  ay -= overshootY * 0.5;
  bx += overshootX;
  by += overshootY;
  const normalX = -vy / length;
  const normalY = vx / length;
  const middleX = (ax + bx) / 2 + normalX * bow;
  const middleY = (ay + by) / 2 + normalY * bow;
  const c1x = ax + (middleX - ax) * 0.75;
  const c1y = ay + (middleY - ay) * 0.75;
  const c2x = bx + (middleX - bx) * 0.75;
  const c2y = by + (middleY - by) * 0.75;
  const round = (value: number) => value.toFixed(2);
  const pointAt = (t: number, start: number, control1: number, control2: number, end: number) => {
    const inverse = 1 - t;
    return (
      inverse ** 3 * start +
      3 * inverse ** 2 * t * control1 +
      3 * inverse * t ** 2 * control2 +
      t ** 3 * end
    );
  };
  let pathLength = 0;
  let previousX = ax;
  let previousY = ay;
  for (let step = 1; step <= 24; step += 1) {
    const t = step / 24;
    const x = pointAt(t, ax, c1x, c2x, bx);
    const y = pointAt(t, ay, c1y, c2y, by);
    pathLength += Math.hypot(x - previousX, y - previousY);
    previousX = x;
    previousY = y;
  }
  return {
    d: `M${round(ax)} ${round(ay)} C ${round(c1x)} ${round(c1y)}, ${round(c2x)} ${round(c2y)}, ${round(bx)} ${round(by)}`,
    length: pathLength,
  };
}

const STROKES = SEGMENTS.map((segment, index) => penStroke(segment, WOBBLE[index]!));

export function LoadingS({
  label = 'Loading',
  testID,
  size = 28,
  ink = colors.blueInk,
  strokeWidth = 3.4,
  speed = 1,
}: {
  label?: string;
  testID?: string;
  size?: number;
  ink?: string;
  strokeWidth?: number;
  speed?: number;
}) {
  const strokes = useRef(STROKES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const duration = (milliseconds: number) => milliseconds / Math.max(0.1, speed);
    const animation = Animated.loop(
      Animated.sequence([
        ...strokes.map((stroke) =>
          Animated.timing(stroke, {
            toValue: 1,
            duration: duration(78),
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ),
        Animated.delay(duration(420)),
        Animated.delay(duration(620)),
        ...[...strokes].reverse().map((stroke) =>
          Animated.timing(stroke, {
            toValue: 0,
            duration: duration(58),
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ),
        Animated.delay(duration(140)),
      ]),
      { resetBeforeIteration: true },
    );
    animation.start();
    return () => animation.stop();
  }, [speed, strokes]);

  return (
    <View
      testID={testID}
      accessibilityLabel={label}
      accessibilityRole="progressbar"
      style={{ width: size, height: size * 1.7, alignItems: 'center', justifyContent: 'center' }}
    >
      <View
        testID={testID ? `${testID}-mark` : undefined}
        style={{
          width: size,
          height: size * 1.7,
        }}
      >
        <Svg width="100%" height="100%" viewBox="0 0 60 102">
          {STROKES.map((stroke, index) => (
            <AnimatedPath
              key={stroke.d}
              d={stroke.d}
              fill="none"
              stroke={ink}
              strokeWidth={strokeWidth * WOBBLE[index]![5]}
              strokeLinecap="round"
              opacity={strokes[index]!.interpolate({
                inputRange: [0, 0.001, 1],
                outputRange: [0, WOBBLE[index]![6], WOBBLE[index]![6]],
              })}
              strokeDasharray={[stroke.length, stroke.length]}
              strokeDashoffset={strokes[index]!.interpolate({
                inputRange: [0, 1],
                outputRange: [stroke.length, 0],
              })}
            />
          ))}
        </Svg>
      </View>
    </View>
  );
}
