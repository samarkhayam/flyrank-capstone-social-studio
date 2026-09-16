import {validateVariant} from "./constraints.js";
const summary=p=>p.body.replace(/\s+/g," ").trim().slice(0,180);
export function make(platform,p){const s=summary(p);let b;if(platform==="mock_x")b=`${p.title}: ${s} #Engineering`;else if(platform==="mock_linkedin")b=`${p.title}\n\n${s}\n\nReliable systems make retries and state transitions explicit.\n\n#Engineering #Backend`;else b=`📌 ${p.title}\n\n${s}\n\nBackend takeaway: make failure recoverable and visible.`;const v=validateVariant(platform,b);if(!v.ok)throw new Error(v.errors.join("; "));return b;}
export const platforms=["mock_x","mock_linkedin","telegram"];
