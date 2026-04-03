import { TL } from './constants';

export const ACTS = {
  SA: ["Identifier UN seul flux de valeur et UN seul client.", "Transférer l'outillage interne à une Platform team.", "Connecter directement au feedback client."],
  PL: ["Transformer le premier service en self-service (docs, API, 0 réunion).", "Mesurer la Developer Experience.", "Arrêter le travail custom par équipe."],
  EN: ["Poser une date de fin sur chaque engagement.", "Mesurer le transfert de compétence, pas l'output.", "Ne rien posséder en production."],
  CS: ["Définir et documenter la frontière d'expertise.", "Fournir des APIs, pas de la collaboration.", "Réduire la surface de contact."],
};

export function getClarityMessage(cl, cK, c2K) {
  if (cl.lv === "high") return `Cette équipe a une identité ${TL[cK]} claire. Le travail porte sur le gap vers le Target.`;
  if (cl.lv === "medium") return `Cette équipe opère comme ${TL[cK]} et ${TL[c2K]} en même temps. Clarifier le mandat avant d'optimiser.`;
  return "Cette équipe n'a pas d'identité claire. Trop de mandats. Restreindre ou splitter.";
}

export function getGapMessage(a) {
  if (a.cK === a.tK)
    return `Consolidation : renforcer votre identité ${TL[a.cK]} de ${a.cP}% à ${a.tP}%. Focus : réduire les activités ${TL[a.c2K]} qui diluent votre mission.`;
  return `Transition : passer de ${TL[a.cK]} (${a.cP}%) vers ${TL[a.tK]} (${a.tP}%).`;
}
