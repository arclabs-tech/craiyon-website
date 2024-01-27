const texts = [["Hello Robert. I am Maria. I am your personal assistant."]];

export function getText(id: number) {
  return texts[id - 1];
}
