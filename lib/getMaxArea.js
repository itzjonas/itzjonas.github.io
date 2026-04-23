function insertionPoint(arr, val) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === val) {
      return -1;
    }
    if (arr[mid] < val) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return left;
}

function maxRectArea(vCuts, hCuts) {
  let best = 0;

  for (let i = 0; i < vCuts.length - 1; i++) {
    const dx = vCuts[i + 1] - vCuts[i];
    for (let j = 0; j < hCuts.length - 1; j++) {
      const dy = hCuts[j + 1] - hCuts[j];
      const area = dx * dy;
      if (area > best) {
        best = area;
      }
    }
  }

  return best;
}

function tryInsertSorted(sorted, pos) {
  const idx = insertionPoint(sorted, pos);
  if (idx === -1) {
    return;
  }
  if (idx === 0 || idx === sorted.length) {
    return;
  }
  const prev = sorted[idx - 1];
  const next = sorted[idx];
  if (pos <= prev || pos >= next) {
    return;
  }
  sorted.splice(idx, 0, pos);
}

export function getMaxArea(w, h, isVertical, distance) {
  const n = isVertical.length;
  const result = new Array(n);
  const hCuts = [0, h];
  const vCuts = [0, w];

  for (let i = 0; i < n; i++) {
    const isVert = Boolean(isVertical[i]);
    const pos = distance[i];

    if (isVert) {
      tryInsertSorted(vCuts, pos);
    } else {
      tryInsertSorted(hCuts, pos);
    }

    result[i] = maxRectArea(vCuts, hCuts);
  }

  return result;
}
