export const AVATAR_FLIP_INTERVAL_MS = 4000;

export interface AvatarFlipFaces {
  flipped: boolean;
  frontIndex: number;
  backIndex: number;
}

export function avatarFlipFaces(step: number, count: number): AvatarFlipFaces {
  if (count < 2) {
    return { flipped: false, frontIndex: 0, backIndex: 0 };
  }

  if (step === 0) {
    return { flipped: false, frontIndex: 0, backIndex: 1 };
  }

  const flipped = step % 2 === 1;
  const visible = step % count;
  const outgoing = (step + count - 1) % count;

  if (flipped) {
    return { flipped: true, frontIndex: outgoing, backIndex: visible };
  }

  return { flipped: false, frontIndex: visible, backIndex: outgoing };
}
