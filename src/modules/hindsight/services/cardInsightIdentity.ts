/** Distinguish the same widget at different scopes, metric selections and data snapshots. */
export function cardInsightKey({planCode,seasonCode,scope,payload}:{planCode:string;seasonCode:number;scope:string;payload:{cardType?:unknown}}):string {
  return [payload.cardType,scope,planCode,seasonCode,JSON.stringify(payload)].join('|');
}
