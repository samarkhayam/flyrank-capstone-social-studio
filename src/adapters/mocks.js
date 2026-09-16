import {SocialPublisher} from "./socialPublisher.js";
export const mockStore=new Map();
export class MockXPublisher extends SocialPublisher{async publish({body,idempotencyKey}){const id=`mock-x-${idempotencyKey}`;mockStore.set(id,{platform:"x",body});return{externalId:id}}}
export class MockLinkedInPublisher extends SocialPublisher{async publish({body,idempotencyKey}){const id=`mock-linkedin-${idempotencyKey}`;mockStore.set(id,{platform:"linkedin",body});return{externalId:id}}}
