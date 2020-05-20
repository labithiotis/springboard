export function jsonify(object: object): object {
  return JSON.parse(JSON.stringify(object));
}
