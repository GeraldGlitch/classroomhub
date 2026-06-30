const AVATAR_MAP: Record<string, string> = {
  "Blue Boy": "blue-knight.png",
  "Blue Girl": "blue.png",
  "Red Boy": "red-knight.png",
  "Red Girl": "red.png",
  "Green Boy": "green-knight.png",
  "Green Girl": "green.png",
  "Orange Boy": "orange-knight.png",
  "Orange Girl": "orange.png",
  "Pink Boy": "pink-knight.png",
  "Pink Girl": "pink.png",
  "Purple Boy": "purple-knight.png",
  "Purple Girl": "purple.png",
  "Yellow Boy": "yellow-knight.png",
  "Yellow Girl": "yellow.png",
  "Gray Boy": "gray-knight.png",
  "Grey Girl": "grey.png",
}

export function getAvatarSrc(avatarUrl: string | null): string | null {
  if (!avatarUrl) return null
  const filename = AVATAR_MAP[avatarUrl]
  if (!filename) return null
  return `/${filename}`
}
